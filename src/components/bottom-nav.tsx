"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { TABS, isActive, NavIcon } from "./nav-config";
import { useHasLive } from "@/lib/use-live";

/** Mobile-only bottom navigation (flat, modern). Hidden from `lg` up, where the
 * sidebar takes over. Active tab gets a lime pill behind its icon. */
export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const hasLive = useHasLive();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#020B0A]/90 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`relative grid h-7 w-10 place-items-center rounded-full transition-colors ${
                    active ? "bg-[#C8F04A]/15 text-[#C8F04A]" : "text-white/55"
                  }`}
                >
                  <NavIcon name={tab.icon} size={19} />
                  {tab.href === "/" && hasLive && (
                    <span className="absolute right-1.5 top-0 h-2 w-2 animate-pulse rounded-full bg-red-500 ring-2 ring-[#020B0A]" />
                  )}
                </span>
                <span
                  className={`text-[10px] transition-colors ${
                    active ? "font-semibold text-[#C8F04A]" : "text-white/55"
                  }`}
                >
                  {t(tab.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
