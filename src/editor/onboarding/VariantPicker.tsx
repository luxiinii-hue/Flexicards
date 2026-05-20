/**
 * Step 2 of onboarding — scrollable list of frame variants for the chosen
 * type. Each variant has a small descriptive blurb and resolves to one of
 * our internal layouts when chosen.
 */
import { type CardType, type TypeVariant } from "./types";
import { CornerRivets, Nameplate, Gear } from "../workshop/Gear";

interface Props {
  type: CardType;
  onPick: (variant: TypeVariant) => void;
  onBack: () => void;
}

export function VariantPicker({ type, onPick, onBack }: Props): JSX.Element {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Backdrop with subtle gears */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 500px at 50% 60%, rgba(217,178,102,0.06), transparent 70%)",
          }}
        />
        <div style={{ position: "absolute", left: -40, top: -40 }}>
          <Gear size={220} color="#3a2811" opacity={0.18} spin={12} />
        </div>
        <div style={{ position: "absolute", right: -60, bottom: -60 }}>
          <Gear size={260} color="#3a2811" opacity={0.18} spin={-22} />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-8 py-10">
        <header className="mb-8 text-center">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-100 hover:text-brass-200"
          >
            ← Back to types
          </button>
          <div className="font-mono text-[11px] uppercase tracking-engraved text-brass-400">
            Second Casting
          </div>
          <h1 className="ws-engraved mt-2 font-title text-3xl" style={{ letterSpacing: "0.18em" }}>
            CHOOSE A FRAME FOR <span style={{ color: "#ffb56a" }}>{type.label.toUpperCase()}</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl font-fellEng italic text-ink-100" style={{ fontSize: 15 }}>
            Pick the specific layout you want. Most cards use &ldquo;Standard&rdquo;; the rest are for
            specialty templates.
          </p>
        </header>

        <div className="ws-panel relative flex-1 overflow-y-auto p-3" style={{ maxHeight: "60vh" }}>
          <CornerRivets />
          <Nameplate>{type.label} Variants · {type.variants.length}</Nameplate>
          <ul className="mt-2 space-y-2 px-1 py-2">
            {type.variants.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onPick(v)}
                  className="ws-specimen w-full text-left transition hover:brightness-110"
                  style={{ paddingLeft: 14 }}
                >
                  <div className="flex-1">
                    <div
                      className="font-title text-base"
                      style={{ color: "#f3d99a", letterSpacing: "0.06em" }}
                    >
                      {v.label}
                    </div>
                    <div className="mt-1 font-fellEng italic text-ink-100" style={{ fontSize: 13 }}>
                      {v.description}
                    </div>
                  </div>
                  <div className="ws-chip self-center" style={{ color: "#d9b266" }}>
                    <span className="ws-chip-led" style={{ background: "#d9b266" }} />
                    {v.layout.replace("_", " ")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
