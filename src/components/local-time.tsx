"use client";

// No `timeZone` option → the runtime's zone. On the client that's the user's
// browser timezone, so kickoff times render in their local time.
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Renders an ISO timestamp in the user's local timezone. `suppressHydrationWarning`
 * absorbs the server-vs-client zone diff; the client value (correct) wins. */
export function LocalTime({
  iso,
  mode = "datetime",
}: {
  iso: string | null;
  mode?: "date" | "time" | "datetime";
}) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const date = dateFmt.format(d);
  const time = timeFmt.format(d);
  const text = mode === "date" ? date : mode === "time" ? time : `${date} · ${time}`;
  return <span suppressHydrationWarning>{text}</span>;
}
