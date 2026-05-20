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
  style,
  className,
}: GearProps): JSX.Element {
  // Return an empty SVG or a placeholder icon, since we are moving away from gears.
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ ...style }}
      className={className}
      aria-hidden
    >
      <circle cx={size / 2} cy={size / 2} r={size / 3} fill="none" stroke="currentColor" strokeWidth="2" opacity={0.2} />
      <circle cx={size / 2} cy={size / 2} r={size / 5} fill="currentColor" opacity={0.2} />
    </svg>
  );
}

export function CornerRivets(): JSX.Element | null {
  return null;
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

export function Chip({ children, glow = "#ea580c" }: ChipProps): JSX.Element {
  return (
    <span className="ws-chip">
      <span className="ws-chip-led" style={{ background: glow, color: glow }} />
      {children}
    </span>
  );
}
