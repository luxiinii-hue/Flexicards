import { PT_H, PT_W, PT_X, PT_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface PowerToughnessProps {
  power: string;
  toughness: string;
  color: FrameColor;
}

const PT_ASSET: Record<FrameColor, string> = {
  white: "m15PTW",
  blue: "m15PTU",
  black: "m15PTB",
  red: "m15PTR",
  green: "m15PTG",
  multicolor: "m15PTM",
  colorless: "m15PTC",
  land: "m15PTC",
};

export function PowerToughness({ power, toughness, color }: PowerToughnessProps): JSX.Element {
  const isDark = color === "black" || color === "blue" || color === "red";
  const ink = isDark ? "#f4ecd6" : "#0a0604";
  const badgeHref = `${import.meta.env.BASE_URL}frames/${PT_ASSET[color] ?? "m15PTC"}.png`;

  return (
    <g>
      <image
        href={badgeHref}
        xlinkHref={badgeHref}
        x={PT_X}
        y={PT_Y}
        width={PT_W}
        height={PT_H}
        preserveAspectRatio="xMidYMid meet"
      />
      <text
        x={PT_X + PT_W / 2 + 6}
        y={PT_Y + PT_H / 2 + 14}
        fontFamily="'Beleren', 'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={32}
        textAnchor="middle"
        fill={ink}
        style={{ letterSpacing: "0.5px" }}
      >
        {`${power || "*"}/${toughness || "*"}`}
      </text>
    </g>
  );
}
