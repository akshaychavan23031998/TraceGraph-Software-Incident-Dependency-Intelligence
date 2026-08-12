import type { Service } from "@/types/graph";

export function ServiceSelector({ id, label, value, services, onChange }: { id: string; label: string; value: string; services: Service[]; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="block"><span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span><select id={id} className="graph-select" value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select a service</option>{services.map((service) => <option value={service.id} key={service.id}>{service.name} · {service.criticality}</option>)}</select></label>;
}

