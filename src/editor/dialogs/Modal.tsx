import { ReactNode, useEffect } from "react";

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  /** Max-width Tailwind class, e.g. "max-w-2xl". */
  size?: string;
}

export function Modal({ title, children, onClose, size = "max-w-xl" }: Props): JSX.Element {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4" onClick={onClose}>
      <div
        className={`flex max-h-[90vh] w-full ${size} flex-col rounded-lg bg-ink-50 shadow-deep`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-ink-200 px-4 py-3">
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-500 hover:text-ink-900">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
