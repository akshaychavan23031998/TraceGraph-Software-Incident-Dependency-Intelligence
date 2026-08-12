import { NextResponse } from "next/server";

import { DatabaseError } from "@/lib/errors/database-error";
import type { ApiError, ApiSuccess } from "@/types/api";

export const success = <T>(data: T, status = 200) =>
  NextResponse.json<ApiSuccess<T>>({ data }, { status });

export const failure = (code: string, message: string, status: number) =>
  NextResponse.json<ApiError>({ error: { code, message } }, { status });

export const handleApiError = (error: unknown) => {
  if (error instanceof DatabaseError) {
    console.error(`Database request failed: ${error.message}`);
    return failure(
      "DATABASE_UNAVAILABLE",
      "TraceGraph data is temporarily unavailable.",
      503,
    );
  }

  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Unexpected API failure: ${message}`);
  return failure("INTERNAL_ERROR", "An unexpected error occurred.", 500);
};

