/**
 * Collection export/import to/from a JSON file. Includes embedded image data
 * (base64) so the file is fully self-contained.
 */
import { db } from "@/state/db";
import { blobDataUrl, putBlob } from "@/state/blobStore";
import type { Card, Collection } from "@/types/card";

interface ExportShape {
  flexicardsVersion: 1;
  exportedAt: number;
  collection: Collection;
  cards: Card[];
  blobs: Record<string, string>; // blobId -> data URL
}

export async function exportCollectionAsJson(collectionId: string): Promise<void> {
  const collection = await db.collections.get(collectionId);
  if (!collection) throw new Error("Collection not found");
  const cards = await db.cards.where("collectionId").equals(collectionId).toArray();
  const blobIds = new Set<string>();
  for (const c of cards) {
    if (c.artImage?.blobId) blobIds.add(c.artImage.blobId);
  }
  const blobs: Record<string, string> = {};
  for (const id of blobIds) {
    const data = await blobDataUrl(id);
    if (data) blobs[id] = data;
  }
  const payload: ExportShape = {
    flexicardsVersion: 1,
    exportedAt: Date.now(),
    collection,
    cards,
    blobs,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${collection.name.replace(/[^a-z0-9-_]+/gi, "-")}-flexicards.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importCollectionFromJson(jsonText: string): Promise<{ collectionId: string }> {
  const data = JSON.parse(jsonText) as ExportShape;
  if (data.flexicardsVersion !== 1) {
    throw new Error(`Unsupported export version: ${data.flexicardsVersion}`);
  }
  // Create blob ID remapping
  const blobIdMap = new Map<string, string>();
  for (const [oldId, dataUrl] of Object.entries(data.blobs ?? {})) {
    const blob = await dataUrlToBlob(dataUrl);
    const newId = await putBlob(blob);
    blobIdMap.set(oldId, newId);
  }

  // Re-id collection + cards to avoid collision
  const newCollectionId = crypto.randomUUID();
  const cardIdMap = new Map<string, string>();
  for (const c of data.cards) {
    cardIdMap.set(c.id, crypto.randomUUID());
  }

  const newCollection: Collection = {
    ...data.collection,
    id: newCollectionId,
    cards: data.collection.cards.map((id) => cardIdMap.get(id) ?? id),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const newCards: Card[] = data.cards.map((c) => ({
    ...c,
    id: cardIdMap.get(c.id) ?? crypto.randomUUID(),
    collectionId: newCollectionId,
    artImage: c.artImage
      ? { ...c.artImage, blobId: blobIdMap.get(c.artImage.blobId) ?? c.artImage.blobId }
      : c.artImage,
  })) as Card[];

  await db.transaction("rw", db.collections, db.cards, async () => {
    await db.collections.put(newCollection);
    await db.cards.bulkPut(newCards);
  });

  return { collectionId: newCollectionId };
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}
