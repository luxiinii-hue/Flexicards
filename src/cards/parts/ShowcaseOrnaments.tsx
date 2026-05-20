/**
 * Decorative geometric flourishes overlaid on the Showcase frame variant.
 * Four corner ornaments + a thin gold inner rim. Pure original SVG geometry
 * (filigree-style scrollwork is hand-built, not traced from any reference).
 */
import { BORDER, CARD_H, CARD_W, INNER_CORNER_R } from "../tokens";

const GOLD_LIGHT = "#f3d99a";
const GOLD_DARK = "#8d6627";

export function ShowcaseOrnaments(): JSX.Element {
  const x = BORDER;
  const y = BORDER;
  const w = CARD_W - 2 * BORDER;
  const h = CARD_H - 2 * BORDER;
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id="showcase-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="50%" stopColor={GOLD_DARK} />
          <stop offset="100%" stopColor={GOLD_LIGHT} />
        </linearGradient>
      </defs>

      {/* Thin gold inner rim */}
      <rect
        x={x + 4}
        y={y + 4}
        width={w - 8}
        height={h - 8}
        rx={INNER_CORNER_R - 4}
        ry={INNER_CORNER_R - 4}
        fill="none"
        stroke="url(#showcase-rim-grad)"
        strokeWidth={1.2}
        opacity={0.85}
      />

      {/* Corner flourishes — geometric scrollwork */}
      <CornerFlourish x={x + 4} y={y + 4} flip="tl" />
      <CornerFlourish x={x + w - 4} y={y + 4} flip="tr" />
      <CornerFlourish x={x + 4} y={y + h - 4} flip="bl" />
      <CornerFlourish x={x + w - 4} y={y + h - 4} flip="br" />
    </g>
  );
}

interface CornerProps {
  x: number;
  y: number;
  flip: "tl" | "tr" | "bl" | "br";
}

function CornerFlourish({ x, y, flip }: CornerProps): JSX.Element {
  // Geometric corner: a quarter-circle inside, two diagonal whiskers
  const sx = flip === "tr" || flip === "br" ? -1 : 1;
  const sy = flip === "bl" || flip === "br" ? -1 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${sx} ${sy})`}>
      {/* Quarter arc */}
      <path
        d="M 4 28 A 24 24 0 0 1 28 4"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth={1.4}
        opacity={0.9}
      />
      {/* Inner accent line */}
      <path
        d="M 9 32 A 22 22 0 0 1 32 9"
        fill="none"
        stroke={GOLD_DARK}
        strokeWidth={0.8}
        opacity={0.7}
      />
      {/* Diagonal whisker out from the corner */}
      <line x1={6} y1={6} x2={20} y2={20} stroke={GOLD_LIGHT} strokeWidth={1.2} />
      {/* Small ornamental dot */}
      <circle cx={20} cy={20} r={2.4} fill={GOLD_LIGHT} stroke={GOLD_DARK} strokeWidth={0.5} />
      {/* Tiny inward fleur shape */}
      <path
        d="M 14 4 L 16 8 L 14 12 L 12 8 Z"
        fill={GOLD_LIGHT}
        opacity={0.85}
        transform="translate(8 0)"
      />
      <path
        d="M 14 4 L 16 8 L 14 12 L 12 8 Z"
        fill={GOLD_LIGHT}
        opacity={0.85}
        transform="translate(0 8) rotate(90 14 8)"
      />
    </g>
  );
}
