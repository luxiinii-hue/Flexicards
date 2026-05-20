/**
 * Holographic stamp for rare+/mythic/special cards. Drawn as a small oval at
 * the bottom edge of the text box, with a radial sheen and a rarity-tinted
 * gradient. The stamp uses generic holographic-foil visual cues (radial
 * shine, soft prismatic gradient) and is independent of any specific
 * trademarked stamp design.
 */
import { TEXT_W, TEXT_X, TEXT_Y, TEXT_H } from "../tokens";
import type { Rarity } from "@/types/card";

interface HolostampProps {
  rarity: Rarity;
  /** Override placement. By default sits at the bottom-center of the text box. */
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}

export function Holostamp({
  rarity,
  cx = TEXT_X + TEXT_W / 2,
  cy = TEXT_Y + TEXT_H - 22,
  rx = 38,
  ry = 14,
}: HolostampProps): JSX.Element | null {
  if (rarity === "common") return null;
  const id = `holo-${rarity}-${cx}-${cy}`;
  const tint = TINT[rarity];

  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id={`${id}-bg`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={tint.bright} />
          <stop offset="50%" stopColor={tint.mid} />
          <stop offset="100%" stopColor={tint.dark} />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
      </defs>
      <ellipse cx={cx + 1} cy={cy + 1} rx={rx} ry={ry} fill="rgba(0,0,0,0.35)" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-bg)`} stroke={tint.rim} strokeWidth={0.8} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-sheen)`} />
      <ellipse cx={cx} cy={cy - ry * 0.55} rx={rx * 0.7} ry={ry * 0.35} fill="rgba(255,255,255,0.35)" />
    </g>
  );
}

const TINT: Record<Exclude<Rarity, "common">, { bright: string; mid: string; dark: string; rim: string }> = {
  uncommon: { bright: "#f6f8fa", mid: "#a8b3bc", dark: "#41494f", rim: "#1c2226" },
  rare:     { bright: "#fff3c1", mid: "#e3c074", dark: "#7b5614", rim: "#2c1d04" },
  mythic:   { bright: "#ffd6a8", mid: "#e6803a", dark: "#742a06", rim: "#290e02" },
  special:  { bright: "#f0c0ff", mid: "#a460c4", dark: "#3a1454", rim: "#180623" },
};
