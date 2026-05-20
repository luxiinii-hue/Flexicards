import { PT_H, PT_W, PT_X, PT_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface PowerToughnessProps {
  power: string;
  toughness: string;
  color: FrameColor;
}

export function PowerToughness({ power, toughness, color }: PowerToughnessProps): JSX.Element {
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#ffffff" : "#000000";

  return (
    <g>
      <text
        x={PT_X + PT_W / 2 + 1}
        y={PT_Y + PT_H / 2 + 12}
        fontFamily="'Beleren', 'Cinzel', Georgia, serif"
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
