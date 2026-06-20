import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Download Oddvice — Android",
  description: "Get the Oddvice app: World Cup 2026 tips, live scores, lineups & news.",
};

export default function DownloadPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#020B0A] px-5 py-12 text-white">
      <div className="w-full max-w-sm text-center">
        <Image
          src="/logo.svg"
          alt="Oddvice"
          width={68}
          height={68}
          unoptimized
          className="mx-auto"
        />
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight">
          Oddvice
        </h1>
        <p className="mt-3 text-sm text-white/60">
          World Cup 2026 tips, live scores, lineups & news — in your pocket.
        </p>

        <a
          href="/oddvice.apk"
          download
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8F04A] px-6 py-4 text-base font-extrabold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
          </svg>
          Download for Android
        </a>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          Android APK · v1.0.0
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left">
          <p className="text-sm font-semibold">How to install</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-white/60">
            <li>Tap <b className="text-white/80">Download for Android</b> above.</li>
            <li>Open the downloaded <b className="text-white/80">oddvice.apk</b>.</li>
            <li>If prompted, allow <b className="text-white/80">Install from unknown sources</b> for your browser.</li>
            <li>Tap <b className="text-white/80">Install</b>, then open Oddvice.</li>
          </ol>
        </div>

        <Link href="/" className="mt-6 inline-block text-xs font-semibold text-[#C8F04A]">
          Open the web app instead →
        </Link>
        <p className="mt-5 text-[11px] leading-relaxed text-white/35">
          iPhone version coming soon. Oddvice provides information & analysis only —
          18+, play responsibly.
        </p>
      </div>
    </main>
  );
}
