import type { Driver } from "neo4j-driver";

const uniquenessConstraints = [
  { label: "Service", property: "id" },
  { label: "Team", property: "id" },
  { label: "Engineer", property: "id" },
  { label: "Incident", property: "id" },
  { label: "Deployment", property: "id" },
  { label: "Customer", property: "id" },
  { label: "Runbook", property: "id" },
] as const;

const isExistingConstraintError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    message.includes("already exists") ||
    message.includes("equivalent constraint") ||
    message.includes("equivalent schema rule")
  );
};

export const createConstraints = async (driver: Driver): Promise<number> => {
  const session = driver.session();
  let created = 0;

  try {
    for (const constraint of uniquenessConstraints) {
      try {
        await session.run(
          `CREATE CONSTRAINT FOR (node:${constraint.label}) REQUIRE node.${constraint.property} IS UNIQUE`,
        );
        created += 1;
      } catch (error) {
        if (!isExistingConstraintError(error)) {
          throw error;
        }
      }
    }

    return created;
  } finally {
    await session.close();
  }
};

export const constraintDefinitions = uniquenessConstraints.map(
  ({ label, property }) => `${label}.${property}`,
);

