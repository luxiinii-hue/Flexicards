/**
 * Step 1 of onboarding — a grid of floating type cards. Each shows a random
 * real card fetched from Scryfall as a visual reference for that card type.
 * Clicking one advances to the variant picker.
 */
import { useEffect, useState } from "react";
import type { ScryfallCard } from "@/types/scryfall";
import { fetchRandomByQuery, rerollRandomByQuery } from "@/services/scryfallRandom";
import { CARD_TYPES, FREEFORM_TYPE, type CardType } from "./types";
import { Chip } from "../workshop/Gear";

interface Props {
  onPick: (type: CardType) => void;
  onSkip: () => void;
}

export function TypePicker({ onPick, onSkip }: Props): JSX.Element {
  const [samples, setSamples] = useState<Record<string, ScryfallCard | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      // Fire all in parallel — the onboarding accepts a one-time burst
      const results = await Promise.all(
        CARD_TYPES.map(async (t) => [t.id, await fetchRandomByQuery(t.scryfallQuery, ctrl.signal)] as const)
      );
      if (cancelled) return;
      setSamples(Object.fromEntries(results));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  async function reroll(type: CardType) {
    setSamples((prev) => ({ ...prev, [type.id]: null }));
    const fresh = await rerollRandomByQuery(type.scryfallQuery);
    setSamples((prev) => ({ ...prev, [type.id]: fresh }));
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-8 py-12">
        <header className="mb-8 text-center">
          <div className="font-mono text-[11px] uppercase tracking-engraved text-brass-400">First Forging</div>
          <h1 className="ws-engraved mt-2 font-title text-3xl md:text-4xl" style={{ letterSpacing: "0.22em" }}>
            CHOOSE A SPECIMEN TYPE
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-fellEng italic text-ink-100" style={{ fontSize: 15 }}>
            Pick the kind of card you want to forge. Each example is a real card pulled from Scryfall &mdash;
            it shows you what that type looks like. Only the layout template will be applied to your new card;
            you supply your own art and rules text.
          </p>
          {loading ? (
            <div className="mt-4">
              <Chip glow="#5cae9b">Summoning examples from Scryfall…</Chip>
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {CARD_TYPES.map((t) => (
            <TypeCard
              key={t.id}
              type={t}
              sample={samples[t.id] ?? null}
              loading={loading}
              onPick={() => onPick(t)}
              onReroll={() => void reroll(t)}
            />
          ))}
          <FreeformCard onPick={() => onPick(FREEFORM_TYPE)} />
        </div>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={onSkip} className="ws-btn ws-btn-secondary">
            Skip → Open Cabinet
          </button>
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  type: CardType;
  sample: ScryfallCard | null;
  loading: boolean;
  onPick: () => void;
  onReroll: () => void;
}

function TypeCard({ type, sample, loading, onPick, onReroll }: CardProps): JSX.Element {
  const imgUrl = sample?.image_uris?.normal ?? sample?.card_faces?.[0]?.image_uris?.normal;
  return (
    <div className="group flex flex-col items-center">
      <button
        type="button"
        onClick={onPick}
        className="relative overflow-hidden rounded-[14px] transition hover:scale-[1.03]"
        style={{
          width: 220,
          aspectRatio: "63 / 88",
          background: "#0c0a08",
          border: "1px solid #2a1c0c",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(217,178,102,0.18), inset 0 0 0 1px rgba(0,0,0,0.6)",
        }}
        title={`Forge a ${type.label}`}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`${type.label} reference: ${sample?.name ?? ""}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ink-200"
            style={{
              background:
                "linear-gradient(180deg, #1d130a, #14100a 70%, #0e0a05)",
            }}
          >
            {loading ? "Loading…" : "—"}
          </div>
        )}
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-end justify-center p-3 opacity-0 transition group-hover:opacity-100"
          style={{
            background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
        >
          <span
            className="rounded px-3 py-1 font-title font-semibold uppercase tracking-widest"
            style={{
              background: "linear-gradient(180deg, #e6c47a, #8d6627)",
              color: "#1a1208",
              fontSize: 11,
              border: "1px solid #3a2811",
            }}
          >
            Forge {type.label}
          </span>
        </div>
      </button>
      <div className="mt-3 text-center">
        <div className="font-title text-base uppercase tracking-widest" style={{ color: "#f3d99a", letterSpacing: "0.22em" }}>
          {type.label}
        </div>
        <div className="mt-1 font-fellEng italic text-ink-100" style={{ fontSize: 12, lineHeight: 1.3 }}>
          {type.blurb}
        </div>
        {sample?.name ? (
          <button
            type="button"
            onClick={onReroll}
            className="mt-2 font-mono text-[9.5px] uppercase tracking-widest text-ink-200 hover:text-brass-200"
            title="Show a different example"
          >
            ↻ {sample.name}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function FreeformCard({ onPick }: { onPick: () => void }): JSX.Element {
  return (
    <div className="group flex flex-col items-center">
      <button
        type="button"
        onClick={onPick}
        className="relative overflow-hidden rounded-[14px] transition hover:scale-[1.03]"
        style={{
          width: 220,
          aspectRatio: "63 / 88",
          background:
            "repeating-linear-gradient(135deg, rgba(217,178,102,0.05) 0 8px, transparent 8px 16px), linear-gradient(180deg, #1f160c, #0c0805)",
          border: "1px dashed #6a4a1c",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(217,178,102,0.12)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-title text-3xl" style={{ color: "#d9b266", letterSpacing: "0.25em" }}>
            ◇
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-engraved text-brass-400">FREEFORM</div>
          <div
            className="mx-4 mt-3 font-fellEng italic text-ink-100"
            style={{ fontSize: 12, lineHeight: 1.3 }}
          >
            No template &mdash; toggle stats, loyalty, abilities as you like.
          </div>
        </div>
      </button>
      <div className="mt-3 text-center">
        <div className="font-title text-base uppercase tracking-widest" style={{ color: "#f3d99a", letterSpacing: "0.22em" }}>
          Custom
        </div>
        <div className="mt-1 font-fellEng italic text-ink-100" style={{ fontSize: 12, lineHeight: 1.3 }}>
          Build your own homebrew card type.
        </div>
      </div>
    </div>
  );
}
