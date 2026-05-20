import { useEffect, useState } from "react";
import { useStore } from "@/state/store";
import { CardListPanel } from "./panels/CardListPanel";
import { PreviewPanel } from "./panels/PreviewPanel";
import { FormPanel } from "./panels/FormPanel";
import { LayoutPicker } from "./dialogs/LayoutPicker";
import { ScryfallDialog } from "./dialogs/ScryfallDialog";
import { PrintQueueDrawer } from "./print/PrintQueueDrawer";
import { SettingsDialog } from "./dialogs/SettingsDialog";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Toaster } from "./Toaster";

export function Editor(): JSX.Element {
  const init = useStore((s) => s.init);
  const initialized = useStore((s) => s.initialized);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [scryfallOpen, setScryfallOpen] = useState(false);
  const [printQueueOpen, setPrintQueueOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  useKeyboardShortcuts({
    onNew: () => setLayoutPickerOpen(true),
    onPrintQueue: () => setPrintQueueOpen(true),
  });

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center text-ink-500">
        <div className="text-lg">Loading Flexicards…</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-0 flex-col bg-ink-50">
      <Header
        onOpenLayoutPicker={() => setLayoutPickerOpen(true)}
        onOpenScryfall={() => setScryfallOpen(true)}
        onOpenPrintQueue={() => setPrintQueueOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="flex min-h-0 flex-1 flex-row">
        <CardListPanel
          onOpenLayoutPicker={() => setLayoutPickerOpen(true)}
          onOpenScryfall={() => setScryfallOpen(true)}
        />
        <PreviewPanel />
        <FormPanel />
      </main>
      {layoutPickerOpen ? <LayoutPicker onClose={() => setLayoutPickerOpen(false)} /> : null}
      {scryfallOpen ? <ScryfallDialog onClose={() => setScryfallOpen(false)} /> : null}
      {printQueueOpen ? <PrintQueueDrawer onClose={() => setPrintQueueOpen(false)} /> : null}
      {settingsOpen ? <SettingsDialog onClose={() => setSettingsOpen(false)} /> : null}
      <Toaster />
    </div>
  );
}

interface HeaderProps {
  onOpenLayoutPicker: () => void;
  onOpenScryfall: () => void;
  onOpenPrintQueue: () => void;
  onOpenSettings: () => void;
}

function Header({ onOpenLayoutPicker, onOpenScryfall, onOpenPrintQueue, onOpenSettings }: HeaderProps): JSX.Element {
  const printQueueSize = useStore((s) => Object.values(s.printQueue).reduce((a, b) => a + b, 0));
  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-ink-200 bg-ink-100/70 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-ink-900">
          <Logo />
          <span className="font-title text-lg font-semibold tracking-wide">Flexicards</span>
        </div>
        <span className="text-xs text-ink-500">Custom MTG card generator</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenLayoutPicker}
          className="rounded-md bg-ink-900 px-3 py-1.5 text-xs font-semibold text-ink-50 hover:bg-ink-700"
          title="New card (Ctrl+N)"
        >
          + Card
        </button>
        <button
          type="button"
          onClick={onOpenScryfall}
          className="rounded-md border border-ink-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
        >
          Import from Scryfall
        </button>
        <button
          type="button"
          onClick={onOpenPrintQueue}
          className="relative rounded-md border border-ink-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
          title="Print queue (Ctrl+P)"
        >
          Print Queue
          {printQueueSize > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-mtg-red px-1.5 py-0.5 text-[10px] font-bold text-ink-900">
              {printQueueSize}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-md border border-ink-300 bg-white px-2 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
          aria-label="Settings"
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}

function Logo(): JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="2" width="26" height="28" rx="3" fill="#16140f" />
      <rect x="5" y="4" width="22" height="24" rx="2" fill="#e3c87a" />
      <rect x="7" y="6" width="18" height="10" rx="1" fill="#1a2638" />
      <rect x="7" y="18" width="18" height="8" rx="1" fill="#f3f1ea" />
      <circle cx="22" cy="11" r="1.8" fill="#aae0fa" stroke="#16140f" strokeWidth="0.4" />
    </svg>
  );
}
