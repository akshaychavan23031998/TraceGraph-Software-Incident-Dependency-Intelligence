import type { DependencyDepth } from "@/lib/repositories/service-repository";

const idPattern = /^[a-z0-9][a-z0-9-]{0,99}$/;
const allowedDepths = new Set<DependencyDepth>([1, 2, 3, 4, 5, 6]);

export const isValidId = (value: string | null | undefined): value is string =>
  typeof value === "string" && idPattern.test(value);

export const parseMaxDepth = (
  value: string | null,
): DependencyDepth | null => {
  if (value === null) {
    return 4;
  }

  if (!/^[1-6]$/.test(value)) {
    return null;
  }

  const depth = Number(value) as DependencyDepth;
  return allowedDepths.has(depth) ? depth : null;
};

