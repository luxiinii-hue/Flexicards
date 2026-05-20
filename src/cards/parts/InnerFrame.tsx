/**
 * The colored "inner frame" band that wraps art and text. Drawn as a single
 * solid rounded rect with a very subtle vertical gradient — just enough to
 * suggest depth, but not so much that it reads as glass.
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
    </g>
  );
}
