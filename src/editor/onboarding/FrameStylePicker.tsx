/**
 * Step 2 of onboarding — pick a frame style for the chosen card type. Each
 * option renders a small visual preview of how the style treats the frame,
 * using the actual m15 frame thumbnail assets so the user sees the real art.
 */
import { ALL_FRAME_STYLES, FRAME_STYLE_DESCRIPTIONS, FRAME_STYLE_LABELS, type FrameStyle } from "@/types/card";
import type { CardType } from "./types";
import { CornerRivets, Gear, Nameplate } from "../workshop/Gear";

interface Props {
  type: CardType;
  onPick: (style: FrameStyle) => void;
  onBack: () => void;
}

export function FrameStylePicker({ type, onPick, onBack }: Props): JSX.Element {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 600px at 50% 60%, rgba(217,178,102,0.06), transparent 70%)",
          }}
        />
        <div style={{ position: "absolute", left: -40, top: -40 }}>
          <Gear size={220} color="#3a2811" opacity={0.18} spin={12} />
        </div>
        <div style={{ position: "absolute", right: -60, bottom: -60 }}>
          <Gear size={260} color="#3a2811" opacity={0.18} spin={-22} />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-8 py-10">
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
            CHOOSE A FRAME STYLE
          </h1>
          <p className="mx-auto mt-2 max-w-xl font-fellEng italic text-ink-100" style={{ fontSize: 15 }}>
            Each style gives the {type.label.toLowerCase()} a different visual feel. You can change it later
            from the form panel without losing any of your card data.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {ALL_FRAME_STYLES.map((s) => (
            <StylePreview key={s} style={s} onPick={() => onPick(s)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StylePreview({ style, onPick }: { style: FrameStyle; onPick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onPick}
      className="ws-panel group relative flex flex-col items-center gap-3 p-4 text-center transition hover:brightness-110"
      style={{ cursor: "pointer", borderRadius: 4 }}
    >
      <CornerRivets />
      <div
        className="overflow-hidden rounded-md"
        style={{
          width: 180,
          aspectRatio: "63 / 88",
          background: "#0c0805",
          border: "1px solid #2a1c0c",
          boxShadow: "0 12px 24px rgba(0,0,0,0.55)",
          position: "relative",
        }}
      >
        <StyleThumbnail style={style} />
      </div>
      <div>
        <Nameplate>{FRAME_STYLE_LABELS[style]}</Nameplate>
        <div className="mt-2 px-1 font-fellEng italic text-ink-100" style={{ fontSize: 12, lineHeight: 1.3 }}>
          {FRAME_STYLE_DESCRIPTIONS[style]}
        </div>
      </div>
    </button>
  );
}

const BASE = import.meta.env.BASE_URL;

/**
 * Picker thumbnails — composed from the real m15 frame thumbnail assets
 * (m15Frame*Thumb.png) plus a style-specific decoration layer so each style's
 * visual signature reads at a glance.
 */
function StyleThumbnail({ style }: { style: FrameStyle }): JSX.Element {
  if (style === "borderless") return <BorderlessThumb />;
  if (style === "retro") return <RetroStyledThumb />;
  if (style === "showcase") return <ShowcaseStyledThumb />;
  return <StandardThumb />;
}

function StandardThumb(): JSX.Element {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <img
        src={`${BASE}frames/m15FrameMThumb.png`}
        alt="standard frame"
        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
      />
    </div>
  );
}

function ShowcaseStyledThumb(): JSX.Element {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <img
        src={`${BASE}frames/m15FrameMThumb.png`}
        alt="showcase frame"
        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
      />
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <rect x="3" y="3" width="94" height="134" rx="4" fill="none" stroke="#f3d99a" strokeWidth="0.9" />
        {[
          [3, 3, 1, 1],
          [97, 3, -1, 1],
          [3, 137, 1, -1],
          [97, 137, -1, -1],
        ].map(([cx, cy, sx, sy], i) => (
          <g key={i} transform={`translate(${cx},${cy}) scale(${sx} ${sy})`}>
            <path d="M 1 8 A 7 7 0 0 1 8 1" fill="none" stroke="#f3d99a" strokeWidth="1.1" />
            <circle cx="6" cy="6" r="1" fill="#f3d99a" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function RetroStyledThumb(): JSX.Element {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#231509" }}>
      <img
        src={`${BASE}frames/m15FrameMThumb.png`}
        alt="retro frame"
        style={{
          width: "84%",
          height: "84%",
          display: "block",
          objectFit: "cover",
          margin: "8% 8%",
          filter: "sepia(0.55) saturate(1.2) brightness(0.92) hue-rotate(-8deg)",
        }}
      />
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <rect x="3" y="3" width="94" height="134" rx="3" fill="none" stroke="#b58a4a" strokeWidth="1.2" />
        <rect x="5" y="5" width="90" height="130" rx="2" fill="none" stroke="rgba(255,210,160,0.18)" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

function BorderlessThumb(): JSX.Element {
  return (
    <svg viewBox="0 0 100 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bl-art" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a4f70" />
          <stop offset="100%" stopColor="#0c0f1c" />
        </linearGradient>
        <linearGradient id="bl-top-vig" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="bl-bot-vig" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.88)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="140" fill="url(#bl-art)" />
      <rect x="0" y="0" width="100" height="34" fill="url(#bl-top-vig)" />
      <rect x="0" y="78" width="100" height="62" fill="url(#bl-bot-vig)" />
      <rect x="6" y="8" width="62" height="11" rx="1" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      <rect x="6" y="82" width="88" height="8" rx="1" fill="rgba(8,8,12,0.85)" stroke="rgba(243,217,154,0.5)" strokeWidth="0.4" />
      <rect x="6" y="94" width="88" height="38" rx="1.5" fill="rgba(246,239,222,0.92)" stroke="rgba(0,0,0,0.6)" strokeWidth="0.5" />
    </svg>
  );
}
