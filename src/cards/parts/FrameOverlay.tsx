import type { FrameColor, FrameStyle } from "@/types/card";
import { CARD_H, CARD_W } from "../tokens";

interface FrameOverlayProps {
  color: FrameColor;
  layout: string;
  style: FrameStyle;
}

const FRAME_ASSET: Record<FrameColor, string> = {
  white: "m15FrameW",
  blue: "m15FrameU",
  black: "m15FrameB",
  red: "m15FrameR",
  green: "m15FrameG",
  multicolor: "m15FrameM",
  colorless: "m15FrameA",
  land: "m15FrameL",
};

export function FrameOverlay({ color }: FrameOverlayProps): JSX.Element {
  const assetName = FRAME_ASSET[color] ?? "m15FrameA";
  const href = `${import.meta.env.BASE_URL}frames/${assetName}.png`;

  return (
    <g>
      <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={30} ry={30} fill="#1a1a1a" />
      <image
        href={href}
        xlinkHref={href}
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
