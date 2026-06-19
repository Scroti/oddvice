const STORAGE_KEY = "goal-notify";
const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlBase64ToUint8Array(base64: string): any {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function isPushEnabled(): boolean {
  return typeof localStorage !== "undefined" &&
    localStorage.getItem(STORAGE_KEY) === "1";
}

export async function enablePush(): Promise<void> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Push not supported in this browser");
  }
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permission denied");

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
  });

  await fetch(`${API}/api/v1/push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });

  localStorage.setItem(STORAGE_KEY, "1");
}

export async function disablePush(): Promise<void> {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await fetch(`${API}/api/v1/push/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    await sub.unsubscribe();
  }
  localStorage.removeItem(STORAGE_KEY);
}
