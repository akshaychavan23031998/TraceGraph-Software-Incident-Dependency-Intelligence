import { GraphExplorer } from "@/components/graph-explorer/graph-explorer";

export default function PathsPage() {
  return <div><header className="mb-7"><p className="section-kicker">Graph analysis</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Graph Explorer</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Trace dependency paths and understand the potential impact of service failures.</p></header><GraphExplorer /></div>;
}

