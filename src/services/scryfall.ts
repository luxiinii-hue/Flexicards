/**
 * Scryfall REST client with rate limiting + IndexedDB caching.
 *
 * Scryfall's stated rate limit is ~10 req/s with a recommended 50–100ms gap and
 * a hard 2 req/s on per-endpoint limits. We single-flight requests with a
 * 600ms minimum gap to stay comfortably under both.
 */
import { db } from "@/state/db";
import type { ScryfallCard, ScryfallCatalog, ScryfallError, ScryfallList } from "@/types/scryfall";

const BASE_URL = "https://api.scryfall.com";
const MIN_GAP_MS = 600;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

let queue: Promise<unknown> = Promise.resolve();
let lastDispatchedAt = 0;

async function dispatch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const cached = await readCache<T>(url);
  if (cached) return cached;

  // Chain onto the single-flight queue
  const exec = async (): Promise<T> => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastDispatchedAt));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastDispatchedAt = Date.now();

    const res = await fetch(url, {
      signal,
      headers: { Accept: "application/json", "User-Agent": "Flexicards/0.1" },
    });
    if (!res.ok) {
      let err: ScryfallError | null = null;
      try {
        err = (await res.json()) as ScryfallError;
      } catch {
        // ignore
      }
      throw new Error(err?.details ?? `Scryfall ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    const body = JSON.parse(text) as T;
    await writeCache(url, text);
    return body;
  };

  const promise = queue.then(exec);
  queue = promise.catch(() => undefined);
  return (await promise) as T;
}

async function readCache<T>(url: string): Promise<T | null> {
  const entry = await db.scryfallCache.get(url);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    await db.scryfallCache.delete(url);
    return null;
  }
  return JSON.parse(entry.body) as T;
}

async function writeCache(url: string, body: string): Promise<void> {
  const now = Date.now();
  await db.scryfallCache.put({ url, body, fetchedAt: now, expiresAt: now + CACHE_TTL_MS });
}

export async function searchCardAutocomplete(query: string, signal?: AbortSignal): Promise<string[]> {
  if (query.length < 2) return [];
  const url = `${BASE_URL}/cards/autocomplete?q=${encodeURIComponent(query)}`;
  const result = await dispatch<ScryfallCatalog>(url, signal);
  return result.data;
}

export async function fetchCardByName(name: string, signal?: AbortSignal): Promise<ScryfallCard> {
  const url = `${BASE_URL}/cards/named?fuzzy=${encodeURIComponent(name)}`;
  return await dispatch<ScryfallCard>(url, signal);
}

export async function searchCards(query: string, signal?: AbortSignal): Promise<ScryfallList<ScryfallCard>> {
  const url = `${BASE_URL}/cards/search?q=${encodeURIComponent(query)}`;
  return await dispatch<ScryfallList<ScryfallCard>>(url, signal);
}
