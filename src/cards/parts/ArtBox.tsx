/**
 * Art window. The user's uploaded image is clipped to a rectangle that sits
 * inside the color frame with a single thin dark border around it (the
 * black inset that real cards have between the colored frame and the art).
 */
import { ART_H, ART_W, ART_X, ART_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface ArtBoxProps {
  imageHref?: string;
  color: FrameColor;
  clipId?: string;
}

export function ArtBox({ imageHref, clipId = "art-clip" }: ArtBoxProps): JSX.Element {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={ART_X} y={ART_Y} width={ART_W} height={ART_H} />
        </clipPath>
        <linearGradient id="art-placeholder-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1c24" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
      </defs>

      {/* Dark inset border that frames the art — single thin band */}
      <rect
        x={ART_X - 2}
        y={ART_Y - 2}
        width={ART_W + 4}
        height={ART_H + 4}
        fill="#080706"
      />

      {/* Art content */}
      <g clipPath={`url(#${clipId})`}>
        {imageHref ? (
          <image
            href={imageHref}
            xlinkHref={imageHref}
            x={ART_X}
            y={ART_Y}
            width={ART_W}
            height={ART_H}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <>
            <rect x={ART_X} y={ART_Y} width={ART_W} height={ART_H} fill="url(#art-placeholder-bg)" />
            <ArtPlaceholder />
          </>
        )}
      </g>
    </g>
  );
}

function ArtPlaceholder(): JSX.Element {
  const cx = ART_X + ART_W / 2;
  const cy = ART_Y + ART_H / 2;
  return (
    <g opacity={0.18} stroke="#bcb7c5" fill="none" strokeWidth={1.6}>
      <path d={`M ${cx} ${cy - 78} L ${cx + 60} ${cy} L ${cx} ${cy + 78} L ${cx - 60} ${cy} Z`} />
      <path d={`M ${cx} ${cy - 48} L ${cx + 38} ${cy} L ${cx} ${cy + 48} L ${cx - 38} ${cy} Z`} />
      <text
        x={cx}
        y={cy + 130}
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={20}
        fill="#bcb7c5"
        opacity={0.7}
      >
        Upload art
      </text>
    </g>
  );
}
