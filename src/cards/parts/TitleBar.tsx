/**
 * Card title bar. Sits at the top of the inner color frame, with the name
 * on the left and the mana cost on the right. Rendered as a flat panel in
 * the frame's plate color with one clean dark border.
 */
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { FRAME_COLOR_STOPS, TITLE_H, TITLE_W, TITLE_X, TITLE_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface TitleBarProps {
  name: string;
  manaCost: string;
  color: FrameColor;
  isDarkFrame?: boolean;
}

export function TitleBar({ name, manaCost, color, isDarkFrame }: TitleBarProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = isDarkFrame ?? (color === "black" || color === "blue");
  const textColor = isDark ? "#f3e7c8" : "#1a1206";

  return (
    <g>
      {/* Flat plate matching frame color */}
      <rect
        x={TITLE_X}
        y={TITLE_Y}
        width={TITLE_W}
        height={TITLE_H}
        rx={4}
        ry={4}
        fill={stops.plate}
      />
      {/* Single thin dark border */}
      <rect
        x={TITLE_X}
        y={TITLE_Y}
        width={TITLE_W}
        height={TITLE_H}
        rx={4}
        ry={4}
        fill="none"
        stroke="rgba(0,0,0,0.65)"
        strokeWidth={1.2}
      />

      {/* Name */}
      <foreignObject x={TITLE_X + 16} y={TITLE_Y + 4} width={TITLE_W * 0.62} height={TITLE_H - 8}>
        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            fontSize: "30px",
            lineHeight: 1.05,
            color: textColor,
            letterSpacing: "0.5px",
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

      <ManaCostStrip
        cost={manaCost}
        x={TITLE_X + TITLE_W - 12}
        y={TITLE_Y + TITLE_H / 2}
        size={38}
        gap={3}
        align="right"
      />
    </g>
  );
}
