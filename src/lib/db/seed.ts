import type { Driver, ManagedTransaction } from "neo4j-driver";

import {
  customerUsage,
  customers,
  dependencies,
  deployments,
  deploymentTargets,
  deploymentTriggers,
  engineers,
  incidentEffects,
  incidentResolvers,
  incidentRunbooks,
  incidents,
  runbooks,
  services,
  teamMemberships,
  teamOwnerships,
  teams,
} from "@/data/seed-data";

type SeedBatch = {
  query: string;
  parameterName: string;
  rows: object[];
};

const nodeBatches: SeedBatch[] = [
  { query: "UNWIND $services AS item MERGE (node:Service {id: item.id}) SET node += item", parameterName: "services", rows: services },
  { query: "UNWIND $teams AS item MERGE (node:Team {id: item.id}) SET node += item", parameterName: "teams", rows: teams },
  { query: "UNWIND $engineers AS item MERGE (node:Engineer {id: item.id}) SET node += item", parameterName: "engineers", rows: engineers },
  { query: "UNWIND $incidents AS item MERGE (node:Incident {id: item.id}) SET node += item", parameterName: "incidents", rows: incidents },
  { query: "UNWIND $deployments AS item MERGE (node:Deployment {id: item.id}) SET node += item", parameterName: "deployments", rows: deployments },
  { query: "UNWIND $customers AS item MERGE (node:Customer {id: item.id}) SET node += item", parameterName: "customers", rows: customers },
  { query: "UNWIND $runbooks AS item MERGE (node:Runbook {id: item.id}) SET node += item", parameterName: "runbooks", rows: runbooks },
];

const relationshipBatches: SeedBatch[] = [
  {
    query: "UNWIND $rows AS item MATCH (source:Service {id: item.from}), (target:Service {id: item.to}) MERGE (source)-[relationship:DEPENDS_ON]->(target) SET relationship.dependencyType = item.dependencyType, relationship.critical = item.critical",
    parameterName: "rows",
    rows: dependencies,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Team {id: item.from}), (target:Service {id: item.to}) MERGE (source)-[:OWNS]->(target)",
    parameterName: "rows",
    rows: teamOwnerships,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Engineer {id: item.from}), (target:Team {id: item.to}) MERGE (source)-[:MEMBER_OF]->(target)",
    parameterName: "rows",
    rows: teamMemberships,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Deployment {id: item.from}), (target:Service {id: item.to}) MERGE (source)-[:DEPLOYED_TO]->(target)",
    parameterName: "rows",
    rows: deploymentTargets,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Deployment {id: item.from}), (target:Incident {id: item.to}) MERGE (source)-[:TRIGGERED]->(target)",
    parameterName: "rows",
    rows: deploymentTriggers,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Incident {id: item.incidentId}), (target:Service {id: item.serviceId}) MERGE (source)-[relationship:AFFECTED]->(target) SET relationship.impact = item.impact",
    parameterName: "rows",
    rows: incidentEffects,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Engineer {id: item.from}), (target:Incident {id: item.to}) MERGE (source)-[:RESOLVED]->(target)",
    parameterName: "rows",
    rows: incidentResolvers,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Customer {id: item.customerId}), (target:Service {id: item.serviceId}) MERGE (source)-[relationship:USES]->(target) SET relationship.usageLevel = item.usageLevel",
    parameterName: "rows",
    rows: customerUsage,
  },
  {
    query: "UNWIND $rows AS item MATCH (source:Incident {id: item.from}), (target:Runbook {id: item.to}) MERGE (source)-[:HAS_RUNBOOK]->(target)",
    parameterName: "rows",
    rows: incidentRunbooks,
  },
];

const runBatch = async (transaction: ManagedTransaction, batch: SeedBatch) => {
  await transaction.run(batch.query, { [batch.parameterName]: batch.rows });
};

export const seedDatabase = async (driver: Driver): Promise<void> => {
  const session = driver.session();

  try {
    await session.executeWrite(async (transaction) => {
      for (const batch of nodeBatches) {
        await runBatch(transaction, batch);
      }

      for (const batch of relationshipBatches) {
        await runBatch(transaction, batch);
      }
    });
  } finally {
    await session.close();
  }
};

