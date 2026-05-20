import { TYPE_H, TYPE_W, TYPE_X, TYPE_Y } from "../tokens";
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

export function TypeLine({ text, color, rarity }: TypeLineProps): JSX.Element {
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#ffffff" : "#000000";

  return (
    <g>
      <foreignObject x={TYPE_X + 14} y={TYPE_Y + 2} width={TYPE_W - 56} height={TYPE_H - 4}>
        <div
          style={{
            fontFamily: "'Beleren', 'Cinzel', Georgia, serif",
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
            textShadow: isDark ? "1px 1px 2px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {text || "Type"}
        </div>
      </foreignObject>

      {/* Set symbol lozenge */}
      <g transform={`translate(${TYPE_X + TYPE_W - 28} ${TYPE_Y + TYPE_H / 2})`}>
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
