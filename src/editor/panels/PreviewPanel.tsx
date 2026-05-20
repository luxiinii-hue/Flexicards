import { useState } from "react";
import { useStore, useActiveCard } from "@/state/store";
import { Card } from "@/cards/Card";
import { hasBackFace } from "@/types/card";
import { Chip, Nameplate } from "../workshop/Gear";

const ZOOM_OPTIONS = [50, 75, 100, 125] as const;

export function PreviewPanel(): JSX.Element {
  const card = useActiveCard();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-950">
      <div className="relative z-10 ws-panel flex flex-shrink-0 items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-3">
          <Nameplate right={face === "back" ? <Chip glow="#5cae9b">Back Face</Chip> : <Chip glow="#d9b266">Front Face</Chip>}>
            Card Preview
          </Nameplate>
        </div>
        <div className="flex items-center gap-2">
          {card?.name ? (
            <span className="font-title text-sm tracking-wider" style={{ color: "#f3d99a" }}>
              {card.name}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {card && hasBackFace(card) ? (
            <div className="ws-capsule">
              <button type="button" className={face === "front" ? "is-on" : ""} onClick={() => setFace("front")}>
                Front
              </button>
              <button type="button" className={face === "back" ? "is-on" : ""} onClick={() => setFace("back")}>
                Back
              </button>
            </div>
          ) : null}
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            <input
              type="checkbox"
              checked={settings.showSafeZoneGuide}
              onChange={(e) => void updateSettings({ showSafeZoneGuide: e.target.checked })}
            />
            Safe zone
          </label>
          <div className="ws-capsule">
            <button type="button" className={zoom === "fit" ? "is-on" : ""} onClick={() => setZoom("fit")}>
              Fit
            </button>
            {ZOOM_OPTIONS.map((z) => (
              <button key={z} type="button" className={zoom === z ? "is-on" : ""} onClick={() => setZoom(z)}>
                {z}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <WorkshopBackdrop />

        {!card ? (
          <div className="relative z-10 text-center font-fell text-neutral-400">
            <div className="text-base">Select a card on the left to begin.</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Or click <span className="text-ea580c">New Card</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div
              className="drop-shadow-card"
              style={
                zoom === "fit"
                  ? { width: "min(560px, 88%)" }
                  : { width: `calc(${Math.round((zoom / 100) * 380)}px)`, maxWidth: "100%" }
              }
            >
              <Card card={card} showSafeZone={settings.showSafeZoneGuide} face={face} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkshopBackdrop(): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 70%)",
        }}
      />
    </div>
  );
}
