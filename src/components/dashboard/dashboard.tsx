"use client";

import { AlertTriangle, CheckCircle2, GitBranch, Network, Route, Share2, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CriticalityBadge, IncidentStatusBadge, SeverityBadge } from "@/components/ui/badges";
import { DashboardSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { formatDateTime } from "@/lib/format-date";
import type { ApiSuccess } from "@/types/api";
import type { Incident, Service } from "@/types/graph";

type Health = { status: "ok" | "degraded"; database: "connected" | "unavailable" };
type DashboardData = { services: Service[]; incidents: Incident[]; health: Health };

async function fetchDashboardData(): Promise<DashboardData> {
  const [servicesResponse, incidentsResponse, healthResponse] = await Promise.all([
    fetch("/api/services"), fetch("/api/incidents"), fetch("/api/health"),
  ]);
  if (!servicesResponse.ok || !incidentsResponse.ok) throw new Error("Dashboard data unavailable");
  const servicePayload = (await servicesResponse.json()) as ApiSuccess<Service[]>;
  const incidentPayload = (await incidentsResponse.json()) as ApiSuccess<Incident[]>;
  const health = healthResponse.ok
    ? (await healthResponse.json()) as Health
    : { status: "degraded" as const, database: "unavailable" as const };
  return { services: servicePayload.data, incidents: incidentPayload.data, health };
}

export function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const data = await fetchDashboardData();
      setServices(data.services);
      setIncidents(data.incidents);
      setHealth(data.health);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchDashboardData()
      .then((data) => {
        if (!active) return;
        setServices(data.services);
        setIncidents(data.incidents);
        setHealth(data.health);
      })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activeIncidents = incidents.filter((incident) => incident.status !== "RESOLVED").length;
  const resolvedIncidents = incidents.filter((incident) => incident.status === "RESOLVED").length;
  const criticalServices = services.filter((service) => service.criticality === "CRITICAL");

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">Operations intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">System Overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Monitor service criticality, active incidents, and dependency health across the platform.</p>
        </div>
        {health && (
          <div className={`connection-pill ${health.database === "connected" ? "is-connected" : "is-degraded"}`}>
            <span aria-hidden="true" className="connection-dot" />
            CognoDB {health.database === "connected" ? "Connected" : "Unavailable"}
          </div>
        )}
      </header>

      {loading ? <DashboardSkeleton /> : failed ? <ErrorState retry={() => void loadDashboard()} /> : (
        <div className="space-y-8">
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">System metrics</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total Services" value={services.length} detail="Production services mapped" icon={Network} tone="teal" />
              <MetricCard label="Critical Services" value={criticalServices.length} detail="Require highest availability" icon={ShieldAlert} tone="amber" />
              <MetricCard label="Active Incidents" value={activeIncidents} detail="Investigating or monitoring" icon={AlertTriangle} tone="rose" />
              <MetricCard label="Resolved Incidents" value={resolvedIncidents} detail="Historical incidents closed" icon={CheckCircle2} tone="blue" />
            </div>
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-[1.02fr_1.45fr]">
            <section className="panel" aria-labelledby="critical-services-heading">
              <SectionHeader title="Critical Services" description="Highest-priority production dependencies" />
              <div className="mt-5">
                {criticalServices.length === 0 ? <EmptyState title="No critical services" description="No services are currently classified as critical." /> : (
                  <div className="divide-y divide-slate-800/80">
                    {criticalServices.slice(0, 6).map((service) => (
                      <article key={service.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-slate-100">{service.name}</h3>
                          <p className="mt-1 text-xs text-slate-500">{service.language} · <span className="capitalize">{service.environment}</span></p>
                        </div>
                        <CriticalityBadge value={service.criticality} />
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="panel" aria-labelledby="recent-incidents-heading">
              <SectionHeader title="Recent Incidents" description="Latest operational events across the graph" />
              <div className="mt-5">
                {incidents.length === 0 ? <EmptyState title="No incidents found" description="Incidents will appear here when operational events are recorded." /> : (
                  <div className="space-y-1">
                    {incidents.slice(0, 5).map((incident) => (
                      <article key={incident.id} className="incident-row">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500">{incident.id.toUpperCase()}</span>
                            <SeverityBadge value={incident.severity} />
                            <IncidentStatusBadge value={incident.status} />
                          </div>
                          <h3 className="mt-2 truncate text-sm font-medium text-slate-100">{incident.title}</h3>
                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">{incident.summary}</p>
                        </div>
                        <time dateTime={incident.startedAt} className="shrink-0 text-right text-[11px] leading-5 text-slate-500">{formatDateTime(incident.startedAt)}</time>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section aria-labelledby="graph-intelligence-heading">
            <SectionHeader title="Graph Intelligence" description="Operational answers powered by connected system context" />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <CapabilityCard title="Service Topology" description="Explore the complete directed dependency map and inspect connected services." icon={Share2} href="/topology" />
              <CapabilityCard title="Dependency Paths" description="Trace multi-hop relationships and find the shortest path between systems." icon={Route} href="/paths" />
              <CapabilityCard title="Blast Radius" description="Identify every upstream service that could be impacted by a dependency failure." icon={GitBranch} href="/paths" />
              <CapabilityCard title="Incident Experts" description="Find engineers with prior resolution experience across nearby services." icon={Users} href="/services" />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: number; detail: string; icon: typeof Network; tone: string }) {
  return <article className="metric-card"><div className={`metric-icon tone-${tone}`}><Icon aria-hidden="true" size={18} /></div><p className="mt-6 text-[13px] font-medium text-slate-400">{label}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-white">{value}</p><p className="mt-2 text-xs text-slate-600">{detail}</p></article>;
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return <div><h2 className="text-base font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>;
}

function CapabilityCard({ title, description, icon: Icon, href }: { title: string; description: string; icon: typeof Network; href: string }) {
  return <article className="capability-card"><Icon aria-hidden="true" size={20} className="text-teal-400" /><h3 className="mt-5 text-sm font-semibold text-white">{title}</h3><p className="mt-2 min-h-12 text-xs leading-5 text-slate-500">{description}</p><Link href={href} className="mt-5 inline-flex text-xs font-medium text-slate-300 hover:text-teal-300">Explore capability <span aria-hidden="true" className="ml-1">→</span></Link></article>;
}
