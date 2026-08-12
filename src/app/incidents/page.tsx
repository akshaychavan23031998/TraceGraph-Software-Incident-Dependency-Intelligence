import { IncidentExplorer } from "@/components/incidents/incident-explorer";

export default function IncidentsPage() {
  return <div><header className="mb-7"><p className="section-kicker">Operational history</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Incident Explorer</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Investigate production incidents, affected services, deployments, and resolution context.</p></header><IncidentExplorer /></div>;
}

