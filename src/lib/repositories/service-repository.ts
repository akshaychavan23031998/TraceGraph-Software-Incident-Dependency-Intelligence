import "server-only";

import neo4j, { type Driver } from "neo4j-driver";

import { getDatabaseDriver } from "@/lib/db/driver";
import { nodeProperties, pathNodes, toNativeNumber } from "@/lib/db/values";
import { DatabaseError } from "@/lib/errors/database-error";
import type {
  BlastRadiusService,
  DependencyPath,
  ServiceDetails,
  ServiceExpert,
  ServiceReference,
  ServiceTopology,
} from "@/types/api";
import type { Service, Team } from "@/types/graph";

export type DependencyDepth = 1 | 2 | 3 | 4 | 5 | 6;

const withDatabaseError = (error: unknown): never => {
  throw new DatabaseError("Service graph query failed.", { cause: error });
};

export class ServiceRepository {
  private readonly driver: Driver;

  constructor(driver?: Driver) {
    try {
      this.driver = driver ?? getDatabaseDriver();
    } catch (error) {
      throw new DatabaseError("Database configuration is unavailable.", {
        cause: error,
      });
    }
  }

  async list(): Promise<Service[]> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(`
          MATCH (service:Service)
          RETURN service
          ORDER BY service.name
        `),
      );

      return result.records.map((record) =>
        nodeProperties<Service>(record.get("service")),
      );
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async getTopology(): Promise<ServiceTopology> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      return await session.executeRead(async (transaction) => {
        const nodeResult = await transaction.run(`
          MATCH (service:Service)
          RETURN service
          ORDER BY service.name
        `);
        const edgeResult = await transaction.run(`
          MATCH (source:Service)-[dependency:DEPENDS_ON]->(target:Service)
          RETURN
            source.id AS source,
            target.id AS target,
            dependency.dependencyType AS dependencyType,
            dependency.critical AS critical
          ORDER BY source.name, target.name
        `);

        return {
          nodes: nodeResult.records.map((record) =>
            nodeProperties<Service>(record.get("service")),
          ),
          edges: edgeResult.records.map((record) => ({
            source: record.get("source"),
            target: record.get("target"),
            dependencyType: record.get("dependencyType"),
            critical: record.get("critical"),
          })),
        };
      });
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async findById(serviceId: string): Promise<Service | null> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(
          `
            MATCH (service:Service {id: $serviceId})
            RETURN service
          `,
          { serviceId },
        ),
      );
      const record = result.records[0];

      return record ? nodeProperties<Service>(record.get("service")) : null;
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async getDetails(serviceId: string): Promise<ServiceDetails | null> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      return await session.executeRead(async (transaction) => {
        const serviceResult = await transaction.run(
          `
            MATCH (service:Service {id: $serviceId})
            OPTIONAL MATCH (team:Team)-[:OWNS]->(service)
            RETURN service, team
          `,
          { serviceId },
        );
        const record = serviceResult.records[0];

        if (!record) {
          return null;
        }

        const dependencyResult = await transaction.run(
          `
            MATCH (:Service {id: $serviceId})-[:DEPENDS_ON]->(dependency:Service)
            RETURN dependency
            ORDER BY dependency.name
          `,
          { serviceId },
        );
        const dependentResult = await transaction.run(
          `
            MATCH (dependent:Service)-[:DEPENDS_ON]->(:Service {id: $serviceId})
            RETURN dependent
            ORDER BY dependent.name
          `,
          { serviceId },
        );
        const teamNode = record.get("team");

        return {
          service: nodeProperties<Service>(record.get("service")),
          team: teamNode ? nodeProperties<Team>(teamNode) : null,
          dependencies: dependencyResult.records.map((item) =>
            nodeProperties<ServiceReference>(item.get("dependency")),
          ),
          dependents: dependentResult.records.map((item) =>
            nodeProperties<ServiceReference>(item.get("dependent")),
          ),
        };
      });
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async findDependencyPaths(
    serviceId: string,
    maxDepth: DependencyDepth,
  ): Promise<DependencyPath[]> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      // Cypher path bounds cannot be parameters. maxDepth is a closed numeric union
      // produced by strict route validation, so only 1..6 can enter query syntax.
      const result = await session.executeRead((transaction) =>
        transaction.run(
          `
            MATCH path = (:Service {id: $serviceId})-[:DEPENDS_ON*1..${maxDepth}]->(:Service)
            RETURN path
            ORDER BY length(path)
          `,
          { serviceId },
        ),
      );

      return result.records.map((record) => {
        const path = record.get("path");

        return {
          hopCount: path.segments.length,
          nodes: pathNodes(path).map((node) =>
            nodeProperties<ServiceReference>(node),
          ),
        };
      });
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async findUpstreamServices(serviceId: string): Promise<BlastRadiusService[]> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(
          `
            MATCH path = (affected:Service)-[:DEPENDS_ON*1..8]->(:Service {id: $serviceId})
            RETURN affected, length(path) AS hops
            ORDER BY hops, affected.name
          `,
          { serviceId },
        ),
      );

      return result.records.map((record) => ({
        ...nodeProperties<ServiceReference>(record.get("affected")),
        hops: toNativeNumber(record.get("hops")),
      }));
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async findShortestPath(fromId: string, toId: string): Promise<DependencyPath | null> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(
          `
            MATCH path = (:Service {id: $fromId})-[:DEPENDS_ON*1..8]->(:Service {id: $toId})
            RETURN path
            ORDER BY length(path)
            LIMIT 1
          `,
          { fromId, toId },
        ),
      );
      const record = result.records[0];

      if (!record) {
        return null;
      }

      const path = record.get("path");
      return {
        hopCount: path.segments.length,
        nodes: pathNodes(path).map((node) =>
          nodeProperties<ServiceReference>(node),
        ),
      };
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async findExperts(serviceId: string): Promise<ServiceExpert[]> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(
          `
            MATCH (:Service {id: $serviceId})-[:DEPENDS_ON*0..2]-(related:Service)
            MATCH (incident:Incident)-[:AFFECTED]->(related)
            MATCH (engineer:Engineer)-[:RESOLVED]->(incident)
            RETURN engineer, count(DISTINCT incident) AS resolvedIncidentCount
            ORDER BY resolvedIncidentCount DESC, engineer.name
          `,
          { serviceId },
        ),
      );

      return result.records.map((record) => ({
        ...nodeProperties<ServiceExpert>(record.get("engineer")),
        resolvedIncidentCount: toNativeNumber(record.get("resolvedIncidentCount")),
      }));
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }
}
