import { createDatabaseDriver } from "@/lib/db/create-driver";

const main = async () => {
  const driver = createDatabaseDriver();
  const session = driver.session();

  try {
    await session.executeWrite((transaction) =>
      transaction.run("MATCH (node) DETACH DELETE node"),
    );
    console.log("TraceGraph project data cleared successfully.");
  } finally {
    await session.close();
    await driver.close();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown database error";
  console.error(`TraceGraph clear failed: ${message}`);
  process.exitCode = 1;
});

