/**
 * The type line bar — sits between the art and the text box.
 * Shows the type line text on the left and the set symbol on the right.
 */
import { FRAME_COLOR_STOPS, TYPE_H, TYPE_W, TYPE_X, TYPE_Y } from "../tokens";
import type { FrameColor, Rarity } from "@/types/card";

interface TypeLineProps {
  text: string;
  color: FrameColor;
  rarity: Rarity;
  /** Set symbol id ("flx" etc.). For v1 we render a stylized lozenge. */
  setSymbolId?: string;
}

const RARITY_FILL: Record<Rarity, string> = {
  common: "#1c1a18",
  uncommon: "#c4ccd2",
  rare: "#e1c97c",
  mythic: "#c95b1e",
  special: "#8b3aa8",
};

const RARITY_STROKE: Record<Rarity, string> = {
  common: "#f0e9d2",
  uncommon: "#1f2226",
  rare: "#2a200f",
  mythic: "#2e1408",
  special: "#1c0a24",
};

export function TypeLine({ text, color, rarity, setSymbolId: _setSymbolId }: TypeLineProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f5efe1" : "#15110a";

  return (
    <g>
      <defs>
        <linearGradient id="type-panel-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>
      <rect x={TYPE_X} y={TYPE_Y} width={TYPE_W} height={TYPE_H} rx={8} ry={8} fill={stops.top} />
      <rect x={TYPE_X} y={TYPE_Y} width={TYPE_W} height={TYPE_H} rx={8} ry={8} fill="url(#type-panel-gradient)" />
      <rect
        x={TYPE_X + 1}
        y={TYPE_Y + 1}
        width={TYPE_W - 2}
        height={TYPE_H - 2}
        rx={7}
        ry={7}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
        strokeWidth={1}
      />

      {/* Text */}
      <text
        x={TYPE_X + 16}
        y={TYPE_Y + TYPE_H / 2 + 9}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={600}
        fontSize={24}
        fill={ink}
      >
        {text || "Type"}
      </text>

      {/* Set symbol slot — a lozenge with rarity color */}
      <g transform={`translate(${TYPE_X + TYPE_W - 38} ${TYPE_Y + TYPE_H / 2})`}>
        <path
          d="M -16 0 L 0 -12 L 16 0 L 0 12 Z"
          fill={RARITY_FILL[rarity]}
          stroke={RARITY_STROKE[rarity]}
          strokeWidth={1.2}
        />
      </g>
    </g>
  );
}
