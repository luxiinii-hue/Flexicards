/**
 * Card title bar: name on the left, mana cost on the right.
 * Uses a translucent panel sitting on the inner color frame for an embossed look.
 */
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { FRAME_COLOR_STOPS, TITLE_H, TITLE_W, TITLE_X, TITLE_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface TitleBarProps {
  name: string;
  manaCost: string;
  color: FrameColor;
  /** When true, force-darker name text (used on light frames). */
  isDarkFrame?: boolean;
}

export function TitleBar({ name, manaCost, color, isDarkFrame }: TitleBarProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = isDarkFrame ?? (color === "black" || color === "blue");
  const textColor = isDark ? "#f5efe1" : "#15110a";
  const shadowColor = isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.45)";

  return (
    <g>
      {/* Title panel background */}
      <defs>
        <linearGradient id="title-panel-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>
      <rect
        x={TITLE_X}
        y={TITLE_Y}
        width={TITLE_W}
        height={TITLE_H}
        rx={10}
        ry={10}
        fill={stops.top}
      />
      <rect
        x={TITLE_X}
        y={TITLE_Y}
        width={TITLE_W}
        height={TITLE_H}
        rx={10}
        ry={10}
        fill="url(#title-panel-gradient)"
      />
      <rect
        x={TITLE_X + 1}
        y={TITLE_Y + 1}
        width={TITLE_W - 2}
        height={TITLE_H - 2}
        rx={9}
        ry={9}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
        strokeWidth={1}
      />

      {/* Name */}
      <text
        x={TITLE_X + 18}
        y={TITLE_Y + TITLE_H / 2 + 12}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={34}
        fill={textColor}
        style={{ paintOrder: "stroke", letterSpacing: "0.5px" }}
        stroke={shadowColor}
        strokeWidth={0.6}
      >
        {name || "Untitled"}
      </text>

      {/* Mana cost — right-aligned, vertically centered */}
      <ManaCostStrip
        cost={manaCost}
        x={TITLE_X + TITLE_W - 14}
        y={TITLE_Y + TITLE_H / 2}
        size={42}
        gap={4}
        align="right"
      />
    </g>
  );
}
