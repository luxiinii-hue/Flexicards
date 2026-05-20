/**
 * Planeswalker starting-loyalty shield — dark pentagonal shield with a
 * single highlighted border and a large numeral.
 */
import { LOYALTY_SIZE, LOYALTY_X, LOYALTY_Y } from "../tokens";

interface LoyaltyBadgeProps {
  loyalty: number;
  x?: number;
  y?: number;
  size?: number;
}

export function LoyaltyBadge({
  loyalty,
  x = LOYALTY_X,
  y = LOYALTY_Y,
  size = LOYALTY_SIZE,
}: LoyaltyBadgeProps): JSX.Element {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  const path = `
    M ${cx} ${cy - r}
    L ${cx + r * 0.85} ${cy - r * 0.35}
    L ${cx + r * 0.55} ${cy + r}
    L ${cx - r * 0.55} ${cy + r}
    L ${cx - r * 0.85} ${cy - r * 0.35}
    Z
  `;

  return (
    <g>
      <path d={path} fill="#0e0a06" stroke="rgba(0,0,0,0.85)" strokeWidth={1.2} />
      <path
        d={`
          M ${cx} ${cy - r + 4}
          L ${cx + r * 0.78} ${cy - r * 0.3}
          L ${cx + r * 0.5} ${cy + r - 4}
          L ${cx - r * 0.5} ${cy + r - 4}
          L ${cx - r * 0.78} ${cy - r * 0.3}
          Z
        `}
        fill="none"
        stroke="rgba(255,220,160,0.35)"
        strokeWidth={1}
      />

      <text
        x={cx}
        y={cy + 14}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={38}
        textAnchor="middle"
        fill="#f3e7c8"
      >
        {loyalty}
      </text>
    </g>
  );
}
