"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const COOKIE = "oddvice_onboarded";

/** Onboarding overlay. The (app) layout only renders it when the
 * `oddvice_onboarded` cookie is absent (decided server-side, so there's no
 * client-side flash of the feed before the overlay appears). */
export function Onboarding() {
  const t = useTranslations();
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // While navigating to /login, keep a clean full-screen cover so the feed
  // behind the overlay never flashes through.
  if (leaving) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020B0A]">
        <Image src="/logo.svg" alt="Oddvice" width={56} height={56} unoptimized />
      </div>
    );
  }

  if (!show) return null;

  const slides = [
    {
      image: "/onboarding/1.jpg",
      title: t("home.heroTitle"),
      text: t("home.heroSubtitle"),
    },
    {
      image: "/onboarding/2.jpg",
      title: t("nav.matches"),
      text: t("matches.subtitle"),
    },
    {
      image: "/onboarding/3.jpg",
      title: t("nav.bets"),
      text: t("bets.subtitle"),
    },
  ];
  const current = slides[slide];
  const last = slide === slides.length - 1;

  function done(goLogin: boolean) {
    // Persist as a cookie so the server gates the overlay on the next load
    // (no client-only flash). Mirror to localStorage too.
    document.cookie = `${COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(COOKIE, "1");
    } catch {}
    if (goLogin) {
      // Keep the cover up through the navigation — no feed flash before /login.
      setLeaving(true);
      router.push("/login");
      router.refresh();
    } else {
      // Skip → reveal the app without an account (guest / feed).
      setShow(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#020B0A] text-white">
      {/* Football backdrop */}
      {slides.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={s.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020B0A]/70 via-[#020B0A]/55 to-[#020B0A]" />

      {/* Skip → guest (no account) */}
      <div className="relative flex justify-end p-5">
        <button
          onClick={() => done(false)}
          className="text-sm font-semibold text-white/70 hover:text-white"
        >
          {t("onboarding.skip")}
        </button>
      </div>

      <div className="relative flex flex-1 items-start justify-center pt-6">
        <Image
          src="/logo.svg"
          alt="Oddvice"
          width={44}
          height={44}
          className="rounded-xl"
          unoptimized
        />
      </div>

      {/* Copy + controls */}
      <div className="relative flex flex-col gap-6 p-8 pb-10">
        <div>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight">
            {current.title}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">{current.text}</p>
        </div>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-6 bg-[#C8F04A]" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => (last ? done(true) : setSlide(slide + 1))}
          className="w-full rounded-xl bg-[#C8F04A] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          {last ? t("onboarding.getStarted") : t("onboarding.next")}
        </button>
      </div>
    </div>
  );
}
