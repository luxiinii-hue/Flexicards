import { useEffect, useState } from "react";
import { type Toast, subscribeToToasts } from "./toastBus";

export function Toaster(): JSX.Element {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    return subscribeToToasts((toast) => {
      setItems((prev) => [...prev, toast]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-md px-3 py-2 text-sm shadow-deep ${
            t.tone === "success"
              ? "bg-emerald-700 text-white"
              : t.tone === "warn"
              ? "bg-amber-600 text-white"
              : t.tone === "error"
              ? "bg-red-700 text-white"
              : "bg-ink-900 text-ink-50"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
