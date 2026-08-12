export type DatabaseEnvironment = {
  uri: string;
  username: string;
  password: string;
};

const requireEnvironmentVariable = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getDatabaseEnvironment = (): DatabaseEnvironment => ({
  uri: requireEnvironmentVariable("COGNODB_URI"),
  username: requireEnvironmentVariable("COGNODB_USERNAME"),
  password: requireEnvironmentVariable("COGNODB_PASSWORD"),
});

