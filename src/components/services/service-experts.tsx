import { UserRound } from "lucide-react";
import { EmptyState } from "@/components/ui/states";
import type { ServiceExpert } from "@/types/api";

export function ServiceExperts({ experts }: { experts: ServiceExpert[] }) {
  return (
    <section className="panel h-full"><h2 className="text-base font-semibold text-white">Incident Experts</h2><p className="mt-1 text-xs leading-5 text-slate-500">Engineers with relevant resolution experience nearby in the graph.</p>
      <div className="mt-5">{experts.length === 0 ? <EmptyState title="No experts found" description="No engineers have resolved incidents connected to this service yet." /> : <div className="space-y-3">{experts.slice(0, 5).map((expert) => <article key={expert.id} className="expert-row"><span className="expert-avatar"><UserRound aria-hidden="true" size={16} /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium text-slate-100">{expert.name}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{expert.role}</p></div><span className="expert-count">{expert.resolvedIncidentCount}<span className="sr-only"> relevant incidents resolved</span></span></article>)}</div>}</div>
    </section>
  );
}

