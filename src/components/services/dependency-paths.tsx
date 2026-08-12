"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { DependencyTraversal } from "@/types/api";

const depths = [2, 3, 4, 5, 6] as const;

export function DependencyPaths({ serviceId }: { serviceId: string }) {
  const [depth, setDepth] = useState<(typeof depths)[number]>(4);
  const [data, setData] = useState<DependencyTraversal | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchApi<DependencyTraversal>(`/api/services/${serviceId}/dependencies?maxDepth=${depth}`, controller.signal)
      .then(setData)
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [depth, retryKey, serviceId]);

  const paths = data?.paths ?? [];
  const visiblePaths = expanded ? paths : paths.slice(0, 10);
  const changeDepth = (value: string) => {
    setLoading(true);
    setFailed(false);
    setExpanded(false);
    setDepth(Number(value) as (typeof depths)[number]);
  };

  return (
    <section className="panel" aria-labelledby="dependency-paths-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><h2 id="dependency-paths-title" className="text-base font-semibold text-white">Dependency Paths</h2><p className="mt-1 text-xs leading-5 text-slate-500">Follow downstream relationships across multiple services.</p></div>
        <div className="relative shrink-0">
          <label htmlFor="dependency-depth" className="sr-only">Maximum dependency depth</label>
          <select id="dependency-depth" value={depth} onChange={(event) => changeDepth(event.target.value)} className="depth-select">
            {depths.map((value) => <option key={value} value={value}>{value} hops</option>)}
          </select><ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <div className="mt-5 min-h-36" aria-live="polite">
        {loading ? <PathSkeleton /> : failed ? <div className="section-error"><p>Unable to load dependency paths right now.</p><button type="button" className="secondary-button mt-3" onClick={() => { setFailed(false); setLoading(true); setRetryKey((value) => value + 1); }}>Try again</button></div> : paths.length === 0 ? <EmptyState title="No dependency paths" description="This service does not depend on other services within the selected depth." /> : (
          <div className="space-y-2">
            {visiblePaths.map((path, index) => (
              <article className="path-row" key={`${path.nodes.map((node) => node.id).join("-")}-${index}`}>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {path.nodes.map((node, nodeIndex) => <span key={`${node.id}-${nodeIndex}`} className="contents"><Link href={`/services/${node.id}`} className="path-chip">{node.name}</Link>{nodeIndex < path.nodes.length - 1 && <span className="text-slate-600" aria-hidden="true">→</span>}</span>)}
                </div>
                <span className="hop-count">{path.hopCount} {path.hopCount === 1 ? "hop" : "hops"}</span>
              </article>
            ))}
            {paths.length > 10 && <button type="button" className="secondary-button mt-3" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show fewer" : `Show ${paths.length - 10} more`}</button>}
          </div>
        )}
      </div>
    </section>
  );
}

function PathSkeleton() { return <div className="space-y-2" aria-label="Loading dependency paths"><span className="sr-only">Loading dependency paths.</span>{Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton h-12 rounded-lg" />)}</div>; }
