// Shared navigation config used by both the mobile bottom bar and the
// desktop sidebar. Add/rename tabs in one place.

export type IconName = "home" | "ball" | "watch" | "spark" | "news" | "user";

export type Tab = {
  href: string;
  key: string; // i18n key under the "nav" namespace
  icon: IconName;
};

export const TABS: Tab[] = [
  { href: "/", key: "home", icon: "home" },
  { href: "/matches", key: "matches", icon: "ball" },
  { href: "/bets", key: "bets", icon: "spark" },
  { href: "/watch", key: "watch", icon: "watch" },
  { href: "/news", key: "news", icon: "news" },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavIcon({ name, size = 22 }: { name: IconName; size?: number }) {
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
    case "watch":
      return (
        <svg {...props}>
          <rect x="3" y="4.5" width="18" height="12" rx="2" />
          <path d="M8 20.5h8" />
          <path d="m11 8.5 4 2-4 2z" />
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
