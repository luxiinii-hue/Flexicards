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
import { Chip, CornerRivets, Gear } from "./workshop/Gear";
import { Onboarding } from "./onboarding/Onboarding";

export function Editor(): JSX.Element {
  const init = useStore((s) => s.init);
  const initialized = useStore((s) => s.initialized);
  const cardCount = useStore((s) => s.cards.length);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [scryfallOpen, setScryfallOpen] = useState(false);
  const [printQueueOpen, setPrintQueueOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  useKeyboardShortcuts({
    onNew: () => setLayoutPickerOpen(true),
    onPrintQueue: () => setPrintQueueOpen(true),
  });

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center font-fell text-ink-100">
        <div className="text-lg tracking-widest">Stoking the forge…</div>
      </div>
    );
  }

  /**
   * First-launch onboarding: shown only when there are no cards yet and the
   * user hasn't dismissed it this session. After it completes (skip or
   * forge), regular editor takes over.
   */
  const showOnboarding = cardCount === 0 && !onboardingDismissed;
  if (showOnboarding) {
    return (
      <div className="flex h-screen min-h-0 flex-col">
        <OnboardingHeader onOpenSettings={() => setSettingsOpen(true)} />
        <Onboarding onComplete={() => setOnboardingDismissed(true)} />
        {settingsOpen ? <SettingsDialog onClose={() => setSettingsOpen(false)} /> : null}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-0 flex-col">
      <Header
        onOpenLayoutPicker={() => setLayoutPickerOpen(true)}
        onOpenScryfall={() => setScryfallOpen(true)}
        onOpenPrintQueue={() => setPrintQueueOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="flex min-h-0 flex-1 flex-row gap-px bg-ink-900">
        <CardListPanel
          onOpenLayoutPicker={() => setLayoutPickerOpen(true)}
          onOpenScryfall={() => setScryfallOpen(true)}
        />
        <PreviewPanel />
        <FormPanel />
      </main>
      <StatusBar />
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
    <header className="ws-brass relative flex h-14 flex-shrink-0 items-center gap-4 px-5">
      <CornerRivets />

      <div className="flex items-center gap-3">
        <Gear size={32} color="#3a2811" opacity={0.9} spin={8} />
        <div className="leading-tight">
          <div className="font-title ws-engraved" style={{ fontSize: 18, letterSpacing: "0.3em" }}>
            FLEXICARDS
          </div>
          <div className="font-fellEng italic ws-etched" style={{ fontSize: 11, letterSpacing: "0.04em", marginTop: 2 }}>
            Cartographers&apos; Workshop &amp; Reagent Press
          </div>
        </div>
      </div>

      <div className="h-7 w-px bg-brass-700" />
      <span className="font-mono ws-etched hidden md:inline" style={{ fontSize: 10, letterSpacing: "0.18em" }}>
        CUSTOM PROXY GENERATOR
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button type="button" onClick={onOpenLayoutPicker} className="ws-btn ws-btn-secondary" title="New card (Ctrl+N)">
          <span style={{ width: 8, height: 8, borderRadius: 1, background: "#ff7a3a", boxShadow: "0 0 8px #ff7a3a", display: "inline-block" }} />
          New Card
        </button>
        <button type="button" onClick={onOpenScryfall} className="ws-btn ws-btn-secondary">
          Scryfall Intake
        </button>
        <button type="button" onClick={onOpenPrintQueue} className="ws-btn ws-btn-secondary relative" title="Print queue (Ctrl+P)">
          Press Queue
          {printQueueSize > 0 ? (
            <span
              className="absolute -right-1.5 -top-1.5 rounded-full px-1.5 py-0.5"
              style={{
                background: "#ff7a3a",
                color: "#1a1208",
                border: "1px solid #2a1c0c",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              {printQueueSize}
            </span>
          ) : null}
        </button>
        <button type="button" onClick={onOpenSettings} className="ws-btn ws-btn-secondary" aria-label="Settings" title="Settings">
          ⚙
        </button>
      </div>
    </header>
  );
}

/**
 * Compact header used during onboarding — just the branding, no action
 * buttons that would only confuse a first-launch user.
 */
function OnboardingHeader({ onOpenSettings }: { onOpenSettings: () => void }): JSX.Element {
  return (
    <header className="ws-brass relative flex h-14 flex-shrink-0 items-center gap-4 px-5">
      <CornerRivets />
      <div className="flex items-center gap-3">
        <Gear size={32} color="#3a2811" opacity={0.9} spin={8} />
        <div className="leading-tight">
          <div className="font-title ws-engraved" style={{ fontSize: 18, letterSpacing: "0.3em" }}>
            FLEXICARDS
          </div>
          <div className="font-fellEng italic ws-etched" style={{ fontSize: 11, letterSpacing: "0.04em", marginTop: 2 }}>
            Cartographers&apos; Workshop &amp; Reagent Press
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <button type="button" onClick={onOpenSettings} className="ws-btn ws-btn-secondary" title="Settings">
        ⚙
      </button>
    </header>
  );
}

function StatusBar(): JSX.Element {
  const cardCount = useStore((s) => s.cards.length);
  const collectionCount = useStore((s) => s.collections.length);
  return (
    <footer
      className="flex flex-shrink-0 items-center gap-4 border-t border-brass-700 bg-walnut-dim px-4 py-1"
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "0.18em", color: "#7a6a4d", textTransform: "uppercase" }}
    >
      <span style={{ color: "#5cae9b" }}>● Workshop online</span>
      <span style={{ color: "#3a2811" }}>·</span>
      <span>{cardCount} specimen{cardCount === 1 ? "" : "s"}</span>
      <span style={{ color: "#3a2811" }}>·</span>
      <span>{collectionCount} cabinet{collectionCount === 1 ? "" : "s"}</span>
      <div className="flex-1" />
      <Chip glow="#d9b266">Auto-Save · IndexedDB</Chip>
      <span style={{ color: "#ff7a3a" }}>v 0.2 · cog #4a2f12</span>
    </footer>
  );
}



