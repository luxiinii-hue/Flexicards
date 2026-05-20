import { useState } from "react";
import { useStore, useActiveCollection, useCardsInActiveCollection } from "@/state/store";
import { LAYOUT_LABELS, type Card } from "@/types/card";
import { resolveFrameColor } from "@/cards/frameColor";
import { FRAME_COLOR_STOPS } from "@/cards/tokens";
import { CornerRivets, Nameplate, Chip } from "../workshop/Gear";

interface Props {
  onOpenLayoutPicker: () => void;
  onOpenScryfall: () => void;
}

export function CardListPanel({ onOpenLayoutPicker, onOpenScryfall }: Props): JSX.Element {
  const collections = useStore((s) => s.collections);
  const activeCollection = useActiveCollection();
  const cards = useCardsInActiveCollection();
  const activeCardId = useStore((s) => s.activeCardId);
  const setActiveCard = useStore((s) => s.setActiveCard);
  const setActiveCollection = useStore((s) => s.setActiveCollection);
  const createCollection = useStore((s) => s.createCollection);
  const renameCollection = useStore((s) => s.renameCollection);
  const deleteCollection = useStore((s) => s.deleteCollection);
  const setCollectionSetCode = useStore((s) => s.setCollectionSetCode);
  const deleteCard = useStore((s) => s.deleteCard);
  const setPrintQueueCount = useStore((s) => s.setPrintQueueCount);
  const printQueue = useStore((s) => s.printQueue);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState("");

  return (
    <aside className="ws-panel relative flex w-72 flex-shrink-0 flex-col">
      <CornerRivets />

      <div className="px-4 pb-3 pt-4">
        <Nameplate right={activeCollection ? <Chip glow="#d9b266">SET · {activeCollection.setCode}</Chip> : null}>
          Specimen Cabinet
        </Nameplate>

        <div className="mt-3 flex gap-2">
          <select
            value={activeCollection?.id ?? ""}
            onChange={(e) => setActiveCollection(e.target.value)}
            className="ws-input min-w-0 flex-1 font-fell"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id} style={{ background: "#1a1208" }}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ws-btn ws-btn-primary px-2"
            onClick={async () => {
              const name = window.prompt("New cabinet name?")?.trim();
              if (name) await createCollection(name);
            }}
            title="New collection"
          >
            +
          </button>
        </div>

        {activeCollection ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9.5px] uppercase tracking-widest text-ink-200">
            {renaming ? (
              <input
                autoFocus
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={async () => {
                  if (renameVal.trim()) await renameCollection(activeCollection.id, renameVal.trim());
                  setRenaming(false);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    if (renameVal.trim()) await renameCollection(activeCollection.id, renameVal.trim());
                    setRenaming(false);
                  } else if (e.key === "Escape") {
                    setRenaming(false);
                  }
                }}
                className="ws-input flex-1 py-0.5 text-xs"
              />
            ) : (
              <button
                type="button"
                className="hover:text-brass-200"
                onClick={() => {
                  setRenameVal(activeCollection.name);
                  setRenaming(true);
                }}
              >
                Rename
              </button>
            )}
            <span className="text-brass-700">·</span>
            <label className="flex items-center gap-1">
              <span>Set</span>
              <input
                value={activeCollection.setCode}
                onChange={(e) => void setCollectionSetCode(activeCollection.id, e.target.value.toUpperCase().slice(0, 4))}
                className="ws-input w-12 px-1 py-0.5 text-center text-[10px]"
              />
            </label>
            <span className="text-brass-700">·</span>
            <button
              type="button"
              className="text-ember-500 hover:text-ember-400"
              onClick={async () => {
                if (collections.length <= 1) {
                  alert("Cannot decant the only cabinet.");
                  return;
                }
                if (window.confirm(`Decant "${activeCollection.name}" and all its specimens?`)) {
                  await deleteCollection(activeCollection.id);
                }
              }}
            >
              Decant
            </button>
          </div>
        ) : null}
      </div>

      <div className="ws-rivet-divider">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink-200">
          Specimens · {cards.length}
        </span>
        <span className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="ws-rivet" />
          ))}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {cards.length === 0 ? (
          <div
            className="m-2 rounded p-4 text-center font-fell text-xs text-ink-200"
            style={{ border: "1px dashed #3a2811", background: "rgba(217,178,102,0.04)" }}
          >
            No specimens yet. Forge one below or import from Scryfall.
          </div>
        ) : (
          <ul className="space-y-1">
            {cards.map((c) => {
              const isActive = c.id === activeCardId;
              const queued = printQueue[c.id] ?? 0;
              const swatch = swatchFor(c);
              return (
                <li key={c.id}>
                  <div
                    className={`ws-specimen group ${isActive ? "is-active" : ""}`}
                    onClick={() => setActiveCard(c.id)}
                  >
                    <div className="ws-specimen-swatch" style={{ background: swatch, color: swatch }} />
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate font-title font-semibold"
                        style={{ fontSize: 13, color: "#f0e0bf", letterSpacing: "0.03em" }}
                      >
                        {c.name || "Untitled"}
                      </div>
                      <div className="truncate font-mono text-[9px] uppercase tracking-widest text-ink-200" style={{ marginTop: 2 }}>
                        {LAYOUT_LABELS[c.layout]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[9.5px] tracking-wider text-brass-300">{c.manaCost || "—"}</div>
                      <div className="mt-1 flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          title="Add to press queue"
                          className="rounded px-1.5 py-0.5 font-mono text-[9px] tracking-widest"
                          style={{
                            background: queued > 0 ? "#ff7a3a" : "#1a1208",
                            color: queued > 0 ? "#1a1208" : "#d9b266",
                            border: "1px solid #2a1c0c",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrintQueueCount(c.id, (queued || 0) + 1);
                          }}
                        >
                          {queued > 0 ? `×${queued}` : "+P"}
                        </button>
                        <button
                          type="button"
                          title="Delete specimen"
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] text-ember-500 hover:text-ember-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${c.name || "Untitled"}"?`)) void deleteCard(c.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-brass-700 bg-walnut-dim p-3" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button type="button" onClick={onOpenLayoutPicker} className="ws-btn ws-btn-primary">
          + New Card
        </button>
        <button type="button" onClick={onOpenScryfall} className="ws-btn ws-btn-secondary">
          Scryfall Intake
        </button>
      </div>
    </aside>
  );
}

function swatchFor(card: Card): string {
  const color = resolveFrameColor(card);
  return FRAME_COLOR_STOPS[color].plate;
}
