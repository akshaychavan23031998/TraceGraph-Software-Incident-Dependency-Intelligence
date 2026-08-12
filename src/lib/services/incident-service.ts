import "server-only";

import { IncidentRepository } from "@/lib/repositories/incident-repository";
import type { IncidentDetails } from "@/types/api";
import type { Incident } from "@/types/graph";

export class IncidentService {
  constructor(private readonly repository = new IncidentRepository()) {}

  listIncidents(): Promise<Incident[]> {
    return this.repository.list();
  }

  getIncidentDetails(incidentId: string): Promise<IncidentDetails | null> {
    return this.repository.getDetails(incidentId);
  }
}

