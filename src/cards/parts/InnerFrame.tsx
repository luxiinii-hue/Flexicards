/**
 * The colored "inner frame" — the band the user perceives as the card frame
 * color. Rendered as three layers:
 *
 *   1. Solid color band with a 3-stop vertical gradient (top → mid → bottom)
 *   2. A darker outer rim around the band (gives the band depth and a sense
 *      of being recessed into the black border)
 *   3. A subtle inner highlight stroke (top edge bright, bottom edge dim) to
 *      simulate a beveled surface
 *
 * The rim "wraps" around the art window and text box too — we render extra
 * darker bands around those features in the per-frame components.
 */
import { BORDER, CARD_H, CARD_W, FRAME_COLOR_STOPS, FRAME_HIGHLIGHT_STOPS, FRAME_RIM_STOPS, INNER_CORNER_R } from "../tokens";
import type { FrameColor } from "@/types/card";

interface InnerFrameProps {
  color: FrameColor;
  gradientId: string;
}

export function InnerFrame({ color, gradientId }: InnerFrameProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const rim = FRAME_RIM_STOPS[color];
  const highlight = FRAME_HIGHLIGHT_STOPS[color];

  const x = BORDER;
  const y = BORDER;
  const w = CARD_W - 2 * BORDER;
  const h = CARD_H - 2 * BORDER;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} />
          <stop offset="38%" stopColor={stops.mid} />
          <stop offset="100%" stopColor={stops.bottom} />
        </linearGradient>
        <linearGradient id={`${gradientId}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={rim.top} />
          <stop offset="100%" stopColor={rim.bottom} />
        </linearGradient>
      </defs>

      {/* Darker rim layer — slightly larger than the band, visible at the edges */}
      <rect
        x={x - 1}
        y={y - 1}
        width={w + 2}
        height={h + 2}
        rx={INNER_CORNER_R + 1}
        ry={INNER_CORNER_R + 1}
        fill={`url(#${gradientId}-rim)`}
      />

      {/* Main color band */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={INNER_CORNER_R}
        ry={INNER_CORNER_R}
        fill={`url(#${gradientId})`}
      />

      {/* Top-edge highlight that fades to nothing — emboss effect */}
      <rect
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h - 4}
        rx={INNER_CORNER_R - 2}
        ry={INNER_CORNER_R - 2}
        fill="none"
        stroke={highlight}
        strokeWidth={1.4}
      />

      {/* Bottom soft shadow inside the band — depth */}
      <rect
        x={x + 3}
        y={y + 3}
        width={w - 6}
        height={h - 6}
        rx={INNER_CORNER_R - 3}
        ry={INNER_CORNER_R - 3}
        fill="none"
        stroke="rgba(0,0,0,0.16)"
        strokeWidth={0.9}
      />
    </g>
  );
}
