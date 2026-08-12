import type { Criticality, IncidentSeverity, IncidentStatus } from "@/types/graph";

const criticalityStyles: Record<Criticality, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

const severityStyles: Record<IncidentSeverity, string> = {
  SEV1: "badge-critical",
  SEV2: "badge-high",
  SEV3: "badge-medium",
  SEV4: "badge-low",
};

const statusStyles: Record<IncidentStatus, string> = {
  RESOLVED: "badge-resolved",
  INVESTIGATING: "badge-investigating",
  MONITORING: "badge-monitoring",
};

export function CriticalityBadge({ value }: { value: Criticality }) {
  return <span className={`status-badge ${criticalityStyles[value]}`}>{value}</span>;
}

export function SeverityBadge({ value }: { value: IncidentSeverity }) {
  return <span className={`status-badge ${severityStyles[value]}`}>{value}</span>;
}

export function IncidentStatusBadge({ value }: { value: IncidentStatus }) {
  return <span className={`status-badge ${statusStyles[value]}`}>{value.replace("_", " ")}</span>;
}

