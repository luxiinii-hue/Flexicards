import { useState } from "react";
import { useStore, useActiveCollection, useCardsInActiveCollection } from "@/state/store";
import { LAYOUT_LABELS } from "@/types/card";

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
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-ink-200 bg-ink-100">
      {/* Collection selector */}
      <div className="border-b border-ink-200 p-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-500">Collection</label>
        <div className="mt-1 flex gap-1">
          <select
            value={activeCollection?.id ?? ""}
            onChange={(e) => setActiveCollection(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-md border border-ink-300 bg-white px-2 text-sm hover:bg-ink-50"
            onClick={async () => {
              const name = window.prompt("New collection name?")?.trim();
              if (name) await createCollection(name);
            }}
            title="New collection"
          >
            +
          </button>
        </div>

        {activeCollection ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-600">
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
                className="min-w-0 flex-1 rounded border border-ink-300 px-1 py-0.5 text-xs"
              />
            ) : (
              <button
                type="button"
                className="flex-1 truncate text-left hover:underline"
                onClick={() => {
                  setRenameVal(activeCollection.name);
                  setRenaming(true);
                }}
              >
                Rename
              </button>
            )}
            <span className="text-ink-400">·</span>
            <label className="flex items-center gap-1">
              <span>Set:</span>
              <input
                value={activeCollection.setCode}
                onChange={(e) => void setCollectionSetCode(activeCollection.id, e.target.value.toUpperCase().slice(0, 4))}
                className="w-12 rounded border border-ink-300 px-1 py-0.5 text-center text-xs"
              />
            </label>
            <span className="text-ink-400">·</span>
            <button
              type="button"
              className="text-red-700 hover:underline"
              onClick={async () => {
                if (collections.length <= 1) {
                  alert("Cannot delete the only collection.");
                  return;
                }
                if (window.confirm(`Delete "${activeCollection.name}" and all its cards? This cannot be undone.`)) {
                  await deleteCollection(activeCollection.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto p-2">
        {cards.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-300 p-4 text-center text-xs text-ink-500">
            No cards yet. Click <strong>+ Card</strong> below or import from Scryfall.
          </div>
        ) : (
          <ul className="space-y-1">
            {cards.map((c) => {
              const isActive = c.id === activeCardId;
              const queued = printQueue[c.id] ?? 0;
              return (
                <li key={c.id}>
                  <div
                    className={`group flex items-center gap-2 rounded-md px-2 py-1.5 ${
                      isActive ? "bg-ink-900 text-ink-50" : "hover:bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCard(c.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className={`truncate text-sm font-medium ${isActive ? "text-ink-50" : "text-ink-900"}`}>
                        {c.name || "Untitled"}
                      </div>
                      <div className={`truncate text-[10px] uppercase tracking-wide ${isActive ? "text-ink-300" : "text-ink-500"}`}>
                        {LAYOUT_LABELS[c.layout]}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        title="Add to print queue"
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          queued > 0
                            ? "bg-mtg-red text-ink-900"
                            : isActive
                            ? "bg-ink-700 text-ink-50"
                            : "bg-ink-200 text-ink-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrintQueueCount(c.id, (queued || 0) + 1);
                        }}
                      >
                        +{queued > 0 ? `${queued}` : "P"}
                      </button>
                      <button
                        type="button"
                        title="Delete card"
                        className={`rounded px-1 py-0.5 text-[10px] ${
                          isActive ? "text-ink-300 hover:text-red-300" : "text-ink-400 hover:text-red-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${c.name || "Untitled"}"?`)) void deleteCard(c.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Bottom actions */}
      <div className="border-t border-ink-200 p-2 space-y-1">
        <button
          type="button"
          onClick={onOpenLayoutPicker}
          className="w-full rounded-md bg-ink-900 px-3 py-2 text-xs font-semibold text-ink-50 hover:bg-ink-700"
        >
          + New Card
        </button>
        <button
          type="button"
          onClick={onOpenScryfall}
          className="w-full rounded-md border border-ink-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
        >
          Import from Scryfall
        </button>
      </div>
    </aside>
  );
}
