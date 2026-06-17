export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-white/55">{subtitle}</p>
      )}
    </header>
  );
}

/** Placeholder block for tabs that aren't built out yet. */
export function ComingSoon({ note }: { note: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
      <p className="text-sm text-white/60">{note}</p>
      <p className="mt-2 text-xs text-white/35">În curând</p>
    </div>
  );
}
