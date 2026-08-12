"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/ui/states";
import type { Criticality, Service } from "@/types/graph";

type Filter = "ALL" | Criticality;
const filters: Array<{ value: Filter; label: string }> = [
  { value: "ALL", label: "All" }, { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" }, { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export function ServiceList({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesFilter = filter === "ALL" || service.criticality === filter;
      const matchesSearch = !search || [service.name, service.description, service.language]
        .some((value) => value.toLowerCase().includes(search));
      return matchesFilter && matchesSearch;
    });
  }, [filter, query, services]);

  const filteredActive = query.trim().length > 0 || filter !== "ALL";
  const clearFilters = () => { setQuery(""); setFilter("ALL"); };

  return (
    <>
      <section className="panel mb-5" aria-label="Service filters">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <label htmlFor="service-search" className="sr-only">Search services</label>
            <Search aria-hidden="true" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="service-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services..." className="search-input" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0" aria-label="Filter by criticality">
            <SlidersHorizontal aria-hidden="true" size={15} className="mr-1 shrink-0 text-slate-500" />
            {filters.map((item) => (
              <button key={item.value} type="button" className="filter-button" data-active={filter === item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{filteredActive ? `${filtered.length} of ${services.length} services` : `${services.length} services`}</p>
        {filteredActive && <button type="button" onClick={clearFilters} className="text-xs font-medium text-teal-400 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">Clear filters</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="panel"><EmptyState title="No services match your filters" description="Try a different search term or clear the current criticality filter." /><div className="mt-4 text-center"><button type="button" className="secondary-button" onClick={clearFilters}>Clear filters</button></div></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      )}
    </>
  );
}

