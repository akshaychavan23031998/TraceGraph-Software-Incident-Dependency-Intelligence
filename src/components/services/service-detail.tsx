"use client";

import { ArrowLeft, Box, Building2, GitBranch, Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DependencyList } from "@/components/services/dependency-list";
import { DependencyPaths } from "@/components/services/dependency-paths";
import { ServiceExperts } from "@/components/services/service-experts";
import { CriticalityBadge } from "@/components/ui/badges";
import { ErrorState } from "@/components/ui/states";
import { ApiClientError, fetchApi } from "@/lib/api/client";
import type { BlastRadius, ServiceDetails, ServiceExperts as ServiceExpertsData } from "@/types/api";

type DetailData = { details: ServiceDetails; blastRadius: BlastRadius; experts: ServiceExpertsData };

async function fetchDetailData(serviceId: string, signal?: AbortSignal): Promise<DetailData> {
  const [details, blastRadius, experts] = await Promise.all([
    fetchApi<ServiceDetails>(`/api/services/${serviceId}`, signal),
    fetchApi<BlastRadius>(`/api/services/${serviceId}/blast-radius`, signal),
    fetchApi<ServiceExpertsData>(`/api/services/${serviceId}/experts`, signal),
  ]);
  return { details, blastRadius, experts };
}

export function ServiceDetail({ serviceId }: { serviceId: string }) {
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = async () => {
    setLoading(true); setFailed(false); setMissing(false);
    try { setData(await fetchDetailData(serviceId)); }
    catch (error) { if (error instanceof ApiClientError && error.status === 404) setMissing(true); else setFailed(true); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDetailData(serviceId, controller.signal).then(setData).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (error instanceof ApiClientError && error.status === 404) setMissing(true); else setFailed(true);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [serviceId]);

  if (loading) return <ServiceDetailSkeleton />;
  if (missing) return <NotFound />;
  if (failed || !data) return <ErrorState retry={() => void load()} />;

  const { service, team, dependencies, dependents } = data.details;
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500"><Link href="/services" className="hover:text-teal-300">Services</Link><span aria-hidden="true">/</span><span aria-current="page" className="truncate text-slate-300">{service.name}</span></nav>
      <header className="service-detail-header">
        <div className="flex min-w-0 items-start gap-4"><span className="service-hero-icon"><Box aria-hidden="true" size={24} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{service.name}</h1><CriticalityBadge value={service.criticality} /></div><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{service.description}</p><div className="mt-4 flex flex-wrap gap-2"><span className="metadata-chip">{service.language}</span><span className="metadata-chip capitalize">{service.environment}</span></div></div></div>
        <div className="ownership-card"><Building2 aria-hidden="true" size={18} className="text-teal-400" /><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Owning team</p><p className="mt-1 text-sm font-medium text-slate-200">{team?.name ?? "No team assigned"}</p>{team && <p className="mt-1 text-xs leading-5 text-slate-500">{team.domain}</p>}</div></div>
      </header>

      <section aria-labelledby="relationships-title"><div className="mb-4"><h2 id="relationships-title" className="text-base font-semibold text-white">Direct Relationships</h2><p className="mt-1 text-xs text-slate-500">Immediate connections for {service.name}.</p></div><div className="grid gap-4 lg:grid-cols-2"><DependencyList title="This service depends on" description="Downstream services required by this service." services={dependencies} direction="outgoing" /><DependencyList title="Services depending on this service" description="Upstream services that require this service." services={dependents} direction="incoming" /></div></section>
      <DependencyPaths serviceId={serviceId} />
      <div className="grid items-stretch gap-4 xl:grid-cols-2"><BlastRadiusPreview blastRadius={data.blastRadius} /><ServiceExperts experts={data.experts.experts} /></div>
    </div>
  );
}

function BlastRadiusPreview({ blastRadius }: { blastRadius: BlastRadius }) {
  const affected = blastRadius.affectedServices;
  return <section className="panel h-full"><div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-white">Blast Radius</h2><p className="mt-1 text-xs leading-5 text-slate-500">Services that may be impacted if this dependency becomes unavailable.</p></div><span className="relationship-icon"><GitBranch aria-hidden="true" size={17} /></span></div><p className="mt-5 text-2xl font-semibold text-white">{affected.length}<span className="ml-2 text-xs font-normal text-slate-500">potentially affected {affected.length === 1 ? "service" : "services"}</span></p>{affected.length === 0 ? <div className="mt-5 rounded-lg border border-dashed border-slate-700/70 p-5 text-sm text-slate-500">No upstream services depend on this service. A failure would not propagate through the current dependency graph.</div> : <div className="mt-5 divide-y divide-slate-800/80">{affected.slice(0, 8).map((service) => <Link href={`/services/${service.id}`} key={service.id} className="blast-row"><span className="truncate text-sm text-slate-300">{service.name}</span><span className="hop-count">{service.hops} {service.hops === 1 ? "hop" : "hops"}</span></Link>)}</div>}</section>;
}

function NotFound() { return <section className="panel flex min-h-[480px] flex-col items-center justify-center px-6 text-center"><span className="rounded-full border border-slate-700 bg-slate-800/50 p-4 text-slate-400"><Radio aria-hidden="true" size={28} /></span><h1 className="mt-5 text-xl font-semibold text-white">Service not found</h1><p className="mt-2 text-sm text-slate-500">The requested service does not exist in TraceGraph.</p><Link href="/services" className="secondary-button mt-6 inline-flex items-center gap-2"><ArrowLeft size={14} /> Back to Services</Link></section>; }
function ServiceDetailSkeleton() { return <div className="space-y-6" aria-busy="true" aria-label="Loading service details"><span className="sr-only">Loading service details.</span><div className="skeleton h-48 rounded-xl" /><div className="grid gap-4 lg:grid-cols-2"><div className="skeleton h-64 rounded-xl" /><div className="skeleton h-64 rounded-xl" /></div><div className="skeleton h-80 rounded-xl" /></div>; }
