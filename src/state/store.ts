import { create } from "zustand";
import type { Card, CardLayout, Collection, Settings } from "@/types/card";
import { db, ensureDefaults, SCHEMA_VERSION } from "./db";
import { createCard } from "./factories";

interface StoreState {
  initialized: boolean;
  collections: Collection[];
  cards: Card[];
  activeCollectionId: string | null;
  activeCardId: string | null;
  settings: Settings;
  /** Cards selected for printing, and how many copies of each. */
  printQueue: Record<string, number>;

  init: () => Promise<void>;
  setActiveCollection: (id: string) => void;
  setActiveCard: (id: string | null) => void;

  createCollection: (name: string, setCode?: string) => Promise<Collection>;
  renameCollection: (id: string, name: string) => Promise<void>;
  setCollectionSetCode: (id: string, setCode: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  reorderCards: (collectionId: string, cardIds: string[]) => Promise<void>;

  newCard: (layout: CardLayout, collectionId?: string) => Promise<Card>;
  duplicateCard: (id: string) => Promise<Card>;
  updateCard: (id: string, patch: Partial<Card>) => Promise<void>;
  changeCardLayout: (id: string, layout: CardLayout) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;

  setPrintQueueCount: (cardId: string, copies: number) => void;
  clearPrintQueue: () => void;

  updateSettings: (patch: Partial<Settings>) => Promise<void>;

  /** Force-flush — currently a no-op since every write is awaited, but keeps a hook for future batching. */
  flush: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  id: "global",
  defaultPaperSize: "A4",
  defaultCropMarks: true,
  showSafeZoneGuide: false,
  schemaVersion: SCHEMA_VERSION,
};

export const useStore = create<StoreState>((set, get) => ({
  initialized: false,
  collections: [],
  cards: [],
  activeCollectionId: null,
  activeCardId: null,
  settings: DEFAULT_SETTINGS,
  printQueue: {},

  init: async () => {
    if (get().initialized) return;
    try {
      const { defaultCollectionId } = await ensureDefaults();
      const [collections, cards, settings] = await Promise.all([
        db.collections.orderBy("createdAt").toArray(),
        db.cards.orderBy("updatedAt").reverse().toArray(),
        db.settings.get("global"),
      ]);
      set({
        collections,
        cards,
        settings: settings ?? DEFAULT_SETTINGS,
        activeCollectionId: defaultCollectionId,
        activeCardId: null,
        initialized: true,
      });
    } catch (err) {
      console.error("Flexicards: failed to open IndexedDB", err);
      // Attempt one-shot recovery: delete the database and retry. Only useful
      // when the schema upgrade fails on a stale dev-time DB.
      try {
        await db.delete();
        await db.open();
        const { defaultCollectionId } = await ensureDefaults();
        const [collections, cards, settings] = await Promise.all([
          db.collections.orderBy("createdAt").toArray(),
          db.cards.orderBy("updatedAt").reverse().toArray(),
          db.settings.get("global"),
        ]);
        set({
          collections,
          cards,
          settings: settings ?? DEFAULT_SETTINGS,
          activeCollectionId: defaultCollectionId,
          activeCardId: null,
          initialized: true,
        });
      } catch (err2) {
        console.error("Flexicards: DB recovery also failed", err2);
        throw err2;
      }
    }
  },

  setActiveCollection: (id) => set({ activeCollectionId: id, activeCardId: null }),
  setActiveCard: (id) => set({ activeCardId: id }),

  createCollection: async (name, setCode) => {
    const now = Date.now();
    const col: Collection = {
      id: crypto.randomUUID(),
      name,
      setCode: setCode ?? "FLX",
      cards: [],
      createdAt: now,
      updatedAt: now,
    };
    await db.collections.put(col);
    set((s) => ({
      collections: [...s.collections, col],
      activeCollectionId: col.id,
      activeCardId: null,
    }));
    return col;
  },

  renameCollection: async (id, name) => {
    const now = Date.now();
    await db.collections.update(id, { name, updatedAt: now });
    set((s) => ({
      collections: s.collections.map((c) => (c.id === id ? { ...c, name, updatedAt: now } : c)),
    }));
  },

  setCollectionSetCode: async (id, setCode) => {
    const now = Date.now();
    await db.collections.update(id, { setCode, updatedAt: now });
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id === id ? { ...c, setCode, updatedAt: now } : c
      ),
      cards: s.cards.map((card) =>
        card.collectionId === id ? { ...card, setCode } : card
      ),
    }));
  },

  deleteCollection: async (id) => {
    const cardsInCollection = await db.cards.where("collectionId").equals(id).primaryKeys();
    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.bulkDelete(cardsInCollection);
      await db.collections.delete(id);
    });
    set((s) => {
      const remaining = s.collections.filter((c) => c.id !== id);
      return {
        collections: remaining,
        cards: s.cards.filter((c) => c.collectionId !== id),
        activeCollectionId: remaining[0]?.id ?? null,
        activeCardId: null,
      };
    });
  },

  reorderCards: async (collectionId, cardIds) => {
    const now = Date.now();
    await db.collections.update(collectionId, { cards: cardIds, updatedAt: now });
    set((s) => ({
      collections: s.collections.map((c) =>
        c.id === collectionId ? { ...c, cards: cardIds, updatedAt: now } : c
      ),
    }));
  },

  newCard: async (layout, collectionId) => {
    const targetCollection = collectionId ?? get().activeCollectionId;
    if (!targetCollection) throw new Error("No active collection to add card to");
    const card = createCard(layout, { collectionId: targetCollection });
    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.put(card);
      const col = await db.collections.get(targetCollection);
      if (col) {
        await db.collections.update(targetCollection, {
          cards: [...col.cards, card.id],
          updatedAt: Date.now(),
        });
      }
    });
    set((s) => ({
      cards: [card, ...s.cards],
      collections: s.collections.map((c) =>
        c.id === targetCollection ? { ...c, cards: [...c.cards, card.id] } : c
      ),
      activeCardId: card.id,
    }));
    return card;
  },

  duplicateCard: async (id) => {
    const original = get().cards.find((c) => c.id === id);
    if (!original) throw new Error(`Card ${id} not found`);
    const now = Date.now();
    const copy: Card = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.put(copy);
      const col = await db.collections.get(copy.collectionId);
      if (col) {
        const idx = col.cards.indexOf(id);
        const newOrder = [...col.cards];
        newOrder.splice(idx === -1 ? newOrder.length : idx + 1, 0, copy.id);
        await db.collections.update(copy.collectionId, { cards: newOrder, updatedAt: now });
      }
    });
    set((s) => ({
      cards: [copy, ...s.cards],
      collections: s.collections.map((c) => {
        if (c.id !== copy.collectionId) return c;
        const idx = c.cards.indexOf(id);
        const newOrder = [...c.cards];
        newOrder.splice(idx === -1 ? newOrder.length : idx + 1, 0, copy.id);
        return { ...c, cards: newOrder, updatedAt: now };
      }),
      activeCardId: copy.id,
    }));
    return copy;
  },

  updateCard: async (id, patch) => {
    const now = Date.now();
    const current = get().cards.find((c) => c.id === id);
    if (!current) return;
    const next = { ...current, ...patch, id, updatedAt: now } as Card;
    await db.cards.put(next);
    set((s) => ({ cards: s.cards.map((c) => (c.id === id ? next : c)) }));
  },

  changeCardLayout: async (id, layout) => {
    const current = get().cards.find((c) => c.id === id);
    if (!current) return;
    // Preserve common fields, regenerate layout-specific defaults.
    const fresh = createCard(layout, { id: current.id, collectionId: current.collectionId });
    const merged: Card = {
      ...fresh,
      // Copy common card fields from the existing card so user-entered values survive
      name: current.name,
      manaCost: current.manaCost,
      typeLine: fresh.typeLine || current.typeLine,
      rarity: current.rarity,
      artist: current.artist,
      setCode: current.setCode,
      collectorNumber: current.collectorNumber,
      borderColor: current.borderColor,
      artImage: current.artImage,
      rulesText: current.rulesText,
      flavorText: current.flavorText,
      setSymbol: current.setSymbol,
      createdAt: current.createdAt,
      updatedAt: Date.now(),
    } as Card;
    await db.cards.put(merged);
    set((s) => ({ cards: s.cards.map((c) => (c.id === id ? merged : c)) }));
  },

  deleteCard: async (id) => {
    const card = get().cards.find((c) => c.id === id);
    if (!card) return;
    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.delete(id);
      const col = await db.collections.get(card.collectionId);
      if (col) {
        await db.collections.update(card.collectionId, {
          cards: col.cards.filter((cid) => cid !== id),
          updatedAt: Date.now(),
        });
      }
    });
    set((s) => ({
      cards: s.cards.filter((c) => c.id !== id),
      collections: s.collections.map((c) =>
        c.id === card.collectionId
          ? { ...c, cards: c.cards.filter((cid) => cid !== id) }
          : c
      ),
      activeCardId: s.activeCardId === id ? null : s.activeCardId,
      printQueue: Object.fromEntries(
        Object.entries(s.printQueue).filter(([cid]) => cid !== id)
      ),
    }));
  },

  setPrintQueueCount: (cardId, copies) =>
    set((s) => {
      const next = { ...s.printQueue };
      if (copies <= 0) delete next[cardId];
      else next[cardId] = copies;
      return { printQueue: next };
    }),
  clearPrintQueue: () => set({ printQueue: {} }),

  updateSettings: async (patch) => {
    const next = { ...get().settings, ...patch, id: "global" as const };
    await db.settings.put(next);
    set({ settings: next });
  },

  flush: async () => {
    // Reserved for future batched writes.
  },
}));

/** Helpers consumed by components. */
export function useActiveCard(): Card | null {
  return useStore((s) => s.cards.find((c) => c.id === s.activeCardId) ?? null);
}

export function useActiveCollection(): Collection | null {
  return useStore((s) => s.collections.find((c) => c.id === s.activeCollectionId) ?? null);
}

export function useCardsInActiveCollection(): Card[] {
  return useStore((s) => {
    const col = s.collections.find((c) => c.id === s.activeCollectionId);
    if (!col) return [];
    const byId = new Map(s.cards.map((c) => [c.id, c]));
    return col.cards
      .map((id) => byId.get(id))
      .filter((c): c is Card => Boolean(c));
  });
}
