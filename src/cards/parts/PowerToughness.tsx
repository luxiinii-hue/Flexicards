/**
 * Power/Toughness corner plate at the bottom-right of the card. A notched
 * polygon with a beveled, slightly recessed appearance.
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
  const gradId = `pt-grad-${color}`;
  const rimId = `pt-rim-${color}`;
  const sheenId = `pt-sheen-${color}`;

  // Notched chamfer geometry — points walked clockwise from the top-left notch
  const points = `
    ${PT_X + 16},${PT_Y}
    ${PT_X + PT_W},${PT_Y}
    ${PT_X + PT_W},${PT_Y + PT_H}
    ${PT_X},${PT_Y + PT_H}
    ${PT_X},${PT_Y + 16}
  `;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} />
          <stop offset="55%" stopColor={stops.mid} />
          <stop offset="100%" stopColor={stops.bottom} />
        </linearGradient>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={rim.top} />
          <stop offset="100%" stopColor={rim.bottom} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <polygon
        points={`
          ${PT_X + 17},${PT_Y + 3}
          ${PT_X + PT_W + 2},${PT_Y + 3}
          ${PT_X + PT_W + 2},${PT_Y + PT_H + 3}
          ${PT_X + 2},${PT_Y + PT_H + 3}
          ${PT_X + 2},${PT_Y + 18}
        `}
        fill="rgba(0,0,0,0.4)"
      />

      {/* Outer rim */}
      <polygon points={points} fill={`url(#${rimId})`} />
      {/* Body */}
      <polygon
        points={`
          ${PT_X + 18},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + 18}
        `}
        fill={`url(#${gradId})`}
      />
      {/* Sheen */}
      <polygon
        points={`
          ${PT_X + 18},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + 2}
          ${PT_X + PT_W - 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + PT_H - 2}
          ${PT_X + 2},${PT_Y + 18}
        `}
        fill={`url(#${sheenId})`}
      />
      {/* Inner bevel highlight */}
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
        strokeWidth={1.1}
      />

      <text
        x={PT_X + PT_W / 2 + 2}
        y={PT_Y + PT_H / 2 + 14}
        fontFamily="'Source Sans 3', 'Helvetica Neue', system-ui, sans-serif"
        fontWeight={800}
        fontSize={38}
        textAnchor="middle"
        fill={ink}
        style={{ paintOrder: "stroke", letterSpacing: "1px" }}
        stroke={isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)"}
        strokeWidth={0.6}
      >
        {`${power || "*"}/${toughness || "*"}`}
      </text>
    </g>
  );
}
