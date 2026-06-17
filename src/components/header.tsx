"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, isActive } from "./nav-config";

/** Title of the current section (null on Home, where we show the brand). */
function currentTitle(pathname: string): string | null {
  const tab = TABS.find((t) => t.href !== "/" && isActive(pathname, t.href));
  return tab ? tab.label : null;
}

/** Sticky top bar: page title (or brand on Home) on the left, actions right. */
export function Header() {
  const pathname = usePathname();
  const title = currentTitle(pathname);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#020B0A]/90 px-4 backdrop-blur lg:px-6">
      {title ? (
        <h1 className="font-display text-lg font-extrabold uppercase tracking-tight">
          {title}
        </h1>
      ) : (
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
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">
            Oddvice
          </span>
        </Link>
      )}

      <div className="flex items-center gap-2">
        <span className="mr-1 hidden rounded-full border border-[#37F06C]/30 bg-[#37F06C]/10 px-2.5 py-1 text-xs font-semibold text-[#37F06C] sm:inline">
          WC 2026
        </span>

        <button
          type="button"
          aria-label="Notificări"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#37F06C]/50 hover:text-white"
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
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#37F06C]" />
        </button>
      </div>
    </header>
  );
}
