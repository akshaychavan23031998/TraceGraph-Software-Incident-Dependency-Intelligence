import { ServiceExplorer } from "@/components/services/service-explorer";

export default function ServicesPage() {
  return (
    <div>
      <header className="mb-7">
        <p className="section-kicker">System catalog</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Service Explorer</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Browse production services, inspect criticality, and follow dependency relationships across the platform.</p>
      </header>
      <ServiceExplorer />
    </div>
  );
}

