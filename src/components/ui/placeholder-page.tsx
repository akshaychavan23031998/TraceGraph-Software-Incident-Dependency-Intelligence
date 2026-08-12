import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div>
      <p className="section-kicker">Coming next</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
      <section className="panel mt-8 flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
        <span className="rounded-xl border border-teal-400/15 bg-teal-400/[0.06] p-4 text-teal-400"><Icon aria-hidden="true" size={28} /></span>
        <h2 className="mt-5 text-lg font-semibold text-white">{title} is coming in the next phase</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      </section>
    </div>
  );
}

