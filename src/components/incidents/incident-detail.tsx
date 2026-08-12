"use client";

import { AlertTriangle, ArrowDown, ArrowLeft, CheckCircle2, Clock3, GitCommitHorizontal, Network } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AffectedServices } from "@/components/incidents/affected-services";
import { IncidentDeployment } from "@/components/incidents/incident-deployment";
import { IncidentResolvers } from "@/components/incidents/incident-resolvers";
import { IncidentRunbooks } from "@/components/incidents/incident-runbooks";
import { IncidentStatusBadge, SeverityBadge } from "@/components/ui/badges";
import { ErrorState } from "@/components/ui/states";
import { ApiClientError, fetchApi } from "@/lib/api/client";
import { formatDateTime } from "@/lib/format-date";
import { formatDuration } from "@/lib/incident-time";
import type { IncidentDetails } from "@/types/api";

export function IncidentDetail({ incidentId }: { incidentId: string }) {
  const [data, setData] = useState<IncidentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [failed, setFailed] = useState(false);
  const load = async () => { setLoading(true); setMissing(false); setFailed(false); try { setData(await fetchApi<IncidentDetails>(`/api/incidents/${incidentId}`)); } catch (error) { if (error instanceof ApiClientError && error.status === 404) setMissing(true); else setFailed(true); } finally { setLoading(false); } };

  useEffect(() => { const controller = new AbortController(); fetchApi<IncidentDetails>(`/api/incidents/${incidentId}`, controller.signal).then(setData).catch((error: unknown) => { if (error instanceof DOMException && error.name === "AbortError") return; if (error instanceof ApiClientError && error.status === 404) setMissing(true); else setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [incidentId]);

  if (loading) return <IncidentDetailSkeleton />;
  if (missing) return <IncidentNotFound />;
  if (failed || !data) return <ErrorState retry={() => void load()} />;

  const { incident, affectedServices, triggeringDeployment, resolvers, runbooks } = data;
  return <div className="space-y-6">
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500"><Link href="/incidents" className="hover:text-teal-300">Incidents</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-mono text-slate-300">{incident.id.toUpperCase()}</span></nav>
    <header className="incident-detail-header"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[11px] font-medium text-slate-500">{incident.id.toUpperCase()}</span><SeverityBadge value={incident.severity} /><IncidentStatusBadge value={incident.status} /></div><h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{incident.title}</h1><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500"><span><span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-600">Started</span><time className="mt-1 block" dateTime={incident.startedAt}>{formatDateTime(incident.startedAt)}</time></span><span><span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-600">Resolved</span>{incident.resolvedAt ? <time className="mt-1 block" dateTime={incident.resolvedAt}>{formatDateTime(incident.resolvedAt)}</time> : <span className="mt-1 block text-amber-300">Not yet resolved</span>}</span></div></div><div className={`duration-card ${incident.resolvedAt ? "is-resolved" : "is-active"}`}>{incident.resolvedAt ? <CheckCircle2 aria-hidden="true" size={20} /> : <Clock3 aria-hidden="true" size={20} />}<div><p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Duration</p><p className="mt-1 text-sm font-semibold">{formatDuration(incident.startedAt, incident.resolvedAt)}</p></div></div></header>

    <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]"><section className="panel"><h2 className="text-base font-semibold text-white">Incident Summary</h2><p className="mt-4 text-sm leading-7 text-slate-400">{incident.summary}</p></section><InvestigationContext data={data} /></div>
    <IncidentTimeline data={data} />
    <AffectedServices services={affectedServices} />
    <div className="grid gap-4 xl:grid-cols-2"><IncidentDeployment deployment={triggeringDeployment} /><IncidentResolvers resolvers={resolvers} /></div>
    <IncidentRunbooks runbooks={runbooks} />
  </div>;
}

function InvestigationContext({ data }: { data: IncidentDetails }) {
  const { incident, triggeringDeployment, affectedServices } = data;
  return <section className="panel"><h2 className="text-base font-semibold text-white">Investigation Context</h2><p className="mt-1 text-xs text-slate-500">Connected evidence from the operational graph.</p><div className="context-chain mt-5">{triggeringDeployment && <><ContextNode icon={GitCommitHorizontal} label="Deployment" title={triggeringDeployment.version} meta={triggeringDeployment.id.toUpperCase()} /><ContextArrow label="triggered" /></>}<ContextNode icon={AlertTriangle} label="Incident" title={incident.title} meta={incident.id.toUpperCase()} />{affectedServices.length > 0 && <><ContextArrow label="affected" /><div className="grid w-full gap-2 sm:grid-cols-2">{affectedServices.map((service) => <Link href={`/services/${service.id}`} key={service.id} className="context-service"><Network aria-hidden="true" size={15} /><span><span className="block text-xs font-medium text-slate-200">{service.name}</span><span className="mt-0.5 block text-[10px] text-slate-600">Owned by {service.team?.name ?? "unassigned team"}</span></span></Link>)}</div></>}</div></section>;
}

function ContextNode({ icon: Icon, label, title, meta }: { icon: typeof Network; label: string; title: string; meta: string }) { return <div className="context-node"><Icon aria-hidden="true" size={16} className="text-teal-400" /><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">{label} · {meta}</p><p className="mt-1 truncate text-xs font-medium text-slate-200">{title}</p></div></div>; }
function ContextArrow({ label }: { label: string }) { return <div className="context-arrow"><ArrowDown aria-hidden="true" size={14} /><span>{label}</span></div>; }

function IncidentTimeline({ data }: { data: IncidentDetails }) {
  const entries = [
    ...(data.triggeringDeployment ? [{ time: data.triggeringDeployment.deployedAt, label: `Deployment ${data.triggeringDeployment.id.toUpperCase()}`, detail: data.triggeringDeployment.version }] : []),
    { time: data.incident.startedAt, label: "Incident started", detail: data.incident.status === "RESOLVED" ? "Detection and response began" : "Response remains active" },
    ...(data.incident.resolvedAt ? [{ time: data.incident.resolvedAt, label: "Incident resolved", detail: formatDuration(data.incident.startedAt, data.incident.resolvedAt) }] : []),
  ].sort((left, right) => new Date(left.time).getTime() - new Date(right.time).getTime());
  return <section className="panel"><h2 className="text-base font-semibold text-white">Timeline</h2><div className="timeline mt-5">{entries.map((entry, index) => <div className="timeline-entry" key={`${entry.time}-${entry.label}`}><span className="timeline-dot" aria-hidden="true" /><time dateTime={entry.time} className="text-[11px] text-slate-500">{formatDateTime(entry.time)}</time><div><p className="text-sm font-medium text-slate-200">{entry.label}</p><p className="mt-1 text-xs text-slate-600">{entry.detail}</p></div>{index < entries.length - 1 && <span className="timeline-line" aria-hidden="true" />}</div>)}</div></section>;
}

function IncidentNotFound() { return <section className="panel flex min-h-[480px] flex-col items-center justify-center px-6 text-center"><span className="rounded-full border border-slate-700 bg-slate-800/50 p-4 text-slate-400"><AlertTriangle aria-hidden="true" size={28} /></span><h1 className="mt-5 text-xl font-semibold text-white">Incident not found</h1><p className="mt-2 text-sm text-slate-500">The requested incident does not exist in TraceGraph.</p><Link href="/incidents" className="secondary-button mt-6 inline-flex items-center gap-2"><ArrowLeft size={14} /> Back to Incidents</Link></section>; }
function IncidentDetailSkeleton() { return <div className="space-y-6" aria-busy="true" aria-label="Loading incident investigation"><span className="sr-only">Loading incident investigation.</span><div className="skeleton h-52 rounded-xl" /><div className="grid gap-4 xl:grid-cols-2"><div className="skeleton h-56 rounded-xl" /><div className="skeleton h-56 rounded-xl" /></div><div className="skeleton h-72 rounded-xl" /><div className="grid gap-4 xl:grid-cols-2"><div className="skeleton h-64 rounded-xl" /><div className="skeleton h-64 rounded-xl" /></div></div>; }
