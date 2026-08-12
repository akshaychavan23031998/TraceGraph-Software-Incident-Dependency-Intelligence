import { TopologyExplorer } from "@/components/topology/topology-explorer";

export default function TopologyPage() {
  return <div><header className="mb-7"><p className="section-kicker">Interactive graph</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Service Topology</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Explore how production services depend on one another across the TraceGraph platform.</p><p className="mt-2 text-xs text-slate-500">Directed edges represent <code className="text-slate-400">DEPENDS_ON</code> relationships.</p></header><TopologyExplorer /></div>;
}

