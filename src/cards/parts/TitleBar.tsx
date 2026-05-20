/**
 * Card title bar: name on the left, mana cost on the right. Rendered as a
 * subtle plate that sits on top of the colored inner frame, with a thin
 * beveled outline and gradient highlights.
 */
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { FRAME_COLOR_STOPS, TITLE_H, TITLE_W, TITLE_X, TITLE_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface TitleBarProps {
  name: string;
  manaCost: string;
  color: FrameColor;
  /** When true, force darker name text (used on light frames). */
  isDarkFrame?: boolean;
}

export function TitleBar({ name, manaCost, color, isDarkFrame }: TitleBarProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = isDarkFrame ?? (color === "black" || color === "blue");
  const textColor = isDark ? "#f5efe1" : "#15110a";
  const gradId = `title-plate-grad-${color}`;
  const sheenId = `title-sheen-${color}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} stopOpacity={0.95} />
          <stop offset="55%" stopColor={stops.mid} stopOpacity={0.75} />
          <stop offset="100%" stopColor={stops.bottom} stopOpacity={0.92} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>
      </defs>

      {/* Dark drop-shadow under the plate */}
      <rect
        x={TITLE_X - 1}
        y={TITLE_Y + 2}
        width={TITLE_W + 2}
        height={TITLE_H + 1}
        rx={11}
        ry={11}
        fill="rgba(0,0,0,0.35)"
      />
      {/* Plate background */}
      <rect x={TITLE_X} y={TITLE_Y} width={TITLE_W} height={TITLE_H} rx={10} ry={10} fill={`url(#${gradId})`} />
      {/* Sheen overlay */}
      <rect x={TITLE_X} y={TITLE_Y} width={TITLE_W} height={TITLE_H} rx={10} ry={10} fill={`url(#${sheenId})`} />
      {/* Outer dark rim */}
      <rect
        x={TITLE_X}
        y={TITLE_Y}
        width={TITLE_W}
        height={TITLE_H}
        rx={10}
        ry={10}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1.1}
      />
      {/* Inner bevel highlight */}
      <rect
        x={TITLE_X + 1.5}
        y={TITLE_Y + 1.5}
        width={TITLE_W - 3}
        height={TITLE_H - 3}
        rx={8.5}
        ry={8.5}
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth={1}
      />

      {/* Name — rendered as HTML so we can use the loaded fonts cleanly. */}
      <foreignObject
        x={TITLE_X + 18}
        y={TITLE_Y + 6}
        width={TITLE_W * 0.62}
        height={TITLE_H - 12}
      >
        <div
          style={{
            fontFamily: "'Cinzel', 'Trajan Pro', 'Beleren', Georgia, serif",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: 1.05,
            color: textColor,
            letterSpacing: "0.6px",
            textShadow: isDark ? "0 1px 0 rgba(0,0,0,0.85)" : "0 1px 0 rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {name || "Untitled"}
        </div>
      </foreignObject>

      {/* Mana cost — right-aligned, vertically centered */}
      <ManaCostStrip
        cost={manaCost}
        x={TITLE_X + TITLE_W - 14}
        y={TITLE_Y + TITLE_H / 2}
        size={44}
        gap={3}
        align="right"
      />
    </g>
  );
}
