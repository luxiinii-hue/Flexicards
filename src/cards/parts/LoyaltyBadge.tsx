/**
 * Starting-loyalty shield for planeswalkers. Stamped dark shield with a
 * radial-gradient interior, embossed border and stylized large numeral.
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
  const id = `loyalty-${cx}-${cy}`;

  const path = `
    M ${cx} ${cy - r}
    L ${cx + r * 0.88} ${cy - r * 0.4}
    L ${cx + r * 0.55} ${cy + r}
    L ${cx - r * 0.55} ${cy + r}
    L ${cx - r * 0.88} ${cy - r * 0.4}
    Z
  `;

  return (
    <g>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3b2e21" />
          <stop offset="60%" stopColor="#1c1410" />
          <stop offset="100%" stopColor="#0a0606" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,220,160,0.35)" />
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <path d={path} fill="rgba(0,0,0,0.45)" transform={`translate(2 3)`} />
      {/* Shield body */}
      <path d={path} fill={`url(#${id}-bg)`} stroke="#f1e2c0" strokeWidth={1.6} />
      {/* Inner emboss line */}
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
        stroke="rgba(255,220,160,0.32)"
        strokeWidth={1}
      />
      {/* Sheen on the top half */}
      <path d={path} fill={`url(#${id}-sheen)`} />

      {/* Loyalty numeral */}
      <text
        x={cx}
        y={cy + 16}
        fontFamily="'Source Sans 3', 'Helvetica Neue', system-ui, sans-serif"
        fontWeight={800}
        fontSize={40}
        textAnchor="middle"
        fill="#f5efe1"
        style={{ paintOrder: "stroke" }}
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={0.8}
      >
        {loyalty}
      </text>
    </g>
  );
}
