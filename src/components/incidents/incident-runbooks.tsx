import { BookOpenText } from "lucide-react";
import { EmptyState } from "@/components/ui/states";
import type { Runbook } from "@/types/graph";

export function IncidentRunbooks({ runbooks }: { runbooks: Runbook[] }) {
  return <section className="panel"><h2 className="text-base font-semibold text-white">Runbooks</h2><p className="mt-1 text-xs text-slate-500">Documented response guidance associated with this incident.</p><div className="mt-5">{runbooks.length === 0 ? <EmptyState title="No runbooks linked" description="This incident does not have an associated response runbook." /> : <div className="grid gap-3 md:grid-cols-2">{runbooks.map((runbook) => <article className="runbook-card" key={runbook.id}><BookOpenText aria-hidden="true" size={18} className="shrink-0 text-teal-400" /><div><h3 className="text-sm font-medium text-slate-100">{runbook.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{runbook.description}</p></div></article>)}</div>}</div></section>;
}

