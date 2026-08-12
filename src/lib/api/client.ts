import type { ApiError, ApiSuccess } from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function fetchApi<T>(
  input: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(input, { signal });
  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || "error" in payload) {
    const error = "error" in payload
      ? payload.error
      : { code: "REQUEST_FAILED", message: "The request could not be completed." };
    throw new ApiClientError(response.status, error.code, error.message);
  }

  return payload.data;
}

