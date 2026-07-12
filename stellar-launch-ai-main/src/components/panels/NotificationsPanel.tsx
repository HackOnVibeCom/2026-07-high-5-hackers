import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { notifications } from "../../lib/mock-data";

const toneBg: Record<string, string> = {
  teal: "bg-teal-100 text-teal-800",
  rose: "bg-rose-100 text-rose-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
};

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const grouped = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    (acc[n.day] ||= []).push(n);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed right-4 top-[68px] z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl sm:right-6 lg:right-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div className="text-sm font-medium text-neutral-900">Notifications</div>
              <button className="text-xs text-neutral-500 hover:text-neutral-800">Mark all read</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {Object.entries(grouped).map(([day, items]) => (
                <div key={day}>
                  <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    {day}
                  </div>
                  {items.map((n) => (
                    <Link
                      key={n.id}
                      to={n.to}
                      onClick={onClose}
                      className="flex gap-3 border-b border-neutral-100 px-4 py-3 hover:bg-neutral-50"
                    >
                      <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase ${toneBg[n.tone]}`}>
                        {n.tone[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-neutral-800">{n.text}</p>
                      </div>
                      {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
