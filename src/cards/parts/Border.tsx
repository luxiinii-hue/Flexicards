/**
 * Outer card border — solid black with rounded corners. A subtle drop shadow
 * is drawn outside the card so the preview reads as floating against the
 * dark workshop backdrop.
 */
import { CARD_H, CARD_W, CORNER_R } from "../tokens";

export function Border(): JSX.Element {
  return (
    <g>
      {/* Soft drop shadow below the card */}
      <rect x={6} y={10} width={CARD_W - 12} height={CARD_H - 12} rx={CORNER_R} ry={CORNER_R} fill="rgba(0,0,0,0.45)" />
      {/* Card body — solid black */}
      <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={CORNER_R} ry={CORNER_R} fill="#080706" />
    </g>
  );
}
