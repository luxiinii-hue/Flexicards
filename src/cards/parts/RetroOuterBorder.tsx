/**
 * Retro outer border — replaces the standard thin black outer border with a
 * thicker, beveled brown/cream double-band for a vintage trading-card feel.
 * Used only when frameStyle === "retro".
 */
import { CARD_H, CARD_W, CORNER_R, FRAME_COLOR_STOPS } from "../tokens";
import type { FrameColor } from "@/types/card";

interface Props {
  color: FrameColor;
}

export function RetroOuterBorder({ color }: Props): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  return (
    <g>
      {/* Drop shadow */}
      <rect x={6} y={10} width={CARD_W - 12} height={CARD_H - 12} rx={CORNER_R} ry={CORNER_R} fill="rgba(0,0,0,0.45)" />

      {/* Outer dark band — slightly thicker than standard */}
      <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={CORNER_R} ry={CORNER_R} fill="#231509" />

      {/* Bevel highlight along top + left edges */}
      <rect
        x={2}
        y={2}
        width={CARD_W - 4}
        height={CARD_H - 4}
        rx={CORNER_R - 2}
        ry={CORNER_R - 2}
        fill="none"
        stroke="rgba(255,210,160,0.12)"
        strokeWidth={1.2}
      />

      {/* Inner thin gold rim wrapped around the inner frame */}
      <rect
        x={14}
        y={14}
        width={CARD_W - 28}
        height={CARD_H - 28}
        rx={CORNER_R - 8}
        ry={CORNER_R - 8}
        fill={stops.plate}
      />
      <rect
        x={14}
        y={14}
        width={CARD_W - 28}
        height={CARD_H - 28}
        rx={CORNER_R - 8}
        ry={CORNER_R - 8}
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={1.2}
      />
    </g>
  );
}
