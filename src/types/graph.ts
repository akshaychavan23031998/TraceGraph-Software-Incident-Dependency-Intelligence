export type Criticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentSeverity = "SEV1" | "SEV2" | "SEV3" | "SEV4";
export type IncidentStatus = "RESOLVED" | "INVESTIGATING" | "MONITORING";
export type DeploymentStatus = "SUCCESS" | "FAILED" | "ROLLED_BACK";
export type CustomerTier = "FREE" | "PRO" | "ENTERPRISE";

export interface Service {
  id: string;
  name: string;
  description: string;
  language: string;
  criticality: Criticality;
  environment: "production";
}

export interface Team {
  id: string;
  name: string;
  domain: string;
}

export interface Engineer {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  startedAt: string;
  resolvedAt?: string;
  summary: string;
}

export interface Deployment {
  id: string;
  version: string;
  deployedAt: string;
  status: DeploymentStatus;
}

export interface Customer {
  id: string;
  name: string;
  tier: CustomerTier;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
}

export interface DependsOnRelationship {
  from: string;
  to: string;
  dependencyType: "SYNC" | "ASYNC" | "DATA";
  critical: boolean;
}

export interface AffectedRelationship {
  incidentId: string;
  serviceId: string;
  impact: "DEGRADED" | "PARTIAL_OUTAGE" | "FULL_OUTAGE";
}

export interface UsesRelationship {
  customerId: string;
  serviceId: string;
  usageLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface IdRelationship {
  from: string;
  to: string;
}

