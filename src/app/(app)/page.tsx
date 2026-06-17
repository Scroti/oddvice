import Image from "next/image";
import Link from "next/link";
import { ApiStatus } from "@/components/api-status";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/icon.svg"
          alt="Oddvice"
          width={72}
          height={72}
          className="rounded-2xl"
          unoptimized
          priority
        />
        <h1 className="text-3xl font-semibold tracking-tight">Oddvice</h1>
        <p className="max-w-xs text-sm text-white/60">
          Sfaturi de pariere pentru fotbal. Focus: Cupa Mondială 2026.
        </p>
      </div>

      <ApiStatus />

      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/matches"
          className="rounded-xl border border-white/10 p-4 transition-colors hover:border-[#37F06C]/50"
        >
          <p className="text-sm font-medium">Caută meciuri</p>
          <p className="mt-1 text-xs text-white/50">Rezultate și fixtures</p>
        </Link>
        <Link
          href="/bets"
          className="rounded-xl border border-white/10 p-4 transition-colors hover:border-[#37F06C]/50"
        >
          <p className="text-sm font-medium">Ponturile zilei</p>
          <p className="mt-1 text-xs text-white/50">Predicții și valoare</p>
        </Link>
      </section>
    </div>
  );
}
