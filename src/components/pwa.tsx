"use client";

import { useEffect, useState } from "react";

/** Registers the service worker once the page has loaded. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((err) => console.error("SW registration failed:", err));
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}

/**
 * Install hint. On Chromium it captures `beforeinstallprompt` and shows a
 * one-tap install button; on iOS Safari it shows manual A2HS instructions.
 */
export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferred, setDeferred] = useState<Event | null>(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !("MSStream" in window)
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (isStandalone) return null;

  async function install() {
    if (!deferred) return;
    // `prompt` exists on the BeforeInstallPromptEvent (non-standard type).
    await (deferred as Event & { prompt: () => Promise<void> }).prompt();
    setDeferred(null);
  }

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 p-4 text-sm">
      <h3 className="font-medium mb-2">Install Oddvice</h3>
      {deferred ? (
        <button
          onClick={install}
          className="rounded-md bg-[#37F06C] px-3 py-1.5 font-medium text-[#020B0A] hover:bg-[#5af588] transition-colors"
        >
          Add to Home Screen
        </button>
      ) : isIOS ? (
        <p className="text-black/70 dark:text-white/70">
          Tap the Share button{" "}
          <span aria-label="share">⎋</span> then{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      ) : (
        <p className="text-black/70 dark:text-white/70">
          Use your browser menu to install this app.
        </p>
      )}
    </div>
  );
}
