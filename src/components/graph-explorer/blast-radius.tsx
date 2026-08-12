"use client";

import { GitBranch, Network } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlastRadiusGroups } from "@/components/graph-explorer/blast-radius-groups";
import { AnalysisError, AnalysisSkeleton } from "@/components/graph-explorer/path-finder";
import { ServiceSelector } from "@/components/graph-explorer/service-selector";
import { EmptyState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { BlastRadius as BlastRadiusData } from "@/types/api";
import type { Service } from "@/types/graph";

export function BlastRadius({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState(() => services.find((service) => service.name === "PostgreSQL Cluster")?.id ?? "");
  const [data, setData] = useState<BlastRadiusData | null>(null);
  const [loading, setLoading] = useState(Boolean(selected));
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    fetchApi<BlastRadiusData>(`/api/services/${encodeURIComponent(selected)}/blast-radius`, controller.signal).then(setData).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retryKey, selected]);

  const changeService = (value: string) => { setSelected(value); setData(null); setFailed(false); setLoading(Boolean(value)); };
  const affected = data?.affectedServices ?? [];
  const directCount = affected.filter((service) => service.hops === 1).length;
  const maximumHops = affected.reduce((maximum, service) => Math.max(maximum, service.hops), 0);

  return <div className="space-y-5"><section className="panel"><div className="grid gap-5 lg:grid-cols-[minmax(16rem,.75fr)_1.25fr] lg:items-end"><div><h2 className="text-base font-semibold text-white">Blast Radius Analysis</h2><p className="mt-1 text-xs leading-5 text-slate-500">Select a dependency to see which upstream services may be impacted if it becomes unavailable.</p></div><ServiceSelector id="failed-service" label="Failed dependency" value={selected} services={services} onChange={changeService} /></div></section>{loading ? <AnalysisSkeleton label="Calculating dependency impact..." /> : failed ? <AnalysisError retry={() => { setFailed(false); setLoading(true); setRetryKey((value) => value + 1); }} /> : !data ? <div className="panel"><EmptyState title="Select a dependency" description="Choose a service to calculate its potential upstream impact." /></div> : <><section className="blast-summary"><div><p className="section-kicker">Dependency risk</p><h2 className="mt-2 text-xl font-semibold text-white">{data.failedService.name}</h2><Link href={`/services/${data.failedService.id}`} className="service-link mt-3">View service <span aria-hidden="true">→</span></Link></div><div className="grid grid-cols-3 gap-3"><SummaryMetric value={affected.length} label="Potentially affected" /><SummaryMetric value={directCount} label="Directly dependent" /><SummaryMetric value={maximumHops} label="Maximum hops" /></div></section>{affected.length === 0 ? <div className="panel"><EmptyState title="No upstream dependency impact detected" description="No other services currently depend on this service in the seeded graph." /></div> : <section className="panel"><div className="mb-5 flex items-start gap-3"><span className="relationship-icon"><GitBranch aria-hidden="true" size={17} /></span><div><h2 className="text-base font-semibold text-white">Potentially Affected Services</h2><p className="mt-1 text-xs leading-5 text-slate-500">Grouped by distance from the selected dependency. Impact indicates dependency risk, not a guaranteed outage.</p></div></div><BlastRadiusGroups services={affected} /></section>}<div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-xs leading-5 text-slate-500"><Network aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-teal-500" /><p>Blast radius follows <code className="text-slate-400">DEPENDS_ON</code> relationships in reverse to find services that rely on the selected dependency.</p></div></>}</div>;
}

function SummaryMetric({ value, label }: { value: number; label: string }) { return <div className="blast-metric"><p className="text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{label}</p></div>; }

