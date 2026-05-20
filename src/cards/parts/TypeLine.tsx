/**
 * The type line bar — sits between the art and the text box. Shows the type
 * line text on the left and a rarity-tinted lozenge on the right (the set
 * symbol slot). For rare+/mythic/special cards, a thin colored stripe runs
 * along the top edge of the bar.
 */
import { FRAME_COLOR_STOPS, TYPE_H, TYPE_W, TYPE_X, TYPE_Y } from "../tokens";
import type { FrameColor, Rarity } from "@/types/card";

interface TypeLineProps {
  text: string;
  color: FrameColor;
  rarity: Rarity;
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

const RARITY_GLOW: Record<Rarity, string> = {
  common: "rgba(60,60,60,0)",
  uncommon: "rgba(180,190,200,0.55)",
  rare: "rgba(225,201,124,0.7)",
  mythic: "rgba(201,91,30,0.7)",
  special: "rgba(139,58,168,0.65)",
};

export function TypeLine({ text, color, rarity, setSymbolId: _setSymbolId }: TypeLineProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f5efe1" : "#15110a";
  const gradId = `type-plate-grad-${color}`;
  const sheenId = `type-sheen-${color}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} stopOpacity={0.95} />
          <stop offset="55%" stopColor={stops.mid} stopOpacity={0.78} />
          <stop offset="100%" stopColor={stops.bottom} stopOpacity={0.92} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>

      {/* Drop shadow under the plate */}
      <rect x={TYPE_X - 1} y={TYPE_Y + 2} width={TYPE_W + 2} height={TYPE_H + 1} rx={9} ry={9} fill="rgba(0,0,0,0.32)" />
      {/* Plate background */}
      <rect x={TYPE_X} y={TYPE_Y} width={TYPE_W} height={TYPE_H} rx={8} ry={8} fill={`url(#${gradId})`} />
      {/* Sheen */}
      <rect x={TYPE_X} y={TYPE_Y} width={TYPE_W} height={TYPE_H} rx={8} ry={8} fill={`url(#${sheenId})`} />
      {/* Outer dark rim */}
      <rect
        x={TYPE_X}
        y={TYPE_Y}
        width={TYPE_W}
        height={TYPE_H}
        rx={8}
        ry={8}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1.1}
      />
      {/* Inner bevel highlight */}
      <rect
        x={TYPE_X + 1.5}
        y={TYPE_Y + 1.5}
        width={TYPE_W - 3}
        height={TYPE_H - 3}
        rx={6.5}
        ry={6.5}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
      />

      {/* Type text */}
      <foreignObject x={TYPE_X + 18} y={TYPE_Y + 4} width={TYPE_W - 60} height={TYPE_H - 8}>
        <div
          style={{
            fontFamily: "'Cinzel', 'Trajan Pro', 'Beleren', Georgia, serif",
            fontWeight: 600,
            fontSize: "22px",
            color: ink,
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "100%",
            display: "flex",
            alignItems: "center",
            textShadow: isDark ? "0 1px 0 rgba(0,0,0,0.7)" : "0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {text || "Type"}
        </div>
      </foreignObject>

      {/* Set symbol slot — lozenge with rarity color + soft glow */}
      <g transform={`translate(${TYPE_X + TYPE_W - 30} ${TYPE_Y + TYPE_H / 2})`}>
        {rarity !== "common" ? (
          <ellipse cx={0} cy={0} rx={22} ry={16} fill={RARITY_GLOW[rarity]} opacity={0.6} />
        ) : null}
        <path
          d="M -18 0 L 0 -13 L 18 0 L 0 13 Z"
          fill={RARITY_FILL[rarity]}
          stroke={RARITY_STROKE[rarity]}
          strokeWidth={1.4}
        />
        {/* Inner shine */}
        <path
          d="M -14 -1 L 0 -10 L 14 -1"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={0.8}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
