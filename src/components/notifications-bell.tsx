"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/lib/notifications";
import { Icon } from "@/components/icon";

/** Header bell: red dot when unread, opens a dropdown of notifications. */
export function NotificationsBell() {
  const router = useRouter();
  const { items, unread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    markAllRead();
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, markAllRead]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#C8F04A]/50 hover:text-white"
      >
        <Icon name="bell" />
        {unread > 0 && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-white/10 bg-[#08110F] p-2 shadow-2xl">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
            Notifications
          </p>
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-white/50">
              No notifications yet.
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (n.href) router.replace(n.href);
                }}
                className="block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <p className="text-sm font-semibold text-white">{n.title}</p>
                {n.body && <p className="mt-0.5 text-xs text-white/55">{n.body}</p>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
