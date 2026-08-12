import { UserRoundCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/states";
import type { Engineer } from "@/types/graph";

export function IncidentResolvers({ resolvers }: { resolvers: Engineer[] }) {
  return <section className="panel h-full"><h2 className="text-base font-semibold text-white">Resolved By</h2><p className="mt-1 text-xs text-slate-500">Engineers connected to the incident response.</p><div className="mt-5">{resolvers.length === 0 ? <EmptyState title="No resolver recorded" description="No resolver has been recorded for this incident yet." /> : <div className="space-y-3">{resolvers.map((resolver) => <article className="expert-row" key={resolver.id}><span className="expert-avatar"><UserRoundCheck aria-hidden="true" size={16} /></span><div><h3 className="text-sm font-medium text-slate-100">{resolver.name}</h3><p className="mt-0.5 text-xs text-slate-500">{resolver.role}</p></div></article>)}</div>}</div></section>;
}

