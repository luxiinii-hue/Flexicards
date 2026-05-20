import { useEffect } from "react";
import { useStore } from "@/state/store";

interface Options {
  onNew?: () => void;
  onPrintQueue?: () => void;
}

export function useKeyboardShortcuts(options: Options): void {
  const activeCardId = useStore((s) => s.activeCardId);
  const duplicateCard = useStore((s) => s.duplicateCard);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const tag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      // Don't intercept text input shortcuts inside inputs/textareas
      const isEditable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key.toLowerCase() === "n" && !isEditable) {
        e.preventDefault();
        options.onNew?.();
      } else if (e.key.toLowerCase() === "p" && !isEditable) {
        e.preventDefault();
        options.onPrintQueue?.();
      } else if (e.key.toLowerCase() === "d" && !isEditable && activeCardId) {
        e.preventDefault();
        void duplicateCard(activeCardId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCardId, duplicateCard, options]);
}
