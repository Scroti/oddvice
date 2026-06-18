"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMatches } from "@/lib/api";
import { NavIcon } from "@/components/nav-config";

const STORAGE_KEY = "oddvice_onboarded";

export function Onboarding() {
  const t = useTranslations();
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);
  const [flags, setFlags] = useState<string[]>([]);

  useEffect(() => {
    try {
      setShow(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setShow(false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    getMatches()
      .then((res) => {
        const seen = new Set<string>();
        const urls: string[] = [];
        for (const m of res.matches) {
          for (const b of [m.homeBadge, m.awayBadge]) {
            if (b && !seen.has(b)) {
              seen.add(b);
              urls.push(b);
            }
          }
        }
        setFlags(urls.slice(0, 24));
      })
      .catch(() => setFlags([]));
  }, [show]);

  if (!ready || !show) return null;

  const slides = [
    { title: t("home.heroTitle"), text: t("home.heroSubtitle"), icon: "logo" },
    { title: t("nav.matches"), text: t("matches.subtitle"), icon: "ball" },
    { title: t("nav.bets"), text: t("bets.subtitle"), icon: "spark" },
  ] as const;
  const current = slides[slide];
  const last = slide === slides.length - 1;

  function finish() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#020B0A] text-white">
      {/* Flag wall backdrop */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-2 p-2 opacity-[0.08] blur-[1px]">
        {flags.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ))}
      </div>
      {/* Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#C8F04A]/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020B0A]/40 via-[#020B0A]/70 to-[#020B0A]" />

      {/* Skip */}
      <div className="relative flex justify-end p-5">
        <button
          onClick={finish}
          className="text-sm font-semibold text-white/55 hover:text-white"
        >
          {t("onboarding.skip")}
        </button>
      </div>

      {/* Slide */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-8 grid h-24 w-24 place-items-center rounded-3xl bg-[#C8F04A]/10 ring-1 ring-[#C8F04A]/30">
          {current.icon === "logo" ? (
            <Image src="/icon.svg" alt="Oddvice" width={64} height={64} unoptimized />
          ) : (
            <span className="text-[#C8F04A]">
              <NavIcon name={current.icon} size={52} />
            </span>
          )}
        </div>
        <h1 className="max-w-md font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight">
          {current.title}
        </h1>
        <p className="mt-4 max-w-xs text-sm text-white/60">{current.text}</p>
      </div>

      {/* Controls */}
      <div className="relative flex flex-col items-center gap-5 p-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-6 bg-[#C8F04A]" : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => (last ? finish() : setSlide(slide + 1))}
          className="w-full max-w-xs rounded-xl bg-[#C8F04A] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          {last ? t("onboarding.getStarted") : t("onboarding.next")}
        </button>
      </div>
    </div>
  );
}
