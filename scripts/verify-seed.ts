import neo4j, { type Integer } from "neo4j-driver";

import { createDatabaseDriver } from "@/lib/db/create-driver";

const toNumber = (value: number | Integer): number =>
  neo4j.isInt(value) ? value.toNumber() : value;

const main = async () => {
  const driver = createDatabaseDriver();
  const session = driver.session({ defaultAccessMode: neo4j.session.READ });

  try {
    const countsResult = await session.executeRead((transaction) =>
      transaction.run(`
        MATCH (node)
        WITH count(node) AS totalNodes
        MATCH ()-[relationship]->()
        RETURN
          totalNodes,
          count(relationship) AS totalRelationships
      `),
    );

    const labelResult = await session.executeRead((transaction) =>
      transaction.run(`
        MATCH (node)
        RETURN labels(node)[0] AS label, count(node) AS count
        ORDER BY label
      `),
    );

    const relationshipResult = await session.executeRead((transaction) =>
      transaction.run(`
        MATCH ()-[relationship]->()
        RETURN type(relationship) AS type, count(relationship) AS count
        ORDER BY type
      `),
    );

    const pathResult = await session.executeRead((transaction) =>
      transaction.run(
        `
          MATCH path = (source:Service {id: $serviceId})-[:DEPENDS_ON*2..4]->(dependency:Service)
          RETURN [node IN nodes(path) | node.name] AS services, length(path) AS hops
          ORDER BY hops, services
          LIMIT 10
        `,
        { serviceId: "svc-api-gateway" },
      ),
    );

    const counts = countsResult.records[0];
    console.log("TraceGraph seed verification");
    console.log(`Total nodes: ${toNumber(counts.get("totalNodes"))}`);
    for (const record of labelResult.records) {
      console.log(`${record.get("label")}: ${toNumber(record.get("count"))}`);
    }
    console.log(`Total relationships: ${toNumber(counts.get("totalRelationships"))}`);
    for (const record of relationshipResult.records) {
      console.log(`${record.get("type")}: ${toNumber(record.get("count"))}`);
    }
    console.log("Multi-hop paths from API Gateway:");
    for (const record of pathResult.records) {
      console.log(`- ${record.get("services").join(" -> ")} (${toNumber(record.get("hops"))} hops)`);
    }
  } finally {
    await session.close();
    await driver.close();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown database error";
  console.error(`TraceGraph verification failed: ${message}`);
  process.exitCode = 1;
});
