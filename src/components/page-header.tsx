export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
    </header>
  );
}

/** Styled empty state for sections that aren't built out yet. */
export function ComingSoon({ note }: { note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#37F06C]/15 text-[#37F06C]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />
        </svg>
      </div>
      <p className="text-sm text-white/70">{note}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/35">
        În curând
      </p>
    </div>
  );
}
