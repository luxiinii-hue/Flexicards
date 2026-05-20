/**
 * Art window. The image is clipped to a rounded rectangle and inset into a
 * darker rim that "wraps" the art into the colored frame band, giving the
 * art window a recessed, beveled appearance.
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
          <stop offset="0%" stopColor="#1c1c26" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
      </defs>

      {/* Outer rim (thicker, darker) — recessed look */}
      <rect
        x={ART_X - 8}
        y={ART_Y - 8}
        width={ART_W + 16}
        height={ART_H + 16}
        rx={12}
        ry={12}
        fill="url(#art-rim-gradient)"
      />
      {/* Bevel highlight on the rim (top edge) */}
      <rect
        x={ART_X - 7}
        y={ART_Y - 7}
        width={ART_W + 14}
        height={ART_H + 14}
        rx={11}
        ry={11}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
      />
      {/* Inner rim shadow (just outside the art) */}
      <rect
        x={ART_X - 3}
        y={ART_Y - 3}
        width={ART_W + 6}
        height={ART_H + 6}
        rx={6}
        ry={6}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1.4}
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
            <rect x={ART_X} y={ART_Y} width={ART_W} height={ART_H} fill="url(#art-placeholder)" />
            <ArtPlaceholder />
          </>
        )}

        {/* Soft inner vignette on the art window for depth */}
        <rect
          x={ART_X}
          y={ART_Y}
          width={ART_W}
          height={ART_H}
          fill="url(#art-inner-vignette)"
          pointerEvents="none"
        />
      </g>

      <defs>
        <radialGradient id="art-inner-vignette" cx="50%" cy="50%" r="65%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </radialGradient>
      </defs>
    </g>
  );
}

function ArtPlaceholder(): JSX.Element {
  // Subtle "no art yet" marker — concentric diamonds
  const cx = ART_X + ART_W / 2;
  const cy = ART_Y + ART_H / 2;
  return (
    <g opacity={0.2} stroke="#cfcad8" fill="none" strokeWidth={2}>
      <path d={`M ${cx} ${cy - 90} L ${cx + 70} ${cy} L ${cx} ${cy + 90} L ${cx - 70} ${cy} Z`} />
      <path d={`M ${cx} ${cy - 56} L ${cx + 44} ${cy} L ${cx} ${cy + 56} L ${cx - 44} ${cy} Z`} />
      <path d={`M ${cx} ${cy - 24} L ${cx + 20} ${cy} L ${cx} ${cy + 24} L ${cx - 20} ${cy} Z`} fill="#cfcad8" opacity="0.18" />
      <text
        x={cx}
        y={cy + 150}
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={22}
        fill="#bcb7c5"
        opacity={0.65}
      >
        Upload art
      </text>
    </g>
  );
}
