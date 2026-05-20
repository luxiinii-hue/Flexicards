import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { fetchCardByName, searchCardAutocomplete } from "@/services/scryfall";
import { scryfallToCard } from "@/services/scryfallMap";
import type { ScryfallCard } from "@/types/scryfall";
import { useStore } from "@/state/store";
import { db } from "@/state/db";
import { pushToast } from "../toastBus";

interface Props {
  onClose: () => void;
}

export function ScryfallDialog({ onClose }: Props): JSX.Element {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ScryfallCard | null>(null);
  const activeCollectionId = useStore((s) => s.activeCollectionId);
  const setActiveCard = useStore((s) => s.setActiveCard);

  useEffect(() => {
    const ctrl = new AbortController();
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    (async () => {
      try {
        const list = await searchCardAutocomplete(query.trim(), ctrl.signal);
        setSuggestions(list.slice(0, 12));
      } catch {
        // ignore
      }
    })();
    return () => ctrl.abort();
  }, [query]);

  async function loadCard(name: string) {
    setBusy(true);
    try {
      const card = await fetchCardByName(name);
      setPreview(card);
      setQuery(card.name);
    } catch (err) {
      pushToast(`Scryfall: ${(err as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  async function importPreview() {
    if (!preview || !activeCollectionId) return;
    const card = scryfallToCard(preview, { collectionId: activeCollectionId });
    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.put(card);
      const col = await db.collections.get(activeCollectionId);
      if (col) {
        await db.collections.update(activeCollectionId, {
          cards: [...col.cards, card.id],
          updatedAt: Date.now(),
        });
      }
    });
    // Refresh from DB into the store
    const [cards, collections] = await Promise.all([
      db.cards.orderBy("updatedAt").reverse().toArray(),
      db.collections.orderBy("createdAt").toArray(),
    ]);
    useStore.setState({ cards, collections });
    setActiveCard(card.id);
    pushToast(`Imported "${card.name}" as starting point`, "success");
    onClose();
  }

  return (
    <Modal title="Import from Scryfall" onClose={onClose} size="max-w-2xl">
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-500">
            Card name (live search)
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) void loadCard(query.trim());
            }}
            placeholder="Lightning Bolt"
            className="mt-1 w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm focus:border-ink-500 focus:outline-none"
            autoFocus
          />
        </div>

        {suggestions.length > 0 && !preview ? (
          <div className="rounded-md border border-ink-200 bg-white">
            <ul className="max-h-48 overflow-y-auto py-1">
              {suggestions.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => loadCard(name)}
                    className="w-full px-3 py-1 text-left text-sm hover:bg-ink-100"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {busy ? <div className="text-xs text-ink-500">Fetching…</div> : null}

        {preview ? (
          <div className="rounded-md border border-ink-200 bg-white p-3">
            <div className="flex gap-3">
              {preview.image_uris?.normal ? (
                <img
                  src={preview.image_uris.normal}
                  alt={preview.name}
                  className="h-44 w-32 flex-shrink-0 rounded-md object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-base font-semibold text-ink-900">{preview.name}</div>
                <div className="font-mono text-xs text-ink-600">{preview.mana_cost}</div>
                <div className="text-xs text-ink-600">{preview.type_line}</div>
                <div className="whitespace-pre-line text-xs text-ink-700">{preview.oracle_text}</div>
                <div className="pt-1 text-[10px] text-ink-400">
                  {preview.set_name} · {preview.collector_number} · layout: {preview.layout}
                </div>
                {preview.image_uris?.art_crop ? (
                  <p className="text-[10px] text-ink-500">
                    Only the text fields will populate. Art is not imported — supply your own image.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setQuery("");
                }}
                className="rounded-md border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={importPreview}
                className="rounded-md bg-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-50 hover:bg-ink-700"
              >
                Use as starting point
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
