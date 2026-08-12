import { failure, handleApiError, success } from "@/lib/api/responses";
import { isValidId } from "@/lib/api/validation";
import { ServiceGraphService } from "@/lib/services/service-graph-service";

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isValidId(id)) {
    return failure("INVALID_SERVICE_ID", "A valid service ID is required.", 400);
  }

  try {
    const graphService = new ServiceGraphService();
    const blastRadius = await graphService.getBlastRadius(id);

    return blastRadius
      ? success(blastRadius)
      : failure("SERVICE_NOT_FOUND", "Service was not found.", 404);
  } catch (error) {
    return handleApiError(error);
  }
}

