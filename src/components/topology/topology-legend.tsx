export function TopologyLegend() {
  return <div className="topology-legend"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Arrow direction</p><p className="mt-1 text-xs text-slate-400">Service A <span className="text-teal-400">→</span> Service B means A depends on B.</p></div><div className="flex flex-wrap gap-2">{(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => <span key={level} className="legend-item" data-criticality={level}><span />{level}</span>)}</div></div>;
}

