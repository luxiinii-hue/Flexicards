/**
 * Power/Toughness corner panel. A notched rectangle sitting at the bottom-
 * right, overlapping the text box. Same flat-plate treatment as the title
 * and type bars.
 */
import { FRAME_COLOR_STOPS, PT_H, PT_W, PT_X, PT_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface PowerToughnessProps {
  power: string;
  toughness: string;
  color: FrameColor;
}

export function PowerToughness({ power, toughness, color }: PowerToughnessProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f3e7c8" : "#1a1206";

  // Notched chamfer geometry — points walked clockwise from the top-left notch
  const points = `
    ${PT_X + 14},${PT_Y}
    ${PT_X + PT_W},${PT_Y}
    ${PT_X + PT_W},${PT_Y + PT_H}
    ${PT_X},${PT_Y + PT_H}
    ${PT_X},${PT_Y + 14}
  `;

  return (
    <g>
      <polygon points={points} fill={stops.plate} />
      <polygon points={points} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={1.2} />

      <text
        x={PT_X + PT_W / 2 + 1}
        y={PT_Y + PT_H / 2 + 12}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={34}
        textAnchor="middle"
        fill={ink}
        style={{ letterSpacing: "0.5px" }}
      >
        {`${power || "*"}/${toughness || "*"}`}
      </text>
    </g>
  );
}
