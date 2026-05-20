import Dexie, { type Table } from "dexie";
import type { Card, Collection, Settings } from "@/types/card";

/**
 * Stored blob entry. We keep blobs separately from cards so the card row stays
 * small and JSON-export only needs to inline the blobs that are actually used.
 */
export interface BlobEntry {
  id: string;
  blob: Blob;
  createdAt: number;
  /** Cards/collections that reference this blob. Used to garbage-collect. */
  refCount: number;
}

export interface ScryfallCacheEntry {
  url: string;
  body: string; // serialized JSON
  fetchedAt: number;
  expiresAt: number;
}

class FlexicardsDB extends Dexie {
  cards!: Table<Card, string>;
  collections!: Table<Collection, string>;
  blobs!: Table<BlobEntry, string>;
  scryfallCache!: Table<ScryfallCacheEntry, string>;
  settings!: Table<Settings, "global">;

  constructor() {
    super("flexicards");

    this.version(1).stores({
      cards: "id, collectionId, layout, name, updatedAt",
      collections: "id, name, updatedAt",
      blobs: "id, createdAt",
      scryfallCache: "url, fetchedAt, expiresAt",
      settings: "id",
    });
  }
}

export const db = new FlexicardsDB();

export const SCHEMA_VERSION = 1;

/** Ensure default settings + a default collection exist. Called once on app start. */
export async function ensureDefaults(): Promise<{ defaultCollectionId: string }> {
  const settings = await db.settings.get("global");
  if (!settings) {
    await db.settings.put({
      id: "global",
      defaultPaperSize: "A4",
      defaultCropMarks: true,
      showSafeZoneGuide: false,
      schemaVersion: SCHEMA_VERSION,
    });
  }

  const existingCollections = await db.collections.count();
  if (existingCollections === 0) {
    const id = crypto.randomUUID();
    const now = Date.now();
    await db.collections.put({
      id,
      name: "My First Set",
      setCode: "FLX",
      cards: [],
      createdAt: now,
      updatedAt: now,
    });
    return { defaultCollectionId: id };
  }

  const first = await db.collections.orderBy("updatedAt").last();
  return { defaultCollectionId: first?.id ?? crypto.randomUUID() };
}
