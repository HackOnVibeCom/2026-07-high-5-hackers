import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BellOff, CheckCheck } from "lucide-react";
import { useApp, type Notification } from "../../lib/store";

const toneBg: Record<string, string> = {
  teal: "bg-teal-100 text-teal-800",
  rose: "bg-rose-100 text-rose-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
};

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notifications = useApp((s) => s.notifications);
  const markRead = useApp((s) => s.markNotificationsRead);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const grouped = notifications.reduce<Record<string, Notification[]>>((acc, n) => {
    (acc[n.day] ||= []).push(n);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed right-4 top-[68px] z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl sm:right-6 lg:right-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={markRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 transition hover:text-neutral-900 disabled:cursor-default disabled:opacity-40"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                  <BellOff className="h-6 w-6 text-neutral-400" />
                  <p className="text-sm text-neutral-500">You're all caught up.</p>
                </div>
              ) : (
                Object.entries(grouped).map(([day, items]) => (
                  <div key={day}>
                    <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                      {day}
                    </div>
                    {items.map((n) => (
                      <Link
                        key={n.id}
                        to={n.to}
                        onClick={() => {
                          markRead();
                          onClose();
                        }}
                        className={`flex gap-3 border-b border-neutral-100 px-4 py-3 transition hover:bg-neutral-50 ${
                          n.unread ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase ${toneBg[n.tone]}`}
                        >
                          {n.tone[0]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-neutral-800">{n.text}</p>
                        </div>
                        {n.unread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                        )}
                      </Link>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
