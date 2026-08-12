import { failure, handleApiError, success } from "@/lib/api/responses";
import { isValidId } from "@/lib/api/validation";
import { IncidentService } from "@/lib/services/incident-service";

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isValidId(id)) {
    return failure("INVALID_INCIDENT_ID", "A valid incident ID is required.", 400);
  }

  try {
    const incidentService = new IncidentService();
    const incident = await incidentService.getIncidentDetails(id);

    return incident
      ? success(incident)
      : failure("INCIDENT_NOT_FOUND", "Incident was not found.", 404);
  } catch (error) {
    return handleApiError(error);
  }
}
