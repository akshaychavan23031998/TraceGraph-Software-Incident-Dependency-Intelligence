import { handleApiError, success } from "@/lib/api/responses";
import { ServiceGraphService } from "@/lib/services/service-graph-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await new ServiceGraphService().getTopology());
  } catch (error) {
    return handleApiError(error);
  }
}
