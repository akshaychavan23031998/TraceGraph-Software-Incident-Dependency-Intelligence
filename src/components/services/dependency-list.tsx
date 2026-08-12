import { ArrowDownRight, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/states";
import type { ServiceReference } from "@/types/api";

export function DependencyList({ title, description, services, direction }: { title: string; description: string; services: ServiceReference[]; direction: "outgoing" | "incoming" }) {
  const Icon = direction === "outgoing" ? ArrowDownRight : ArrowUpLeft;
  return (
    <section className="panel">
      <div className="flex items-start gap-3"><span className="relationship-icon"><Icon aria-hidden="true" size={17} /></span><div><h2 className="text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
      <div className="mt-5">
        {services.length === 0 ? <EmptyState title="No direct relationships" description={direction === "outgoing" ? "This service has no direct dependencies." : "No upstream services directly depend on this service."} /> : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            {services.map((service) => <Link key={service.id} href={`/services/${service.id}`} className="related-service"><span className="truncate">{service.name}</span><span aria-hidden="true">→</span></Link>)}
          </div>
        )}
      </div>
    </section>
  );
}

