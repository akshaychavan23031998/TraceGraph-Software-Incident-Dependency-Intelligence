import { failure, handleApiError, success } from "@/lib/api/responses";
import { isValidId, parseMaxDepth } from "@/lib/api/validation";
import { ServiceGraphService } from "@/lib/services/service-graph-service";

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const maxDepth = parseMaxDepth(new URL(request.url).searchParams.get("maxDepth"));

  if (!isValidId(id)) {
    return failure("INVALID_SERVICE_ID", "A valid service ID is required.", 400);
  }

  if (maxDepth === null) {
    return failure("INVALID_MAX_DEPTH", "maxDepth must be an integer from 1 to 6.", 400);
  }

  try {
    const graphService = new ServiceGraphService();
    const traversal = await graphService.getDependencies(id, maxDepth);

    return traversal
      ? success(traversal)
      : failure("SERVICE_NOT_FOUND", "Service was not found.", 404);
  } catch (error) {
    return handleApiError(error);
  }
}

