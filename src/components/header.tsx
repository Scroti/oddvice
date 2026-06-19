"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { TABS, isActive } from "./nav-config";
import { NotificationsBell } from "@/components/notifications-bell";

/** i18n key (under "nav") for the current section, or null on Home. */
function currentTitleKey(pathname: string): string | null {
  const tab = TABS.find((t) => t.href !== "/" && isActive(pathname, t.href));
  if (tab) return tab.key;
  if (isActive(pathname, "/profile")) return "profile";
  return null;
}

/** Fixed top bar: logo + (page title or brand) on the left, actions right. */
export function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const titleKey = currentTitleKey(pathname);
  const title = titleKey ? t(titleKey) : null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#020B0A]/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2.5">
        <Link href="/" aria-label="Acasă" className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Oddvice"
            width={30}
            height={30}
            className="rounded-lg"
            unoptimized
            priority
          />
        </Link>
        <span className="font-display text-lg font-extrabold uppercase tracking-tight">
          {title ?? "Oddvice"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsBell />

        <Link
          href="/profile"
          aria-label="Profil"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#C8F04A]/50 hover:text-white"
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
