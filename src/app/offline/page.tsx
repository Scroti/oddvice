export default function OfflinePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-black/70 dark:text-white/70 max-w-sm">
        Oddvice can&apos;t reach the network right now. Reconnect and try again.
      </p>
    </main>
  );
}
