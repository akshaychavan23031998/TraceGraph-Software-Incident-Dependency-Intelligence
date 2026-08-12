import neo4j, { type Driver } from "neo4j-driver";

import { getDatabaseEnvironment } from "@/lib/config/env";

export const createDatabaseDriver = (): Driver => {
  const { uri, username, password } = getDatabaseEnvironment();

  return neo4j.driver(uri, neo4j.auth.basic(username, password));
};

