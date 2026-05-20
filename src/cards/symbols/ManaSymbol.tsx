/**
 * Inline SVG mana symbols. Each renders into a 100×100 viewport (so callers can
 * scale freely with width/height). The component returns a <g> so it can be
 * embedded into any parent SVG.
 *
 * The visual language is intentionally simple — flat colored circles with a
 * 1px outline and a stylized glyph in dark ink. Polish-pass can swap in
 * higher-fidelity glyphs from the mana-font sources later.
 */
import { type ReactNode } from "react";
import { type ManaToken, parseManaCost } from "../manaCost";
import { MANA_BG, MANA_INK, colorForLetter } from "./manaColors";

const STROKE = "#1a1916";

interface PipProps {
  bg: string;
  shadow?: string;
}

function Pip({ bg, shadow, children }: PipProps & { children?: ReactNode }) {
  return (
    <g>
      <defs>
        <radialGradient id="pip-gloss" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={shadow ?? "rgba(0,0,0,0.25)"} />
      <circle cx="50" cy="50" r="45" fill={bg} stroke={STROKE} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="44" fill="url(#pip-gloss)" />
      {children}
    </g>
  );
}

function GlyphW() {
  // Stylized sun: small circle + 8 wedge rays
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i;
    const x1 = 50 + Math.cos(a) * 16;
    const y1 = 50 + Math.sin(a) * 16;
    const x2 = 50 + Math.cos(a) * 28;
    const y2 = 50 + Math.sin(a) * 28;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={MANA_INK.w!} strokeWidth="5" strokeLinecap="round" />;
  });
  return (
    <g>
      {rays}
      <circle cx="50" cy="50" r="13" fill="none" stroke={MANA_INK.w!} strokeWidth="4" />
    </g>
  );
}

function GlyphU() {
  // Water drop
  return (
    <path
      d="M50 19 C 64 38, 76 50, 76 62 A 26 26 0 0 1 24 62 C 24 50, 36 38, 50 19 Z"
      fill={MANA_INK.u!}
    />
  );
}

function GlyphB() {
  // Stylized skull (simplified): oval head + two eye sockets + jaw notch
  return (
    <g fill={MANA_INK.b!}>
      <path d="M50 22 C 67 22, 78 36, 78 50 C 78 60, 71 67, 64 70 L 64 78 L 56 78 L 56 73 L 44 73 L 44 78 L 36 78 L 36 70 C 29 67, 22 60, 22 50 C 22 36, 33 22, 50 22 Z" />
      <circle cx="40" cy="50" r="6" fill={MANA_BG.b!} />
      <circle cx="60" cy="50" r="6" fill={MANA_BG.b!} />
      <rect x="46" y="62" width="8" height="6" fill={MANA_BG.b!} />
    </g>
  );
}

function GlyphR() {
  // Flame
  return (
    <path
      d="M50 18 C 58 30, 62 38, 62 46 C 62 50, 60 54, 56 56 C 60 58, 64 62, 64 68 C 64 78, 56 84, 50 84 C 44 84, 36 78, 36 68 C 36 62, 40 58, 44 56 C 40 54, 38 50, 38 46 C 38 38, 42 30, 50 18 Z"
      fill={MANA_INK.r!}
    />
  );
}

function GlyphG() {
  // Tree silhouette (cap + trunk)
  return (
    <g fill={MANA_INK.g!}>
      <path d="M50 20 C 70 32, 76 50, 64 60 C 76 60, 74 76, 56 76 L 56 84 L 44 84 L 44 76 C 26 76, 24 60, 36 60 C 24 50, 30 32, 50 20 Z" />
    </g>
  );
}

function GlyphC() {
  // Colorless: stylized diamond
  return (
    <path d="M50 20 L 78 50 L 50 80 L 22 50 Z" fill={MANA_INK.c!} />
  );
}

function GlyphS() {
  // Snowflake (6 spokes + center)
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    const x = 50 + Math.cos(a) * 28;
    const y = 50 + Math.sin(a) * 28;
    return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={MANA_INK.s!} strokeWidth="5" strokeLinecap="round" />;
  });
  return <g>{spokes}<circle cx="50" cy="50" r="5" fill={MANA_INK.s!} /></g>;
}

function GlyphPhyrexian() {
  // Phyrexian Φ: vertical line through a stylized circle with notch
  return (
    <g fill="none" stroke={MANA_INK.p!} strokeWidth="6">
      <path d="M50 20 L 50 80" />
      <path d="M30 50 C 30 36, 42 28, 50 28 C 58 28, 70 36, 70 50 C 70 64, 58 72, 50 72 C 42 72, 30 64, 30 50 Z" />
    </g>
  );
}

function GlyphTap() {
  // Tap arrow (clockwise 90°)
  return (
    <g fill={MANA_INK.c!}>
      <path d="M28 30 A 28 28 0 1 1 28 70 L 32 64 A 22 22 0 1 0 32 36 Z" />
      <path d="M22 26 L 38 22 L 34 38 Z" />
    </g>
  );
}

function GlyphUntap() {
  return (
    <g fill={MANA_INK.c!} transform="scale(-1 1) translate(-100 0)">
      <path d="M28 30 A 28 28 0 1 1 28 70 L 32 64 A 22 22 0 1 0 32 36 Z" />
      <path d="M22 26 L 38 22 L 34 38 Z" />
    </g>
  );
}

function GlyphEnergy() {
  // Lightning bolt
  return (
    <path d="M56 18 L 30 56 L 46 56 L 36 84 L 70 42 L 52 42 L 60 18 Z" fill={MANA_INK.c!} />
  );
}

function GlyphNumber(num: string) {
  // Numeric generic mana — show the digit(s) in heavy serif
  return (
    <text
      x="50"
      y="69"
      textAnchor="middle"
      fontFamily="'Cinzel', Georgia, serif"
      fontWeight="700"
      fontSize={num.length >= 2 ? 42 : 52}
      fill={MANA_INK.generic!}
    >
      {num}
    </text>
  );
}

function GlyphLetter(letter: string) {
  return (
    <text
      x="50"
      y="70"
      textAnchor="middle"
      fontFamily="'Cinzel', Georgia, serif"
      fontWeight="700"
      fontSize="56"
      fill={MANA_INK.generic!}
    >
      {letter}
    </text>
  );
}

const GLYPHS: Record<string, () => JSX.Element> = {
  w: GlyphW,
  u: GlyphU,
  b: GlyphB,
  r: GlyphR,
  g: GlyphG,
  c: GlyphC,
  s: GlyphS,
  tap: GlyphTap,
  untap: GlyphUntap,
  e: GlyphEnergy,
};

/** Render a hybrid pip — half-and-half background with both glyphs. */
function HybridPip({ a, b }: { a: string; b: string }) {
  const aBg = MANA_BG[a] ?? MANA_BG.generic!;
  const bBg = MANA_BG[b] ?? MANA_BG.generic!;
  const clipIdA = `hyb-clip-a-${a}-${b}`;
  const clipIdB = `hyb-clip-b-${a}-${b}`;
  const A = GLYPHS[a];
  const B = GLYPHS[b];
  return (
    <g>
      <defs>
        <clipPath id={clipIdA}>
          <path d="M5 50 A 45 45 0 0 1 95 50 L 5 50 Z" />
        </clipPath>
        <clipPath id={clipIdB}>
          <path d="M95 50 A 45 45 0 0 1 5 50 L 95 50 Z" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="rgba(0,0,0,0.25)" />
      <g clipPath={`url(#${clipIdA})`}>
        <rect x="0" y="0" width="100" height="100" fill={aBg} />
      </g>
      <g clipPath={`url(#${clipIdB})`}>
        <rect x="0" y="0" width="100" height="100" fill={bBg} />
      </g>
      <circle cx="50" cy="50" r="45" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <g transform="translate(-12 -10) scale(0.6)">{A ? <A /> : null}</g>
      <g transform="translate(28 30) scale(0.6)">{B ? <B /> : null}</g>
    </g>
  );
}

/** Render a 2/W style hybrid (generic-or-color). */
function HybridGenericPip({ digit, color }: { digit: string; color: string }) {
  const cBg = MANA_BG[color] ?? MANA_BG.generic!;
  const clipIdA = `hyb2-a-${digit}-${color}`;
  const clipIdB = `hyb2-b-${digit}-${color}`;
  const C = GLYPHS[color];
  return (
    <g>
      <defs>
        <clipPath id={clipIdA}>
          <path d="M5 50 A 45 45 0 0 1 95 50 L 5 50 Z" />
        </clipPath>
        <clipPath id={clipIdB}>
          <path d="M95 50 A 45 45 0 0 1 5 50 L 95 50 Z" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="rgba(0,0,0,0.25)" />
      <g clipPath={`url(#${clipIdA})`}>
        <rect x="0" y="0" width="100" height="100" fill={MANA_BG.generic!} />
      </g>
      <g clipPath={`url(#${clipIdB})`}>
        <rect x="0" y="0" width="100" height="100" fill={cBg} />
      </g>
      <circle cx="50" cy="50" r="45" fill="none" stroke={STROKE} strokeWidth="1.5" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight="700"
        fontSize="28"
        fill={MANA_INK.generic!}
      >
        {digit}
      </text>
      <g transform="translate(28 30) scale(0.6)">{C ? <C /> : null}</g>
    </g>
  );
}

export interface ManaSymbolProps {
  /** SVG x position. */
  x?: number;
  /** SVG y position. */
  y?: number;
  /** Pip diameter in the parent SVG's coordinate units. */
  size?: number;
  /** Parsed mana token. */
  token: ManaToken;
}

/**
 * Renders a single mana pip inside a parent SVG at (x,y) with the requested size.
 * The pip is drawn in a 100×100 viewport and scaled to size.
 */
export function ManaSymbol({ x = 0, y = 0, size = 50, token }: ManaSymbolProps): JSX.Element {
  const scale = size / 100;
  const content = renderTokenContent(token);
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>{content}</g>
  );
}

function renderTokenContent(token: ManaToken): JSX.Element {
  if (token.kind === "color") {
    const Glyph = GLYPHS[token.manaClass];
    return (
      <Pip bg={colorForLetter(token.manaClass)}>
        {Glyph ? <Glyph /> : null}
      </Pip>
    );
  }
  if (token.kind === "colorless") {
    return <Pip bg={MANA_BG.c!}><GlyphC /></Pip>;
  }
  if (token.kind === "generic") {
    return <Pip bg={MANA_BG.generic!}>{GlyphNumber(token.manaClass)}</Pip>;
  }
  if (token.kind === "x") {
    return <Pip bg={MANA_BG.generic!}>{GlyphLetter(token.manaClass.toUpperCase())}</Pip>;
  }
  if (token.kind === "snow") {
    return <Pip bg={MANA_BG.s!}><GlyphS /></Pip>;
  }
  if (token.kind === "phyrexian") {
    return <Pip bg={MANA_BG.p!}><GlyphPhyrexian /></Pip>;
  }
  if (token.kind === "tap") return <Pip bg={MANA_BG.generic!}><GlyphTap /></Pip>;
  if (token.kind === "untap") return <Pip bg={MANA_BG.generic!}><GlyphUntap /></Pip>;
  if (token.kind === "energy") return <Pip bg={MANA_BG.generic!}><GlyphEnergy /></Pip>;

  if (token.kind === "hybrid") {
    const letters = token.manaClass.split("");
    if (letters.length === 2 && /[wubrg]/.test(letters[0]!) && /[wubrg]/.test(letters[1]!)) {
      return <HybridPip a={letters[0]!} b={letters[1]!} />;
    }
    // Generic/color hybrid like 2w
    const match = token.manaClass.match(/^(\d+)([wubrg])$/);
    if (match) {
      return <HybridGenericPip digit={match[1]!} color={match[2]!} />;
    }
  }

  if (token.kind === "phyrexian-color") {
    // Color with Phyrexian Φ glyph overlay
    const colorLetter = token.manaClass[0]!;
    const bg = colorForLetter(colorLetter);
    return (
      <Pip bg={bg}>
        <g opacity="0.85"><GlyphPhyrexian /></g>
      </Pip>
    );
  }

  // Fallback for unknown
  return <Pip bg={MANA_BG.generic!}>{GlyphLetter(token.raw.replace(/[{}]/g, "").slice(0, 2).toUpperCase())}</Pip>;
}

export interface ManaCostStripProps {
  cost: string;
  x: number;
  /** Vertical centerline of the pip row. */
  y: number;
  /** Pip diameter in SVG units. */
  size?: number;
  /** Spacing between pips, in SVG units. */
  gap?: number;
  /** Alignment: 'left' starts at x, 'right' ends at x. */
  align?: "left" | "right";
  /** Color used for hover/preview shadow under each pip. */
}

/**
 * Lays out a horizontal row of mana pips representing the parsed cost.
 * Used for both card title cost (right-aligned) and inline display.
 */
export function ManaCostStrip({
  cost,
  x,
  y,
  size = 50,
  gap = 6,
  align = "right",
}: ManaCostStripProps): JSX.Element {
  const tokens = parseManaCost(cost);
  if (tokens.length === 0) return <g />;

  const totalWidth = tokens.length * size + (tokens.length - 1) * gap;
  const startX = align === "right" ? x - totalWidth : x;
  const topY = y - size / 2;

  return (
    <g>
      {tokens.map((t, i) => (
        <ManaSymbol
          key={`${t.raw}-${i}`}
          token={t}
          x={startX + i * (size + gap)}
          y={topY}
          size={size}
        />
      ))}
    </g>
  );
}
