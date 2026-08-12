"use client";

import { useEffect, useState } from "react";
import { TopologyCanvas } from "@/components/topology/topology-canvas";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { ServiceTopology } from "@/types/api";

export function TopologyExplorer() {
  const [topology, setTopology] = useState<ServiceTopology | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => { setLoading(true); setFailed(false); try { setTopology(await fetchApi<ServiceTopology>("/api/topology")); } catch { setFailed(true); } finally { setLoading(false); } };
  useEffect(() => { const controller = new AbortController(); fetchApi<ServiceTopology>("/api/topology", controller.signal).then(setTopology).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, []);
  if (loading) return <div className="topology-loading" aria-busy="true"><span className="sr-only">Loading service topology.</span><div className="skeleton h-full rounded-xl" /></div>;
  if (failed) return <ErrorState retry={() => void load()} title="Unable to load service topology" description="TraceGraph could not retrieve the dependency topology right now." />;
  if (!topology || topology.nodes.length === 0) return <div className="panel"><EmptyState title="No service topology is available" description="No production services are currently available to visualize." /></div>;
  return <TopologyCanvas topology={topology} />;
}
