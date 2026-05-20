/**
 * Mana symbols rendered via the open-source `mana-font` CSS package
 * (https://mana.andrewgioia.com). The package's CSS is loaded from a CDN in
 * index.html. We embed the symbol elements inside SVG via <foreignObject> so
 * they composite cleanly with the rest of the card frame.
 *
 * Each mana token resolves to an `<i class="ms ms-X ms-cost ms-shadow">`
 * element. The `ms-cost` modifier adds the colored circular background; the
 * `ms-shadow` modifier adds the subtle drop shadow that real cards have. The
 * font glyph itself supplies the symbol artwork — we don't copy or redistribute
 * the artwork; we just use the package via its public CSS API.
 */
import { CSSProperties } from "react";
import { type ManaToken, parseManaCost } from "../manaCost";

/** Map our token to the mana-font CSS class suffix. */
function manaFontClass(token: ManaToken): string {
  if (token.kind === "color") return token.manaClass;
  if (token.kind === "colorless") return "c";
  if (token.kind === "generic") return token.manaClass; // numeric class names work directly (ms-0, ms-1, etc.)
  if (token.kind === "x") return token.manaClass; // ms-x, ms-y, ms-z
  if (token.kind === "snow") return "s";
  if (token.kind === "phyrexian") return "p";
  if (token.kind === "tap") return "tap";
  if (token.kind === "untap") return "untap";
  if (token.kind === "energy") return "e";
  if (token.kind === "half") return "half";
  if (token.kind === "infinity") return "infinity";
  if (token.kind === "hybrid") {
    // mana-font uses keys like "wu", "br", "2w", etc. — case-insensitive.
    return token.manaClass;
  }
  if (token.kind === "phyrexian-color") {
    // mana-font expects "wp", "up", etc.
    return token.manaClass;
  }
  return token.manaClass;
}

export interface ManaSymbolProps {
  /** SVG x position of the top-left of the pip. */
  x?: number;
  /** SVG y position of the top-left of the pip. */
  y?: number;
  /** Diameter in SVG units. */
  size?: number;
  token: ManaToken;
  /** When true, add a soft drop shadow under the pip. Defaults true. */
  shadow?: boolean;
  /** When true, render with the colored cost circle. When false, render the
   *  bare glyph (used for inline-in-text usage in rules text). */
  asCost?: boolean;
}

export function ManaSymbol({
  x = 0,
  y = 0,
  size = 50,
  token,
  shadow = true,
  asCost = true,
}: ManaSymbolProps): JSX.Element {
  const cls = `ms ms-${manaFontClass(token)}${asCost ? " ms-cost" : ""}${shadow ? " ms-shadow" : ""}`;
  return (
    <foreignObject x={x} y={y} width={size} height={size}>
      <i className={cls} style={iconStyle(size)} aria-hidden />
    </foreignObject>
  );
}

function iconStyle(size: number): CSSProperties {
  return {
    fontSize: `${size}px`,
    display: "block",
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`,
    textAlign: "center",
  };
}

export interface ManaCostStripProps {
  cost: string;
  /** Reference x: with align='right' this is the right edge of the strip; with align='left' it's the left edge. */
  x: number;
  /** Vertical centerline of the pip row. */
  y: number;
  /** Pip diameter in SVG units. */
  size?: number;
  /** Spacing between pips, in SVG units. */
  gap?: number;
  align?: "left" | "right";
}

/**
 * Lays out a horizontal row of mana pips. Renders as a single foreignObject
 * containing a flex row so spacing/alignment is handled by CSS instead of by
 * computing pixel offsets per pip.
 */
export function ManaCostStrip({
  cost,
  x,
  y,
  size = 50,
  gap = 4,
  align = "right",
}: ManaCostStripProps): JSX.Element {
  const tokens = parseManaCost(cost);
  if (tokens.length === 0) return <g />;

  // The strip's container has a known max width; mana-cost lengths vary so we
  // size foreignObject conservatively (10 pips worst case) and align children
  // inside it via flexbox.
  const maxPips = Math.max(tokens.length, 1);
  const containerW = maxPips * (size + gap) + size; // a little slack
  const containerH = size + 4;
  const foX = align === "right" ? x - containerW : x;

  return (
    <foreignObject x={foX} y={y - containerH / 2} width={containerW} height={containerH}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          gap: `${gap}px`,
          paddingRight: align === "right" ? "0" : "0",
          paddingLeft: align === "left" ? "0" : "0",
        }}
      >
        {tokens.map((t, i) => (
          <i
            key={`${t.raw}-${i}`}
            className={`ms ms-${manaFontClass(t)} ms-cost ms-shadow`}
            style={{ fontSize: `${size}px`, lineHeight: 1 }}
            aria-hidden
          />
        ))}
      </div>
    </foreignObject>
  );
}
