import { failure, handleApiError, success } from "@/lib/api/responses";
import { isValidId } from "@/lib/api/validation";
import { ServiceGraphService } from "@/lib/services/service-graph-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!isValidId(from) || !isValidId(to)) {
    return failure(
      "INVALID_PATH_PARAMETERS",
      "Valid from and to service IDs are required.",
      400,
    );
  }

  try {
    const graphService = new ServiceGraphService();
    const path = await graphService.findPath(from, to);

    return path
      ? success(path)
      : failure("SERVICE_NOT_FOUND", "One or both services were not found.", 404);
  } catch (error) {
    return handleApiError(error);
  }
}

