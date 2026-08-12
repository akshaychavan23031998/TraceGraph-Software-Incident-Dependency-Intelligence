import type {
  Deployment,
  Engineer,
  Incident,
  Runbook,
  Service,
  Team,
} from "@/types/graph";

export type ServiceReference = Pick<Service, "id" | "name">;

export interface DependencyPath {
  hopCount: number;
  nodes: ServiceReference[];
}

export interface ServiceDetails {
  service: Service;
  team: Team | null;
  dependencies: ServiceReference[];
  dependents: ServiceReference[];
}

export interface DependencyTraversal {
  serviceId: string;
  maxDepth: number;
  paths: DependencyPath[];
}

export interface BlastRadiusService extends ServiceReference {
  hops: number;
}

export interface BlastRadius {
  failedService: ServiceReference;
  affectedServices: BlastRadiusService[];
}

export interface DependencyPathResult {
  from: ServiceReference;
  to: ServiceReference;
  hopCount: number | null;
  path: ServiceReference[];
}

export interface AffectedService extends ServiceReference {
  impact: "DEGRADED" | "PARTIAL_OUTAGE" | "FULL_OUTAGE";
  team: Pick<Team, "id" | "name"> | null;
}

export interface IncidentDetails {
  incident: Incident;
  affectedServices: AffectedService[];
  triggeringDeployment: Deployment | null;
  resolvers: Engineer[];
  runbooks: Runbook[];
}

export interface ServiceExpert extends Pick<Engineer, "id" | "name" | "role"> {
  resolvedIncidentCount: number;
}

export interface ServiceExperts {
  service: ServiceReference;
  experts: ServiceExpert[];
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

