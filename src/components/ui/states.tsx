import { AlertCircle, Inbox } from "lucide-react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard data">
      <span className="sr-only">Loading TraceGraph dashboard data.</span>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-32 rounded-xl" key={index} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.4fr]">
        <div className="skeleton h-96 rounded-xl" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/80 px-6 text-center">
      <Inbox aria-hidden="true" className="mb-3 text-slate-500" size={24} />
      <p className="font-medium text-slate-200">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export function ErrorState({
  retry,
  title = "Unable to load TraceGraph data",
  description = "The requested data could not be reached. Check the connection and try again.",
}: {
  retry: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="panel flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-rose-400/20 bg-rose-400/10 p-3 text-rose-300"><AlertCircle aria-hidden="true" size={24} /></span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      <button type="button" className="secondary-button mt-5" onClick={retry}>Try again</button>
    </div>
  );
}
