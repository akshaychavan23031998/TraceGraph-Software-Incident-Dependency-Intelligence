import Link from "next/link";
import type { BlastRadiusService } from "@/types/api";

export function BlastRadiusGroups({ services }: { services: BlastRadiusService[] }) {
  const groups = new Map<number, BlastRadiusService[]>();
  for (const service of services) groups.set(service.hops, [...(groups.get(service.hops) ?? []), service]);
  return <div className="space-y-4">{[...groups.entries()].sort(([left], [right]) => left - right).map(([hops, items]) => <section className="hop-group" key={hops}><div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3"><div><h3 className="text-sm font-semibold text-slate-200">{hops} {hops === 1 ? "hop" : "hops"} away</h3><p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{hops === 1 ? "Direct impact" : "Indirect impact"}</p></div><span className="analysis-stat">{items.length} services</span></div><div className="mt-2 grid gap-1 sm:grid-cols-2 xl:grid-cols-3">{items.sort((left, right) => left.name.localeCompare(right.name)).map((service) => <Link href={`/services/${service.id}`} key={service.id} className="impact-service-link"><span className="truncate">{service.name}</span><span className="hop-count">{service.hops} {service.hops === 1 ? "hop" : "hops"}</span></Link>)}</div></section>)}</div>;
}

