const dateFmt = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formats an ISO date string to e.g. "17 iun. 2026". Empty string if absent. */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return dateFmt.format(d);
}

/** Google News titles end with " - Source"; drop that for a cleaner heading. */
export function cleanTitle(title: string, source: string): string {
  if (source && title.endsWith(` - ${source}`)) {
    return title.slice(0, -(` - ${source}`.length)).trim();
  }
  return title;
}
