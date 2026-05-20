/**
 * Lightweight Scryfall fetcher for the onboarding screen. Unlike the main
 * scryfall.ts client, this one does NOT serialize through the 600ms queue —
 * it fires all type lookups in parallel so the first-launch screen feels
 * snappy. Results are cached in IndexedDB so subsequent loads are instant.
 */
import { db } from "@/state/db";
import type { ScryfallCard } from "@/types/scryfall";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function fetchRandomByQuery(query: string, signal?: AbortSignal): Promise<ScryfallCard | null> {
  const url = `https://api.scryfall.com/cards/random?q=${encodeURIComponent(query)}`;
  const cached = await readCache(url);
  if (cached) return cached;
  try {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const body = await res.text();
    await writeCache(url, body);
    return JSON.parse(body) as ScryfallCard;
  } catch {
    return null;
  }
}

async function readCache(url: string): Promise<ScryfallCard | null> {
  const entry = await db.scryfallCache.get(url);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    await db.scryfallCache.delete(url);
    return null;
  }
  return JSON.parse(entry.body) as ScryfallCard;
}

async function writeCache(url: string, body: string): Promise<void> {
  const now = Date.now();
  await db.scryfallCache.put({ url, body, fetchedAt: now, expiresAt: now + CACHE_TTL_MS });
}

/**
 * Re-roll a single type — bypasses the cache so the user can shuffle the
 * example shown on a particular type card.
 */
export async function rerollRandomByQuery(query: string): Promise<ScryfallCard | null> {
  const url = `https://api.scryfall.com/cards/random?q=${encodeURIComponent(query)}`;
  // Delete cache, re-fetch
  await db.scryfallCache.delete(url);
  return await fetchRandomByQuery(query);
}
