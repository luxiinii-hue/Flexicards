/**
 * Decorative cog wheel. Pure geometry — used as a background ornament in
 * panels and the preview area. The size, tooth count and tint are tunable.
 */
import { CSSProperties } from "react";

interface GearProps {
  size?: number;
  teeth?: number;
  color?: string;
  opacity?: number;
  spin?: number;
  style?: CSSProperties;
  className?: string;
}

export function Gear({
  size = 64,
  teeth = 12,
  color = "#d9b266",
  opacity = 0.55,
  spin = 0,
  style,
  className,
}: GearProps): JSX.Element {
  const r = size / 2;
  const inner = r * 0.55;
  const toothL = r * 0.18;
  const toothW = (Math.PI * 2 * r) / (teeth * 2.4);
  const toothArr = Array.from({ length: teeth }).map((_, i) => {
    const a = (i / teeth) * 360;
    return (
      <rect
        key={i}
        x={r - toothW / 2}
        y={2}
        width={toothW}
        height={toothL}
        rx={1.5}
        fill={color}
        transform={`rotate(${a} ${r} ${r})`}
      />
    );
  });
  const spokes = Array.from({ length: 6 }).map((_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const x1 = r + Math.cos(a) * inner * 0.6;
    const y1 = r + Math.sin(a) * inner * 0.6;
    const x2 = r + Math.cos(a) * (r - toothL - 3);
    const y2 = r + Math.sin(a) * (r - toothL - 3);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2" />;
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity, ...style, transform: `rotate(${spin}deg)` }}
      className={className}
      aria-hidden
    >
      <g>{toothArr}</g>
      <circle cx={r} cy={r} r={r - toothL - 1} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={r} cy={r} r={inner} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={r} cy={r} r={inner * 0.35} fill={color} />
      {spokes}
    </svg>
  );
}

export function CornerRivets(): JSX.Element {
  return (
    <>
      <span className="ws-rivet" style={{ position: "absolute", top: 6, left: 6, zIndex: 1 }} />
      <span className="ws-rivet" style={{ position: "absolute", top: 6, right: 6, zIndex: 1 }} />
      <span className="ws-rivet" style={{ position: "absolute", bottom: 6, left: 6, zIndex: 1 }} />
      <span className="ws-rivet" style={{ position: "absolute", bottom: 6, right: 6, zIndex: 1 }} />
    </>
  );
}

export function Nameplate({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="ws-nameplate">
      <span className="ws-nameplate-dot" />
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{children}</span>
      {right}
    </div>
  );
}

interface ChipProps {
  children: React.ReactNode;
  glow?: string;
}

export function Chip({ children, glow = "#d9b266" }: ChipProps): JSX.Element {
  return (
    <span className="ws-chip">
      <span className="ws-chip-led" style={{ background: glow, color: glow }} />
      {children}
    </span>
  );
}
