"use client";

import { GitBranch, Route } from "lucide-react";
import { useEffect, useState } from "react";
import { BlastRadius } from "@/components/graph-explorer/blast-radius";
import { PathFinder } from "@/components/graph-explorer/path-finder";
import { ErrorState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { Service } from "@/types/graph";

type Mode = "path" | "blast";

export function GraphExplorer() {
  const [mode, setMode] = useState<Mode>("path");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => { setLoading(true); setFailed(false); try { const items = await fetchApi<Service[]>("/api/services"); setServices([...items].sort((left, right) => left.name.localeCompare(right.name))); } catch { setFailed(true); } finally { setLoading(false); } };

  useEffect(() => { const controller = new AbortController(); fetchApi<Service[]>("/api/services", controller.signal).then((items) => setServices([...items].sort((left, right) => left.name.localeCompare(right.name)))).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, []);

  if (loading) return <GraphExplorerSkeleton />;
  if (failed) return <ErrorState retry={() => void load()} />;

  return <div><div className="mode-tabs" role="tablist" aria-label="Graph analysis mode"><button id="path-tab" type="button" role="tab" aria-controls="graph-analysis-panel" aria-selected={mode === "path"} className="mode-tab" data-active={mode === "path"} onClick={() => setMode("path")}><Route aria-hidden="true" size={16} />Path Finder</button><button id="blast-tab" type="button" role="tab" aria-controls="graph-analysis-panel" aria-selected={mode === "blast"} className="mode-tab" data-active={mode === "blast"} onClick={() => setMode("blast")}><GitBranch aria-hidden="true" size={16} />Blast Radius</button></div><div id="graph-analysis-panel" className="mt-5" role="tabpanel" aria-labelledby={mode === "path" ? "path-tab" : "blast-tab"}>{mode === "path" ? <PathFinder services={services} /> : <BlastRadius services={services} />}</div></div>;
}

function GraphExplorerSkeleton() { return <div aria-busy="true" aria-label="Loading service catalog"><div className="skeleton h-12 w-72 max-w-full rounded-lg" /><div className="skeleton mt-5 h-44 rounded-xl" /><div className="skeleton mt-5 h-72 rounded-xl" /></div>; }
