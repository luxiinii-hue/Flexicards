/**
 * Lightweight pub/sub for toast notifications, separated from the Toaster
 * component so react-refresh stays happy with single-component files.
 */

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "success" | "warn" | "error";
}

const listeners = new Set<(toast: Toast) => void>();
let nextId = 1;

export function pushToast(message: string, tone: Toast["tone"] = "info"): void {
  const toast: Toast = { id: nextId++, message, tone };
  for (const l of listeners) l(toast);
}

export function subscribeToToasts(handler: (toast: Toast) => void): () => void {
  listeners.add(handler);
  return () => {
    listeners.delete(handler);
  };
}
