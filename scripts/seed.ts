import { constraintDefinitions, createConstraints } from "@/lib/db/constraints";
import { createDatabaseDriver } from "@/lib/db/create-driver";
import { seedDatabase } from "@/lib/db/seed";

const main = async () => {
  const driver = createDatabaseDriver();

  try {
    await driver.verifyConnectivity();
    const constraintsCreated = await createConstraints(driver);
    await seedDatabase(driver);

    console.log(`Database constraints ready (${constraintsCreated} newly created).`);
    console.log(`Unique IDs enforced for: ${constraintDefinitions.join(", ")}.`);
    console.log("TraceGraph seed data loaded successfully.");
  } finally {
    await driver.close();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown database error";
  console.error(`TraceGraph seed failed: ${message}`);
  process.exitCode = 1;
});

