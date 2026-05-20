/**
 * The colored "inner frame" — the band the user perceives as the card frame
 * color. Drawn inside the black outer border, with a soft gradient and a
 * thin highlight rim.
 */
import { BORDER, CARD_H, CARD_W, FRAME_COLOR_STOPS, INNER_CORNER_R } from "../tokens";
import type { FrameColor } from "@/types/card";

interface InnerFrameProps {
  color: FrameColor;
  gradientId: string;
}

export function InnerFrame({ color, gradientId }: InnerFrameProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const x = BORDER;
  const y = BORDER;
  const w = CARD_W - 2 * BORDER;
  const h = CARD_H - 2 * BORDER;
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} />
          <stop offset="55%" stopColor={stops.top} stopOpacity={0.7} />
          <stop offset="100%" stopColor={stops.bottom} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={INNER_CORNER_R}
        ry={INNER_CORNER_R}
        fill={`url(#${gradientId})`}
      />
      {/* Inner highlight (top edge) */}
      <rect
        x={x + 1}
        y={y + 1}
        width={w - 2}
        height={h - 2}
        rx={INNER_CORNER_R - 1}
        ry={INNER_CORNER_R - 1}
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth={1.2}
      />
      {/* Inner shadow (subtle) */}
      <rect
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h - 4}
        rx={INNER_CORNER_R - 2}
        ry={INNER_CORNER_R - 2}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={0.8}
      />
    </g>
  );
}
