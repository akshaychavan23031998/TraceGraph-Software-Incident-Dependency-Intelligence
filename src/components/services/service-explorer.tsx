"use client";

import { useEffect, useState } from "react";
import { ServiceList } from "@/components/services/service-list";
import { ErrorState } from "@/components/ui/states";
import { fetchApi } from "@/lib/api/client";
import type { Service } from "@/types/graph";

export function ServiceExplorer() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    setLoading(true); setFailed(false);
    try { setServices(await fetchApi<Service[]>("/api/services")); }
    catch { setFailed(true); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchApi<Service[]>("/api/services", controller.signal)
      .then(setServices).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  if (loading) return <ServiceListSkeleton />;
  if (failed) return <ErrorState retry={() => void load()} title="Unable to load services" description="TraceGraph could not retrieve the service catalog right now." />;
  return <ServiceList services={services} />;
}

function ServiceListSkeleton() {
  return <div aria-busy="true" aria-label="Loading services"><div className="skeleton mb-5 h-20 rounded-xl" /><div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-64 rounded-xl" />)}</div></div>;
}
