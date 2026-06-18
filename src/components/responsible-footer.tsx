/** Persistent legal/responsible-gambling note shown at the bottom of pages. */
export function ResponsibleFooter() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-xl border-t border-white/10 pt-4 text-center text-[11px] leading-relaxed text-white/35">
      <p>
        <span className="font-bold text-white/55">18+</span> · Joacă responsabil.
        Ponturile sunt informative și nu garantează câștiguri.
      </p>
      <a
        href="https://www.jocresponsabil.ro"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-[#C8F04A]/70 hover:text-[#C8F04A]"
      >
        Ai nevoie de ajutor? jocresponsabil.ro
      </a>
    </footer>
  );
}
