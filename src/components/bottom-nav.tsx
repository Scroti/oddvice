"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "home" | "ball" | "spark" | "news" | "user";

type Tab = {
  href: string;
  label: string;
  icon: IconName;
  center?: boolean;
};

// Single source of truth for the bottom navigation. Add/rename tabs here.
const TABS: Tab[] = [
  { href: "/", label: "Acasă", icon: "home" },
  { href: "/matches", label: "Meciuri", icon: "ball" },
  { href: "/bets", label: "Ponturi", icon: "spark", center: true },
  { href: "/news", label: "Știri", icon: "news" },
  { href: "/profile", label: "Profil", icon: "user" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
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
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#37F06C] text-[#020B0A] shadow-lg shadow-[#37F06C]/20 ring-4 ring-[#020B0A] transition-transform active:scale-95">
                    <Icon name={tab.icon} size={26} />
                  </span>
                  <span
                    className={`text-[11px] ${active ? "text-[#37F06C]" : "text-white/60"}`}
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
                  active ? "text-[#37F06C]" : "text-white/55 hover:text-white/80"
                }`}
              >
                <Icon name={tab.icon} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 8.8V21h14V8.8" />
        </svg>
      );
    case "ball":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m12 7 4 3-1.5 5h-5L8 10z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />
        </svg>
      );
    case "news":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="14" height="14" rx="1.5" />
          <path d="M17 8h3v9a2 2 0 0 1-2 2" />
          <path d="M6 9h7M6 12.5h7M6 16h4" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
  }
}
