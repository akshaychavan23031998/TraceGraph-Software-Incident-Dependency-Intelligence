export function formatDuration(startedAt: string, resolvedAt?: string): string {
  if (!resolvedAt) return "Ongoing";
  const start = new Date(startedAt).getTime();
  const end = new Date(resolvedAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "Duration unavailable";
  const totalMinutes = Math.round((end - start) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `Resolved in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `Resolved in ${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
}

