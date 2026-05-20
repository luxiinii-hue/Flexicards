import { db } from "./db";

const objectUrlCache = new Map<string, string>();

export async function putBlob(blob: Blob): Promise<string> {
  const id = crypto.randomUUID();
  await db.blobs.put({
    id,
    blob,
    createdAt: Date.now(),
    refCount: 1,
  });
  return id;
}

export async function getBlob(id: string): Promise<Blob | null> {
  const entry = await db.blobs.get(id);
  return entry?.blob ?? null;
}

/**
 * Resolves a blob ID to a persistent object URL for the current session.
 * The same URL is returned for repeated requests on the same blob.
 */
export async function blobObjectUrl(id: string): Promise<string | null> {
  const cached = objectUrlCache.get(id);
  if (cached) return cached;
  const blob = await getBlob(id);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  objectUrlCache.set(id, url);
  return url;
}

/**
 * Converts an object URL into a data: URL — required for SVG → PDF export
 * because PDF embedders can't dereference blob:/ URLs.
 */
export async function blobDataUrl(id: string): Promise<string | null> {
  const blob = await getBlob(id);
  if (!blob) return null;
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function deleteBlob(id: string): Promise<void> {
  const cached = objectUrlCache.get(id);
  if (cached) {
    URL.revokeObjectURL(cached);
    objectUrlCache.delete(id);
  }
  await db.blobs.delete(id);
}

export function revokeAllObjectUrls(): void {
  for (const url of objectUrlCache.values()) URL.revokeObjectURL(url);
  objectUrlCache.clear();
}
