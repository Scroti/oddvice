import Image from "next/image";
import Link from "next/link";
import { ApiStatus } from "@/components/api-status";

const QUICK_LINKS = [
  {
    href: "/matches",
    title: "Caută meciuri",
    desc: "Rezultate și fixtures",
  },
  {
    href: "/bets",
    title: "Ponturile zilei",
    desc: "Predicții și valoare",
  },
  {
    href: "/news",
    title: "Cupa Mondială 2026",
    desc: "Tot ce contează despre turneu",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:gap-5 lg:text-left">
        <Image
          src="/icon.svg"
          alt="Oddvice"
          width={72}
          height={72}
          className="rounded-2xl"
          unoptimized
          priority
        />
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl font-semibold tracking-tight">Oddvice</h1>
          <p className="mx-auto mt-1 max-w-[85vw] text-sm text-balance text-white/60 sm:max-w-md lg:mx-0">
            Sfaturi de pariere pentru fotbal. Focus: Cupa Mondială 2026.
          </p>
        </div>
      </section>

      <ApiStatus />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-white/10 p-4 transition-colors hover:border-[#37F06C]/50 hover:bg-white/[0.03]"
          >
            <p className="text-sm font-medium">{link.title}</p>
            <p className="mt-1 text-xs text-white/50">{link.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
