"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, isActive, NavIcon } from "./nav-config";

/** Mobile-only bottom navigation. Hidden from the `lg` breakpoint up, where the
 * desktop Sidebar takes over. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-around border-t border-white/10 bg-[#020B0A]/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);

          if (tab.center) {
            return (
              <li key={tab.href} className="-mt-8">
                <Link
                  href={tab.href}
                  aria-label={tab.label}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#C8F04A] text-[#020B0A] shadow-lg shadow-[#C8F04A]/20 ring-4 ring-[#020B0A] transition-transform active:scale-95">
                    <NavIcon name={tab.icon} size={26} />
                  </span>
                  <span
                    className={`text-[11px] ${active ? "text-[#C8F04A]" : "text-white/60"}`}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex w-16 flex-col items-center gap-1 py-1 text-[11px] transition-colors ${
                  active ? "text-[#C8F04A]" : "text-white/55 hover:text-white/80"
                }`}
              >
                <NavIcon name={tab.icon} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
