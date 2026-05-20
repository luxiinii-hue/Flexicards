/**
 * Power/Toughness diamond at the bottom-right of the card. Rendered as a
 * notched rectangle in the frame color with bold sans-serif stats.
 */
import { FRAME_COLOR_STOPS, FRAME_RIM_STOPS, PT_H, PT_W, PT_X, PT_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface PowerToughnessProps {
  power: string;
  toughness: string;
  color: FrameColor;
}

export function PowerToughness({ power, toughness, color }: PowerToughnessProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const rim = FRAME_RIM_STOPS[color];
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f5efe1" : "#15110a";
  return (
    <g>
      <defs>
        <linearGradient id="pt-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} />
          <stop offset="100%" stopColor={stops.bottom} />
        </linearGradient>
        <linearGradient id="pt-rim-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={rim.top} />
          <stop offset="100%" stopColor={rim.bottom} />
        </linearGradient>
      </defs>

      {/* Notched chamfer effect via a polygon */}
      <polygon
        points={`
          ${PT_X + 16},${PT_Y}
          ${PT_X + PT_W},${PT_Y}
          ${PT_X + PT_W},${PT_Y + PT_H}
          ${PT_X},${PT_Y + PT_H}
          ${PT_X},${PT_Y + 16}
        `}
        fill="url(#pt-rim-gradient)"
      />
      <polygon
        points={`
          ${PT_X + 18},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + 18}
        `}
        fill="url(#pt-gradient)"
      />
      <polygon
        points={`
          ${PT_X + 19},${PT_Y + 3}
          ${PT_X + PT_W - 3},${PT_Y + 3}
          ${PT_X + PT_W - 3},${PT_Y + PT_H - 3}
          ${PT_X + 3},${PT_Y + PT_H - 3}
          ${PT_X + 3},${PT_Y + 19}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />

      <text
        x={PT_X + PT_W / 2 + 2}
        y={PT_Y + PT_H / 2 + 14}
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontWeight={700}
        fontSize={36}
        textAnchor="middle"
        fill={ink}
      >
        {`${power || "*"}/${toughness || "*"}`}
      </text>
    </g>
  );
}
