"use client";

import { useEffect, useState } from "react";
import { IncidentList } from "@/components/incidents/incident-list";
import { ErrorState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { Incident } from "@/types/graph";

export function IncidentExplorer() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => { setLoading(true); setFailed(false); try { setIncidents(await fetchApi<Incident[]>("/api/incidents")); } catch { setFailed(true); } finally { setLoading(false); } };
  useEffect(() => { const controller = new AbortController(); fetchApi<Incident[]>("/api/incidents", controller.signal).then(setIncidents).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, []);
  if (loading) return <IncidentListSkeleton />;
  if (failed) return <ErrorState retry={() => void load()} title="Unable to load incidents" description="TraceGraph could not retrieve the incident catalog right now." />;
  return <IncidentList incidents={incidents} />;
}

function IncidentListSkeleton() { return <div aria-busy="true" aria-label="Loading incidents"><div className="skeleton mb-5 h-20 rounded-xl" /><div className="grid gap-4 xl:grid-cols-2">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-56 rounded-xl" />)}</div></div>; }
