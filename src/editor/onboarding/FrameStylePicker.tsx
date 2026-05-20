/**
 * Step 2 of onboarding — pick a frame style for the chosen card type. Each
 * option renders a small visual preview of how the style treats the frame.
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
        }}
      >
        <StyleThumbnailSvg style={style} />
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

/**
 * Tiny stylized preview SVG — captures the visual signature of each style
 * without rendering a full card.
 */
function StyleThumbnailSvg({ style }: { style: FrameStyle }): JSX.Element {
  return (
    <svg viewBox="0 0 100 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {style === "standard" ? <StandardThumb /> : null}
      {style === "borderless" ? <BorderlessThumb /> : null}
      {style === "retro" ? <RetroThumb /> : null}
      {style === "showcase" ? <ShowcaseThumb /> : null}
    </svg>
  );
}

function StandardThumb(): JSX.Element {
  return (
    <g>
      <rect x="2" y="2" width="96" height="136" rx="6" fill="#080706" />
      <rect x="6" y="6" width="88" height="128" rx="3" fill="#d9b266" />
      <rect x="10" y="10" width="80" height="14" rx="2" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
      <rect x="10" y="28" width="80" height="50" fill="#1a1c24" stroke="#080706" strokeWidth="1" />
      <rect x="10" y="82" width="80" height="10" rx="1.5" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
      <rect x="10" y="96" width="80" height="34" rx="2" fill="#f6efde" stroke="#1a1208" strokeWidth="0.6" />
      <polygon points="74,118 90,118 90,130 70,130 70,122" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
    </g>
  );
}

function BorderlessThumb(): JSX.Element {
  return (
    <g>
      <rect x="2" y="2" width="96" height="136" rx="6" fill="#080706" />
      {/* Art fills the card */}
      <defs>
        <linearGradient id="bl-art-thumb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a3550" />
          <stop offset="100%" stopColor="#0c0f1c" />
        </linearGradient>
        <linearGradient id="bl-top-vig" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="bl-bot-vig" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="128" rx="4" fill="url(#bl-art-thumb)" />
      <rect x="6" y="6" width="88" height="30" fill="url(#bl-top-vig)" />
      <rect x="6" y="80" width="88" height="54" fill="url(#bl-bot-vig)" />
      <rect x="10" y="10" width="68" height="12" rx="1" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
      <rect x="10" y="80" width="80" height="8" rx="1" fill="rgba(8,8,12,0.85)" stroke="rgba(243,217,154,0.45)" strokeWidth="0.4" />
      <rect x="10" y="92" width="80" height="38" rx="1.5" fill="rgba(246,239,222,0.92)" stroke="rgba(0,0,0,0.6)" strokeWidth="0.5" />
    </g>
  );
}

function RetroThumb(): JSX.Element {
  return (
    <g>
      <rect x="2" y="2" width="96" height="136" rx="6" fill="#231509" />
      <rect x="4" y="4" width="92" height="132" rx="5" fill="none" stroke="rgba(255,210,160,0.15)" strokeWidth="0.6" />
      <rect x="14" y="14" width="72" height="112" rx="3" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
      <rect x="18" y="18" width="64" height="12" rx="1.5" fill="#967c3a" stroke="#1a1208" strokeWidth="0.5" />
      <rect x="18" y="34" width="64" height="40" fill="#1a1c24" stroke="#080706" strokeWidth="0.8" />
      <rect x="18" y="78" width="64" height="8" rx="1" fill="#967c3a" stroke="#1a1208" strokeWidth="0.5" />
      <rect x="18" y="90" width="64" height="30" rx="1.5" fill="#f6efde" stroke="#1a1208" strokeWidth="0.5" />
    </g>
  );
}

function ShowcaseThumb(): JSX.Element {
  return (
    <g>
      <rect x="2" y="2" width="96" height="136" rx="6" fill="#080706" />
      <rect x="6" y="6" width="88" height="128" rx="3" fill="#d9b266" />
      {/* Gold rim */}
      <rect x="9" y="9" width="82" height="122" rx="2" fill="none" stroke="#f3d99a" strokeWidth="0.8" />
      <rect x="10" y="10" width="80" height="14" rx="2" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
      <rect x="10" y="28" width="80" height="50" fill="#1a1c24" stroke="#080706" strokeWidth="1" />
      <rect x="10" y="82" width="80" height="10" rx="1.5" fill="#b69d4a" stroke="#1a1208" strokeWidth="0.6" />
      <rect x="10" y="96" width="80" height="34" rx="2" fill="#f6efde" stroke="#1a1208" strokeWidth="0.6" />
      {/* Corner flourishes */}
      {[
        [9, 9, 1, 1],
        [91, 9, -1, 1],
        [9, 131, 1, -1],
        [91, 131, -1, -1],
      ].map(([cx, cy, sx, sy], i) => (
        <g key={i} transform={`translate(${cx},${cy}) scale(${sx} ${sy})`}>
          <path d="M 1 6 A 5 5 0 0 1 6 1" fill="none" stroke="#f3d99a" strokeWidth="0.8" />
          <circle cx="5" cy="5" r="0.8" fill="#f3d99a" />
        </g>
      ))}
    </g>
  );
}
