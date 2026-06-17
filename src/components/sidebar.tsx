"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, isActive, NavIcon } from "./nav-config";

/** Desktop-only left sidebar, sitting below the header. Hidden below the `lg`
 * breakpoint, where the mobile BottomNav takes over. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#020B0A] px-4 py-6 lg:flex">
      <nav className="flex flex-col gap-1">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white/5 font-medium text-[#37F06C]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <NavIcon name={tab.icon} size={20} />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto px-3 text-xs text-white/30">Cupa Mondială 2026</p>
    </aside>
  );
}
