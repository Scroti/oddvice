"use client";

import { useNotificationWatcher } from "@/lib/notifications";

/** Invisible client component that runs the notification watcher app-wide. */
export function NotificationWatcher() {
  useNotificationWatcher();
  return null;
}
