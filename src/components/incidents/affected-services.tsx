import { Building2 } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import type { AffectedService } from "@/types/api";

const impactLabel = { DEGRADED: "Degraded", PARTIAL_OUTAGE: "Partial outage", FULL_OUTAGE: "Full outage" } as const;

export function AffectedServices({ services }: { services: AffectedService[] }) {
  return <section className="panel"><h2 className="text-base font-semibold text-white">Affected Services</h2><p className="mt-1 text-xs text-slate-500">Production services connected to this incident.</p><div className="mt-5">{services.length === 0 ? <EmptyState title="No affected services recorded" description="No service-impact relationships are linked to this incident." /> : <div className="grid gap-3 md:grid-cols-2">{services.map((service) => <Link href={`/services/${service.id}`} key={service.id} className="affected-card"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-medium text-slate-100">{service.name}</h3><span className={`impact-badge impact-${service.impact.toLowerCase()}`}>{impactLabel[service.impact]}</span></div><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Building2 aria-hidden="true" size={13} /><span>{service.team?.name ?? "No owning team"}</span></div></Link>)}</div>}</div></section>;
}

