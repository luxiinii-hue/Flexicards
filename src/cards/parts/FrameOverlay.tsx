import type { FrameColor, FrameStyle } from "@/types/card";
import { CARD_H, CARD_W } from "../tokens";

interface FrameOverlayProps {
  color: FrameColor;
  layout: string;
  style: FrameStyle;
}

export function FrameOverlay({ color, layout, style }: FrameOverlayProps): JSX.Element {
  // Map color/layout to a standard frame filename
  // e.g. /frames/normal-standard-w.png
  
  // Basic color mapping
  const colorMap: Record<FrameColor, string> = {
    white: "w",
    blue: "u",
    black: "b",
    red: "r",
    green: "g",
    multicolor: "m",
    colorless: "c",
    land: "l",
  };

  const code = colorMap[color] || "c";
  const filename = `/frames/${layout}-${style}-${code}.png`;

  return (
    <g>
      {/* Fallback dark background so it's not totally transparent if the image is missing */}
      <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={30} ry={30} fill="#1a1a1a" />
      <image
        href={filename}
        x={0}
        y={0}
        width={CARD_W}
        height={CARD_H}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#card-corners)"
      />
    </g>
  );
}
