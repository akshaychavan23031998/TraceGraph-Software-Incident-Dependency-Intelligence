import "server-only";

import neo4j, { type Driver } from "neo4j-driver";

import { getDatabaseDriver } from "@/lib/db/driver";
import { nodeProperties } from "@/lib/db/values";
import { DatabaseError } from "@/lib/errors/database-error";
import type { AffectedService, IncidentDetails } from "@/types/api";
import type { Deployment, Engineer, Incident, Runbook, Service, Team } from "@/types/graph";

const withDatabaseError = (error: unknown): never => {
  throw new DatabaseError("Incident query failed.", { cause: error });
};

export class IncidentRepository {
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

  async list(): Promise<Incident[]> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.executeRead((transaction) =>
        transaction.run(`
          MATCH (incident:Incident)
          RETURN incident
          ORDER BY incident.startedAt DESC
        `),
      );

      return result.records.map((record) =>
        nodeProperties<Incident>(record.get("incident")),
      );
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }

  async getDetails(incidentId: string): Promise<IncidentDetails | null> {
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      return await session.executeRead(async (transaction) => {
        const incidentResult = await transaction.run(
          `
            MATCH (incident:Incident {id: $incidentId})
            RETURN incident
          `,
          { incidentId },
        );
        const incidentRecord = incidentResult.records[0];

        if (!incidentRecord) {
          return null;
        }

        const affectedResult = await transaction.run(
          `
            MATCH (:Incident {id: $incidentId})-[affected:AFFECTED]->(service:Service)
            OPTIONAL MATCH (team:Team)-[:OWNS]->(service)
            RETURN service, affected.impact AS impact, team
            ORDER BY service.name
          `,
          { incidentId },
        );
        const deploymentResult = await transaction.run(
          `
            MATCH (deployment:Deployment)-[:TRIGGERED]->(:Incident {id: $incidentId})
            RETURN deployment
            ORDER BY deployment.deployedAt DESC
            LIMIT 1
          `,
          { incidentId },
        );
        const resolverResult = await transaction.run(
          `
            MATCH (engineer:Engineer)-[:RESOLVED]->(:Incident {id: $incidentId})
            RETURN engineer
            ORDER BY engineer.name
          `,
          { incidentId },
        );
        const runbookResult = await transaction.run(
          `
            MATCH (:Incident {id: $incidentId})-[:HAS_RUNBOOK]->(runbook:Runbook)
            RETURN runbook
            ORDER BY runbook.title
          `,
          { incidentId },
        );
        const deploymentRecord = deploymentResult.records[0];

        return {
          incident: nodeProperties<Incident>(incidentRecord.get("incident")),
          affectedServices: affectedResult.records.map((record) => {
            const service = nodeProperties<Service>(record.get("service"));
            const teamNode = record.get("team");

            return {
              id: service.id,
              name: service.name,
              impact: record.get("impact"),
              team: teamNode
                ? nodeProperties<Pick<Team, "id" | "name">>(teamNode)
                : null,
            } satisfies AffectedService;
          }),
          triggeringDeployment: deploymentRecord
            ? nodeProperties<Deployment>(deploymentRecord.get("deployment"))
            : null,
          resolvers: resolverResult.records.map((record) =>
            nodeProperties<Engineer>(record.get("engineer")),
          ),
          runbooks: runbookResult.records.map((record) =>
            nodeProperties<Runbook>(record.get("runbook")),
          ),
        };
      });
    } catch (error) {
      return withDatabaseError(error);
    } finally {
      await session.close();
    }
  }
}
