import { useState } from "react";
import { useStore, useActiveCard } from "@/state/store";
import { Card } from "@/cards/Card";
import { hasBackFace } from "@/types/card";
import { Chip, Gear, Nameplate } from "../workshop/Gear";

const ZOOM_OPTIONS = [50, 75, 100, 125] as const;

export function PreviewPanel(): JSX.Element {
  const card = useActiveCard();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-walnut-dim">
      {/* Header / examination plate */}
      <div className="relative z-10 ws-panel flex flex-shrink-0 items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-3">
          <Nameplate right={face === "back" ? <Chip glow="#5cae9b">Back Face</Chip> : <Chip glow="#d9b266">Front Face</Chip>}>
            Examination Plate
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
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-200">
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

      {/* Workshop backdrop with gears */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <WorkshopBackdrop />

        {!card ? (
          <div className="relative z-10 text-center font-fell text-ink-100">
            <div className="text-base">Select a specimen on the left to begin.</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-200">
              Or click <span className="text-brass-200">Forge New Card</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            {/* Easel rails */}
            <div
              className="pointer-events-none absolute -inset-7 rounded"
              style={{
                border: "1px solid #2a1c0c",
                background: "linear-gradient(180deg, rgba(217,178,102,0.05), rgba(217,178,102,0.0))",
                boxShadow: "inset 0 0 0 1px rgba(217,178,102,0.08)",
              }}
            />
            <EaselCornerClamp pos="tl" />
            <EaselCornerClamp pos="tr" />
            <EaselCornerClamp pos="bl" />
            <EaselCornerClamp pos="br" />

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
      {/* warm radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 500px at 50% 60%, rgba(217,178,102,0.06), transparent 70%), radial-gradient(500px 320px at 50% 25%, rgba(143,214,255,0.04), transparent 70%)",
        }}
      />
      {/* engineer grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(217,178,102,0.035) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgba(217,178,102,0.035) 0 1px, transparent 1px 56px)",
        }}
      />
      <div style={{ position: "absolute", left: -60, top: -40 }}>
        <Gear size={240} color="#3a2811" opacity={0.18} spin={12} />
      </div>
      <div style={{ position: "absolute", right: -70, bottom: -50 }}>
        <Gear size={280} color="#3a2811" opacity={0.18} spin={-22} />
      </div>
      <div style={{ position: "absolute", right: 140, top: 80 }}>
        <Gear size={70} color="#5cae9b" opacity={0.16} spin={36} />
      </div>
      <div style={{ position: "absolute", left: 180, bottom: 90 }}>
        <Gear size={50} color="#c2693a" opacity={0.18} spin={-10} />
      </div>
    </div>
  );
}

function EaselCornerClamp({ pos }: { pos: "tl" | "tr" | "bl" | "br" }): JSX.Element {
  const style = {
    position: "absolute" as const,
    width: 24,
    height: 24,
    borderRadius: 3,
    background: "linear-gradient(180deg, #d9b266, #6a4a1c 70%, #2a1c0c)",
    border: "1px solid #2a1c0c",
    boxShadow: "inset 0 1px 0 rgba(255,220,160,0.25), 0 2px 0 rgba(0,0,0,0.5)",
    ...(pos === "tl" && { top: -32, left: -32 }),
    ...(pos === "tr" && { top: -32, right: -32 }),
    ...(pos === "bl" && { bottom: -32, left: -32 }),
    ...(pos === "br" && { bottom: -32, right: -32 }),
  };
  return <div style={style} aria-hidden />;
}
