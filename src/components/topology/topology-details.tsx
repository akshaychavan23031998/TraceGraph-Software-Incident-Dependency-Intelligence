import { ArrowDownRight, ArrowUpLeft, Box } from "lucide-react";
import Link from "next/link";
import { CriticalityBadge } from "@/components/ui/badges";
import type { ServiceTopology, TopologyNode } from "@/types/api";

export function TopologyDetails({ service, topology }: { service: TopologyNode | null; topology: ServiceTopology }) {
  if (!service) return <aside className="panel topology-details"><div className="flex min-h-64 flex-col items-center justify-center text-center"><span className="service-hero-icon"><Box aria-hidden="true" size={22} /></span><h2 className="mt-4 text-sm font-semibold text-white">Select a service</h2><p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">Choose a node to inspect its direct dependencies and upstream consumers.</p></div></aside>;
  const outgoing = topology.edges.filter((edge) => edge.source === service.id).length;
  const incoming = topology.edges.filter((edge) => edge.target === service.id).length;
  return <aside className="panel topology-details"><div className="flex items-start justify-between gap-3"><span className="service-hero-icon"><Box aria-hidden="true" size={22} /></span><CriticalityBadge value={service.criticality} /></div><h2 className="mt-5 text-lg font-semibold text-white">{service.name}</h2><p className="mt-2 text-xs leading-5 text-slate-500">{service.description}</p><div className="mt-5 flex flex-wrap gap-2"><span className="metadata-chip">{service.language}</span><span className="metadata-chip capitalize">{service.environment}</span></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="topology-count"><ArrowDownRight aria-hidden="true" size={16} className="text-teal-400" /><p className="mt-3 text-2xl font-semibold text-white">{outgoing}</p><p className="mt-1 text-[10px] text-slate-500">Depends on</p></div><div className="topology-count"><ArrowUpLeft aria-hidden="true" size={16} className="text-blue-400" /><p className="mt-3 text-2xl font-semibold text-white">{incoming}</p><p className="mt-1 text-[10px] text-slate-500">Depended on by</p></div></div><Link href={`/services/${service.id}`} className="secondary-button mt-6 inline-flex w-full items-center justify-center">View full service details</Link></aside>;
}

