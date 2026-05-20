/**
 * Mana symbols rendered via the open-source `mana-font` CSS package
 * (https://mana.andrewgioia.com). The package's CSS + font are bundled into
 * the JS build via `import "mana-font/css/mana.min.css"` in main.tsx so the
 * symbols always render — no CDN dependency.
 *
 * Each mana token resolves to an `<i class="ms ms-X ms-cost ms-shadow">`
 * element placed inside SVG via <foreignObject>.
 */
import type { CSSProperties } from "react";
import { type ManaToken, parseManaCost } from "../manaCost";

function manaFontClass(token: ManaToken): string {
  if (token.kind === "color") return token.manaClass;
  if (token.kind === "colorless") return "c";
  if (token.kind === "generic" || token.kind === "x") return token.manaClass;
  if (token.kind === "snow") return "s";
  if (token.kind === "phyrexian") return "p";
  if (token.kind === "tap") return "tap";
  if (token.kind === "untap") return "untap";
  if (token.kind === "energy") return "e";
  if (token.kind === "half") return "half";
  if (token.kind === "infinity") return "infinity";
  return token.manaClass;
}

export interface ManaSymbolProps {
  x?: number;
  y?: number;
  size?: number;
  token: ManaToken;
  shadow?: boolean;
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
  x: number;
  y: number;
  size?: number;
  gap?: number;
  align?: "left" | "right";
}

export function ManaCostStrip({
  cost,
  x,
  y,
  size = 40,
  gap = 3,
  align = "right",
}: ManaCostStripProps): JSX.Element {
  const tokens = parseManaCost(cost);
  if (tokens.length === 0) return <g />;

  // Container is sized for actual content so flex alignment isn't fighting
  // a huge invisible box.
  const containerW = tokens.length * size + (tokens.length - 1) * gap;
  const containerH = size + 2;
  const foX = align === "right" ? x - containerW : x;

  return (
    <foreignObject x={foX} y={y - containerH / 2} width={containerW + 2} height={containerH}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          gap: `${gap}px`,
        }}
      >
        {tokens.map((t, i) => (
          <i
            key={`${t.raw}-${i}`}
            className={`ms ms-${manaFontClass(t)} ms-cost ms-shadow`}
            style={{ fontSize: `${size}px`, lineHeight: 1, display: "inline-block" }}
            aria-hidden
          />
        ))}
      </div>
    </foreignObject>
  );
}
