/**
 * Planeswalker starting-loyalty shield. Rendered as a dark pentagon-like shield
 * with a bold number.
 */
import { LOYALTY_SIZE, LOYALTY_X, LOYALTY_Y } from "../tokens";

interface LoyaltyBadgeProps {
  loyalty: number;
  /** Override position for layouts that don't want the default bottom-right placement. */
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
  return (
    <g>
      <defs>
        <linearGradient id="loyalty-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2017" />
          <stop offset="100%" stopColor="#0c0907" />
        </linearGradient>
      </defs>
      {/* Shield silhouette */}
      <path
        d={`
          M ${cx} ${cy - r}
          L ${cx + r * 0.88} ${cy - r * 0.4}
          L ${cx + r * 0.55} ${cy + r}
          L ${cx - r * 0.55} ${cy + r}
          L ${cx - r * 0.88} ${cy - r * 0.4}
          Z
        `}
        fill="url(#loyalty-gradient)"
        stroke="#f3eee5"
        strokeWidth={1.2}
      />
      <path
        d={`
          M ${cx} ${cy - r + 4}
          L ${cx + r * 0.82} ${cy - r * 0.35}
          L ${cx + r * 0.5} ${cy + r - 4}
          L ${cx - r * 0.5} ${cy + r - 4}
          L ${cx - r * 0.82} ${cy - r * 0.35}
          Z
        `}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy + 14}
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontWeight={700}
        fontSize={38}
        textAnchor="middle"
        fill="#f5efe1"
      >
        {loyalty}
      </text>
    </g>
  );
}
