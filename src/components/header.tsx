import Image from "next/image";
import Link from "next/link";

/** Sticky top bar shown on every screen: brand on the left, quick actions on
 * the right. On desktop it spans above the sidebar. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#020B0A]/90 px-4 backdrop-blur lg:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/icon.svg"
          alt="Oddvice"
          width={30}
          height={30}
          className="rounded-lg"
          unoptimized
          priority
        />
        <span className="text-base font-semibold tracking-tight">Oddvice</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/60 sm:inline">
          Cupa Mondială 2026
        </span>
        <Link
          href="/profile"
          aria-label="Profil"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#37F06C]/50 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
