import { ArrowUpRight, Box } from "lucide-react";
import Link from "next/link";

import { CriticalityBadge } from "@/components/ui/badges";
import type { Service } from "@/types/graph";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className="flex items-start justify-between gap-4">
        <span className="service-icon"><Box aria-hidden="true" size={18} /></span>
        <CriticalityBadge value={service.criticality} />
      </div>
      <h2 className="mt-5 text-[15px] font-semibold text-white">{service.name}</h2>
      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{service.description}</p>
      <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="metadata-chip">{service.language}</span>
        <span className="metadata-chip capitalize">{service.environment}</span>
      </div>
      <Link href={`/services/${service.id}`} className="service-link mt-5">
        View service <ArrowUpRight aria-hidden="true" size={14} />
      </Link>
    </article>
  );
}

