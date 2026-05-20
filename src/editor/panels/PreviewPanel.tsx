import { useState } from "react";
import { useStore, useActiveCard } from "@/state/store";
import { Card } from "@/cards/Card";
import { hasBackFace } from "@/types/card";

const ZOOM_OPTIONS = [50, 75, 100, 125];

export function PreviewPanel(): JSX.Element {
  const card = useActiveCard();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-ink-100">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-ink-200 bg-ink-50/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-ink-600">
          <span className="font-semibold text-ink-700">Preview</span>
          {card ? <span className="text-ink-400">·</span> : null}
          {card ? <span>{card.name || "Untitled"}</span> : null}
        </div>
        <div className="flex items-center gap-3">
          {card && hasBackFace(card) ? (
            <div className="flex overflow-hidden rounded-md border border-ink-300 bg-white">
              <button
                type="button"
                className={`px-2 py-1 ${face === "front" ? "bg-ink-900 text-ink-50" : ""}`}
                onClick={() => setFace("front")}
              >
                Front
              </button>
              <button
                type="button"
                className={`px-2 py-1 ${face === "back" ? "bg-ink-900 text-ink-50" : ""}`}
                onClick={() => setFace("back")}
              >
                Back
              </button>
            </div>
          ) : null}
          <label className="flex items-center gap-1 text-ink-600">
            <input
              type="checkbox"
              checked={settings.showSafeZoneGuide}
              onChange={(e) => void updateSettings({ showSafeZoneGuide: e.target.checked })}
            />
            Safe zone
          </label>
          <select
            value={zoom}
            onChange={(e) => setZoom(e.target.value === "fit" ? "fit" : Number(e.target.value))}
            className="rounded border border-ink-300 bg-white px-2 py-1"
          >
            <option value="fit">Fit</option>
            {ZOOM_OPTIONS.map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
        {!card ? (
          <div className="text-center text-ink-500">
            <div className="text-base">Select a card on the left to begin.</div>
            <div className="mt-1 text-xs">Or click + New Card to make one.</div>
          </div>
        ) : (
          <div
            className="relative drop-shadow-card"
            style={
              zoom === "fit"
                ? { width: "min(560px, 90%)" }
                : { width: `calc(${Math.round((zoom / 100) * 360)}px + ${zoom / 5}px)`, maxWidth: "100%" }
            }
          >
            <Card card={card} showSafeZone={settings.showSafeZoneGuide} face={face} />
          </div>
        )}
      </div>
    </section>
  );
}
