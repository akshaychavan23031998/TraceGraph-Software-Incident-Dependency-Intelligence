"use client";

import { ArrowLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PathResult } from "@/components/graph-explorer/path-result";
import { ServiceSelector } from "@/components/graph-explorer/service-selector";
import { fetchApi } from "@/lib/api/client";
import type { DependencyPathResult } from "@/types/api";
import type { Service } from "@/types/graph";

export function PathFinder({ services }: { services: Service[] }) {
  const [from, setFrom] = useState(() => services.find((service) => service.name === "API Gateway")?.id ?? "");
  const [to, setTo] = useState(() => services.find((service) => service.name === "PostgreSQL Cluster")?.id ?? "");
  const [result, setResult] = useState<DependencyPathResult | null>(null);
  const [loading, setLoading] = useState(Boolean(from && to && from !== to));
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!from || !to || from === to) return;
    const controller = new AbortController();
    fetchApi<DependencyPathResult>(`/api/paths?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, controller.signal).then(setResult).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [from, retryKey, to]);

  const updateFrom = (value: string) => { setFrom(value); setResult(null); setFailed(false); setLoading(Boolean(value && to && value !== to)); };
  const updateTo = (value: string) => { setTo(value); setResult(null); setFailed(false); setLoading(Boolean(from && value && from !== value)); };
  const swap = () => { setFrom(to); setTo(from); setResult(null); setFailed(false); setLoading(Boolean(from && to && from !== to)); };
  const sameService = Boolean(from && to && from === to);

  return <div className="space-y-5"><section className="panel"><div><h2 className="text-base font-semibold text-white">Trace a dependency path</h2><p className="mt-1 text-xs text-slate-500">Direction matters: paths follow dependencies from the source toward the destination.</p></div><div className="mt-5 grid items-end gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"><ServiceSelector id="path-from" label="From" value={from} services={services} onChange={updateFrom} /><button type="button" className="swap-button" aria-label="Swap source and destination services" onClick={swap} disabled={!from && !to}><ArrowLeftRight aria-hidden="true" size={16} /><span className="md:sr-only">Swap</span></button><ServiceSelector id="path-to" label="To" value={to} services={services} onChange={updateTo} /></div>{sameService && <p className="validation-message" role="status">Choose two different services to trace a dependency path.</p>}</section>{loading ? <AnalysisSkeleton label="Tracing dependency path..." /> : failed ? <AnalysisError retry={() => { setFailed(false); setLoading(true); setResult(null); setRetryKey((value) => value + 1); }} /> : <PathResult result={sameService ? null : result} onSwap={swap} />}</div>;
}

export function AnalysisSkeleton({ label }: { label: string }) { return <div className="panel" aria-busy="true"><p className="mb-4 text-xs font-medium text-slate-400">{label}</p><div className="flex flex-col gap-3 sm:flex-row">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="skeleton h-20 flex-1 rounded-lg" />)}</div></div>; }
export function AnalysisError({ retry }: { retry: () => void }) { return <div className="panel flex min-h-52 flex-col items-center justify-center text-center"><h3 className="text-sm font-semibold text-white">Unable to analyze the graph right now</h3><p className="mt-2 text-xs text-slate-500">TraceGraph could not retrieve this analysis. Try again shortly.</p><button type="button" className="secondary-button mt-4" onClick={retry}>Try again</button></div>; }
