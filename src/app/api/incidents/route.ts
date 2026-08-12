import { handleApiError, success } from "@/lib/api/responses";
import { IncidentService } from "@/lib/services/incident-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const incidentService = new IncidentService();
    return success(await incidentService.listIncidents());
  } catch (error) {
    return handleApiError(error);
  }
}

