"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { IncidentCard } from "@/components/incidents/incident-card";
import { EmptyState } from "@/components/ui/states";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/types/graph";

type SeverityFilter = "ALL" | IncidentSeverity;
type StatusFilter = "ALL" | IncidentStatus;

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<SeverityFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const matchesSearch = !search || [incident.id, incident.title, incident.summary].some((value) => value.toLowerCase().includes(search));
      return matchesSearch && (severity === "ALL" || incident.severity === severity) && (status === "ALL" || incident.status === status);
    });
  }, [incidents, query, severity, status]);
  const filtersActive = query.trim().length > 0 || severity !== "ALL" || status !== "ALL";
  const clearFilters = () => { setQuery(""); setSeverity("ALL"); setStatus("ALL"); };

  if (incidents.length === 0) return <div className="panel"><EmptyState title="No incidents recorded" description="Operational incidents will appear here when they are added to TraceGraph." /></div>;

  return (
    <>
      <section className="panel mb-5" aria-label="Incident filters">
        <div className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_13rem_13rem]">
          <div className="relative"><label htmlFor="incident-search" className="sr-only">Search incidents</label><Search aria-hidden="true" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input id="incident-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents..." className="search-input" /></div>
          <label className="filter-select-label"><span className="sr-only">Filter by severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)} className="filter-select"><option value="ALL">All Severities</option><option value="SEV1">SEV1</option><option value="SEV2">SEV2</option><option value="SEV3">SEV3</option><option value="SEV4">SEV4</option></select></label>
          <label className="filter-select-label"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="filter-select"><option value="ALL">All Statuses</option><option value="INVESTIGATING">Investigating</option><option value="MONITORING">Monitoring</option><option value="RESOLVED">Resolved</option></select></label>
        </div>
      </section>
      <div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500">{filtersActive ? `${filtered.length} of ${incidents.length} incidents` : `${incidents.length} incidents`}</p>{filtersActive && <button type="button" className="text-xs font-medium text-teal-400 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" onClick={clearFilters}>Clear filters</button>}</div>
      {filtered.length === 0 ? <div className="panel"><EmptyState title="No incidents match your filters" description="Try a different search term, severity, or incident status." /><div className="mt-4 text-center"><button type="button" className="secondary-button" onClick={clearFilters}>Clear filters</button></div></div> : <div className="grid gap-4 xl:grid-cols-2">{filtered.map((incident) => <IncidentCard key={incident.id} incident={incident} />)}</div>}
    </>
  );
}

