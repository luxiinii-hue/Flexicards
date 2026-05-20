/**
 * Outer black card border with rounded corners. Drawn as a single rounded
 * rect with a thick stroke + a slightly darker rim for depth.
 */
import { CARD_H, CARD_W, CORNER_R } from "../tokens";

export function Border(): JSX.Element {
  return (
    <g>
      {/* Drop shadow under the card */}
      <rect
        x={2}
        y={6}
        width={CARD_W - 4}
        height={CARD_H - 6}
        rx={CORNER_R}
        ry={CORNER_R}
        fill="rgba(0,0,0,0.18)"
        filter="url(#card-shadow)"
      />
      {/* Card body */}
      <rect
        x={0}
        y={0}
        width={CARD_W}
        height={CARD_H}
        rx={CORNER_R}
        ry={CORNER_R}
        fill="#0c0a08"
      />
      {/* Subtle highlight rim */}
      <rect
        x={1.5}
        y={1.5}
        width={CARD_W - 3}
        height={CARD_H - 3}
        rx={CORNER_R - 1.5}
        ry={CORNER_R - 1.5}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1}
      />
    </g>
  );
}
