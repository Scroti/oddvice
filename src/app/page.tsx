import { ApiStatus } from "@/components/api-status";
import { InstallPrompt } from "@/components/pwa";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600" />
        <h1 className="text-3xl font-semibold tracking-tight">Oddvice</h1>
        <p className="text-black/60 dark:text-white/60 max-w-md">
          Next.js PWA boilerplate — installable on web, iOS, and Android.
          Edit{" "}
          <code className="rounded bg-black/[.06] dark:bg-white/[.08] px-1.5 py-0.5 font-mono text-sm">
            src/app/page.tsx
          </code>{" "}
          to get started.
        </p>
      </div>

      <ApiStatus />

      <div className="w-full max-w-sm">
        <InstallPrompt />
      </div>
    </main>
  );
}
