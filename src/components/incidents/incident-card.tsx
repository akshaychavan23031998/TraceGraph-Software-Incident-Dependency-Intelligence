import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { IncidentStatusBadge, SeverityBadge } from "@/components/ui/badges";
import { formatDateTime } from "@/lib/format-date";
import { formatDuration } from "@/lib/incident-time";
import type { Incident } from "@/types/graph";

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <article className="incident-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] font-medium text-slate-500">{incident.id.toUpperCase()}</span>
        <SeverityBadge value={incident.severity} />
        <IncidentStatusBadge value={incident.status} />
      </div>
      <h2 className="mt-3 text-[15px] font-semibold text-white">{incident.title}</h2>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{incident.summary}</p>
      <div className="mt-4 grid gap-2 text-[11px] text-slate-500 sm:grid-cols-2">
        <div><span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-600">Started</span><time dateTime={incident.startedAt} className="mt-1 block">{formatDateTime(incident.startedAt)}</time></div>
        <div><span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-600">Resolution</span><span className="mt-1 flex items-center gap-1.5"><Clock3 aria-hidden="true" size={12} />{formatDuration(incident.startedAt, incident.resolvedAt)}</span></div>
      </div>
      <Link href={`/incidents/${incident.id}`} className="service-link mt-5">Investigate incident <ArrowUpRight aria-hidden="true" size={14} /></Link>
    </article>
  );
}

