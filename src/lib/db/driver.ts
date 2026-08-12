import "server-only";

import neo4j, { type Driver } from "neo4j-driver";

import { createDatabaseDriver } from "@/lib/db/create-driver";
import { DatabaseError } from "@/lib/errors/database-error";

const globalForNeo4j = globalThis as typeof globalThis & {
  neo4jDriver?: Driver;
};

export const getDatabaseDriver = (): Driver => {
  if (!globalForNeo4j.neo4jDriver) {
    globalForNeo4j.neo4jDriver = createDatabaseDriver();
  }

  return globalForNeo4j.neo4jDriver;
};

export const verifyDatabaseConnectivity = async (): Promise<boolean> => {
  let session;

  try {
    session = getDatabaseDriver().session({
      defaultAccessMode: neo4j.session.READ,
    });
    const result = await session.executeRead((transaction) =>
      transaction.run("RETURN $expected AS ok", { expected: 1 }),
    );

    const value: unknown = result.records[0]?.get("ok");

    return neo4j.isInt(value) ? value.toNumber() === 1 : value === 1;
  } catch (error) {
    throw new DatabaseError("Unable to connect to CognoDB.", { cause: error });
  } finally {
    await session?.close();
  }
};
