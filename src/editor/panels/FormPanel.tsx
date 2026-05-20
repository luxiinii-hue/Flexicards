import { useStore, useActiveCard } from "@/state/store";
import { ALL_LAYOUTS, LAYOUT_LABELS, type Card, type CardLayout } from "@/types/card";
import { CardForm } from "../forms/CardForm";

export function FormPanel(): JSX.Element {
  const card = useActiveCard();
  const changeCardLayout = useStore((s) => s.changeCardLayout);

  if (!card) {
    return (
      <aside className="flex w-96 flex-shrink-0 flex-col border-l border-ink-200 bg-ink-50">
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-ink-500">
          Select a card to edit, or create a new one.
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-96 flex-shrink-0 flex-col border-l border-ink-200 bg-ink-50">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-ink-200 bg-ink-100 px-4 py-2 text-xs">
        <div>
          <div className="font-semibold text-ink-700">{card.name || "Untitled"}</div>
          <div className="text-[10px] uppercase tracking-wide text-ink-500">{LAYOUT_LABELS[card.layout]}</div>
        </div>
        <LayoutSwitcher
          value={card.layout}
          onChange={async (next) => {
            if (next === card.layout) return;
            if (window.confirm(`Change layout to ${LAYOUT_LABELS[next]}? Layout-specific fields will reset.`)) {
              await changeCardLayout(card.id, next);
            }
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <CardForm card={card} />
      </div>
    </aside>
  );
}

interface SwitchProps {
  value: CardLayout;
  onChange: (next: CardLayout) => void;
}

function LayoutSwitcher({ value, onChange }: SwitchProps): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CardLayout)}
      className="rounded border border-ink-300 bg-white px-2 py-1 text-xs"
    >
      {ALL_LAYOUTS.map((l) => (
        <option key={l} value={l}>
          {LAYOUT_LABELS[l]}
        </option>
      ))}
    </select>
  );
}

export type FormCard = Card;
