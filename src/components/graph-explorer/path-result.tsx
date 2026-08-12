import { ArrowDown, ArrowRight, Route } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import type { DependencyPathResult } from "@/types/api";

export function PathResult({ result, onSwap }: { result: DependencyPathResult | null; onSwap: () => void }) {
  if (!result) return <div className="panel"><EmptyState title="Choose two services" description="Choose a source and destination service to trace their dependency path." /></div>;
  if (result.hopCount === null || result.path.length === 0) return <div className="panel"><EmptyState title="No dependency path found" description="These services are not connected through the current DEPENDS_ON direction within the supported traversal depth." /><div className="mt-4 text-center"><button type="button" className="secondary-button" onClick={onSwap}>Swap services</button></div></div>;

  return <section className="panel" aria-labelledby="shortest-path-title"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="section-kicker">Shortest dependency path</p><h2 id="shortest-path-title" className="mt-2 text-lg font-semibold text-white">{result.from.name} to {result.to.name}</h2></div><div className="flex gap-2"><span className="analysis-stat">{result.hopCount} {result.hopCount === 1 ? "hop" : "hops"}</span><span className="analysis-stat">{result.path.length} services</span></div></div><ol className="path-chain mt-7" aria-label="Dependency path">{result.path.map((service, index) => <li key={service.id} className="path-chain-item"><Link href={`/services/${service.id}`} className="path-node"><span className="path-position">{index + 1}</span><span>{service.name}</span></Link>{index < result.path.length - 1 && <span className="path-arrow" aria-hidden="true"><ArrowRight className="hidden sm:block" size={18} /><ArrowDown className="sm:hidden" size={18} /></span>}</li>)}</ol><div className="mt-7 flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-xs leading-5 text-slate-500"><Route aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-teal-500" /><p>TraceGraph follows <code className="text-slate-400">DEPENDS_ON</code> relationships to find the shortest bounded dependency path between these services.</p></div></section>;
}

