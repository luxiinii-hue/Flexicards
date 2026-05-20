/**
 * Art window. Renders the user's uploaded image clipped to the art rectangle
 * with a subtle inner shadow for depth. When no art is uploaded a placeholder
 * crosshair pattern is shown.
 */
import { ART_H, ART_W, ART_X, ART_Y, FRAME_RIM_STOPS } from "../tokens";
import type { FrameColor } from "@/types/card";

interface ArtBoxProps {
  /** Object URL or data URL pointing to the uploaded art image. */
  imageHref?: string;
  color: FrameColor;
  /** Optional clip ID — caller can re-use a clip for layered elements. */
  clipId?: string;
}

export function ArtBox({ imageHref, color, clipId = "art-clip" }: ArtBoxProps): JSX.Element {
  const rim = FRAME_RIM_STOPS[color];
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={ART_X} y={ART_Y} width={ART_W} height={ART_H} rx={4} ry={4} />
        </clipPath>
        <linearGradient id="art-rim-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={rim.top} />
          <stop offset="100%" stopColor={rim.bottom} />
        </linearGradient>
        <linearGradient id="art-placeholder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a22" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
      </defs>

      {/* Rim (thicker, darker border around the art) */}
      <rect
        x={ART_X - 6}
        y={ART_Y - 6}
        width={ART_W + 12}
        height={ART_H + 12}
        rx={10}
        ry={10}
        fill="url(#art-rim-gradient)"
      />
      {/* Rim highlight */}
      <rect
        x={ART_X - 5}
        y={ART_Y - 5}
        width={ART_W + 10}
        height={ART_H + 10}
        rx={9}
        ry={9}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1}
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
            <rect
              x={ART_X}
              y={ART_Y}
              width={ART_W}
              height={ART_H}
              fill="url(#art-placeholder)"
            />
            <ArtPlaceholder />
          </>
        )}

        {/* Inner shadow on the art window */}
        <rect
          x={ART_X}
          y={ART_Y}
          width={ART_W}
          height={ART_H}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth={2}
        />
      </g>
    </g>
  );
}

function ArtPlaceholder(): JSX.Element {
  // Subtle "no art yet" marker — concentric diamonds
  const cx = ART_X + ART_W / 2;
  const cy = ART_Y + ART_H / 2;
  return (
    <g opacity={0.18} stroke="#cfcad8" fill="none" strokeWidth={2}>
      <path d={`M ${cx} ${cy - 80} L ${cx + 60} ${cy} L ${cx} ${cy + 80} L ${cx - 60} ${cy} Z`} />
      <path d={`M ${cx} ${cy - 50} L ${cx + 38} ${cy} L ${cx} ${cy + 50} L ${cx - 38} ${cy} Z`} />
      <text
        x={cx}
        y={cy + 140}
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={22}
        fill="#bcb7c5"
        opacity={0.6}
      >
        No art uploaded
      </text>
    </g>
  );
}
