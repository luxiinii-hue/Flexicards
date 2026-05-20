/**
 * Borderless frame variant. The art image (or placeholder) fills the entire
 * card area. Name, type line, rules text, and stats are rendered as
 * translucent dark overlay panels so they stay legible against any art.
 */
import type { Card, CreatureCard, NormalCard, FrameColor } from "@/types/card";
import { Border } from "../parts/Border";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { Holostamp } from "../parts/Holostamp";
import { parseManaCost, type ManaToken } from "../manaCost";
import {
  BORDER, CARD_H, CARD_W,
  COLLECTOR_H, COLLECTOR_W, COLLECTOR_X, COLLECTOR_Y,
  FRAME_COLOR_STOPS,
  PT_H, PT_W, PT_X, PT_Y, TEXT_H, TEXT_INK, TEXT_W, TEXT_X, TEXT_Y,
  TITLE_H, TITLE_W, TITLE_X, TITLE_Y, TYPE_H, TYPE_W, TYPE_X, TYPE_Y,
} from "../tokens";
import { LoyaltyBadge } from "../parts/LoyaltyBadge";

interface Props {
  card: NormalCard | CreatureCard | Card;
  colorOverride?: FrameColor;
  forcePT?: { power: string; toughness: string };
  hidePT?: boolean;
}

export function NormalFrameBorderless({ card, colorOverride, forcePT, hidePT }: Props): JSX.Element {
  const color = colorOverride ?? resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);

  const showPT = (() => {
    if (hidePT) return null;
    if (forcePT) return forcePT;
    if (card.layout === "creature") return { power: card.power, toughness: card.toughness };
    if (card.layout === "custom" && card.show.powerToughness) {
      return { power: card.power ?? "0", toughness: card.toughness ?? "0" };
    }
    return null;
  })();
  const showLoyalty = card.layout === "planeswalker"
    || (card.layout === "custom" && card.show.loyalty);
  const loyaltyValue = (() => {
    if (card.layout === "planeswalker") return card.startingLoyalty;
    if (card.layout === "custom") return card.loyalty ?? 3;
    return null;
  })();

  return (
    <g>
      <Border />

      {/* Art fills the entire usable card area (everything inside the black border). */}
      <BorderlessArt imageHref={artHref} />

      {/* Soft top-and-bottom gradient overlays so text-area panels read clearly. */}
      <BorderlessVignettes />

      {/* Title overlay */}
      <BorderlessTitleOverlay name={card.name} manaCost={card.manaCost} />

      {/* Type-line overlay */}
      <BorderlessTypeOverlay text={card.typeLine} />

      {/* Rules text overlay */}
      <BorderlessRulesOverlay rulesText={card.rulesText} flavorText={card.flavorText} />

      {/* Holostamp at the bottom of the rules panel */}
      <Holostamp rarity={card.rarity} />

      {/* Collector line */}
      <BorderlessCollector
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
      />

      {/* Stats (PT or Loyalty) */}
      {showPT ? <BorderlessPowerToughness {...showPT} color={color} /> : null}
      {showLoyalty && loyaltyValue !== null ? <LoyaltyBadge loyalty={loyaltyValue} /> : null}
    </g>
  );
}

function BorderlessArt({ imageHref }: { imageHref?: string }): JSX.Element {
  // Inside the black outer border, fill the entire area with art.
  const x = BORDER;
  const y = BORDER;
  const w = CARD_W - 2 * BORDER;
  const h = CARD_H - 2 * BORDER;
  return (
    <g>
      <defs>
        <clipPath id="borderless-art-clip">
          <rect x={x} y={y} width={w} height={h} rx={6} ry={6} />
        </clipPath>
        <linearGradient id="borderless-art-placeholder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2030" />
          <stop offset="100%" stopColor="#0c0d18" />
        </linearGradient>
      </defs>
      <g clipPath="url(#borderless-art-clip)">
        {imageHref ? (
          <image
            href={imageHref}
            xlinkHref={imageHref}
            x={x}
            y={y}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <rect x={x} y={y} width={w} height={h} fill="url(#borderless-art-placeholder)" />
        )}
      </g>
    </g>
  );
}

function BorderlessVignettes(): JSX.Element {
  const x = BORDER;
  const y = BORDER;
  const w = CARD_W - 2 * BORDER;
  const h = CARD_H - 2 * BORDER;
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id="borderless-top-vignette" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.75)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="borderless-bottom-vignette" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h * 0.18} fill="url(#borderless-top-vignette)" rx={6} ry={6} />
      <rect x={x} y={y + h * 0.55} width={w} height={h * 0.45} fill="url(#borderless-bottom-vignette)" rx={6} ry={6} />
    </g>
  );
}

function BorderlessTitleOverlay({ name, manaCost }: { name: string; manaCost: string }): JSX.Element {
  return (
    <g>
      <foreignObject x={TITLE_X + 4} y={TITLE_Y} width={TITLE_W * 0.6} height={TITLE_H}>
        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            fontSize: "32px",
            color: "#f5efe1",
            letterSpacing: "0.6px",
            textShadow: "0 2px 4px rgba(0,0,0,0.85), 0 0 12px rgba(0,0,0,0.6)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {name || "Untitled"}
        </div>
      </foreignObject>
      <ManaCostStrip
        cost={manaCost}
        x={TITLE_X + TITLE_W - 4}
        y={TITLE_Y + TITLE_H / 2}
        size={42}
        gap={3}
        align="right"
      />
    </g>
  );
}

function BorderlessTypeOverlay({ text }: { text: string }): JSX.Element {
  // A narrow horizontal strip that splits art from rules
  return (
    <g>
      <rect
        x={TYPE_X}
        y={TYPE_Y - 4}
        width={TYPE_W}
        height={TYPE_H}
        rx={3}
        ry={3}
        fill="rgba(8,8,12,0.78)"
      />
      <rect
        x={TYPE_X}
        y={TYPE_Y - 4}
        width={TYPE_W}
        height={TYPE_H}
        rx={3}
        ry={3}
        fill="none"
        stroke="rgba(243,217,154,0.55)"
        strokeWidth={0.8}
      />
      <foreignObject x={TYPE_X + 14} y={TYPE_Y - 2} width={TYPE_W - 30} height={TYPE_H - 4}>
        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600,
            fontSize: "20px",
            color: "#f3d99a",
            letterSpacing: "0.4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {text || "Type"}
        </div>
      </foreignObject>
    </g>
  );
}

function BorderlessRulesOverlay({ rulesText, flavorText }: { rulesText: string; flavorText?: string }): JSX.Element {
  return (
    <g>
      <rect
        x={TEXT_X}
        y={TEXT_Y}
        width={TEXT_W}
        height={TEXT_H}
        rx={4}
        ry={4}
        fill="rgba(246,239,222,0.93)"
      />
      <rect
        x={TEXT_X}
        y={TEXT_Y}
        width={TEXT_W}
        height={TEXT_H}
        rx={4}
        ry={4}
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth={1}
      />
      <foreignObject x={TEXT_X + 22} y={TEXT_Y + 16} width={TEXT_W - 44} height={TEXT_H - 32}>
        <div
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "22px",
            lineHeight: 1.2,
            color: TEXT_INK,
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <BorderlessRulesContent text={rulesText} />
          {flavorText ? (
            <div style={{ marginTop: "auto", paddingTop: "0.5em" }}>
              <div
                style={{
                  height: 1,
                  margin: "0.3em auto",
                  width: "60%",
                  background: "linear-gradient(to right, transparent, rgba(0,0,0,0.5), transparent)",
                }}
              />
              <div style={{ fontStyle: "italic", color: "#1a1610", fontSize: "0.9em" }}>{flavorText}</div>
            </div>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
}

function BorderlessRulesContent({ text }: { text: string }): JSX.Element {
  if (!text.trim()) {
    return <span style={{ color: "rgba(0,0,0,0.32)", fontStyle: "italic" }}>(rules text)</span>;
  }
  const paragraphs = text.split(/\n+/);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45em" }}>
      {paragraphs.map((p, i) => (
        <div key={i}>{renderInlineWithMana(p)}</div>
      ))}
    </div>
  );
}

function renderInlineWithMana(text: string): JSX.Element[] {
  const segments: JSX.Element[] = [];
  const tokens = parseManaCost(text);
  if (tokens.length === 0) return [<span key={0}>{text}</span>];
  let lastIndex = 0;
  const re = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(<span key={`t-${i}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    const token = tokens[i];
    if (token) {
      segments.push(
        <i
          key={`m-${i}`}
          className={`ms ms-${manaFontClassForToken(token)} ms-cost ms-shadow`}
          style={{ fontSize: "0.86em", verticalAlign: "-0.14em", margin: "0 0.06em", display: "inline-block", lineHeight: 1 }}
          aria-hidden
        />
      );
    }
    lastIndex = match.index + match[0].length;
    i++;
  }
  if (lastIndex < text.length) segments.push(<span key="tail">{text.slice(lastIndex)}</span>);
  return segments;
}

function manaFontClassForToken(token: ManaToken): string {
  if (token.kind === "color") return token.manaClass;
  if (token.kind === "colorless") return "c";
  if (token.kind === "generic" || token.kind === "x") return token.manaClass;
  if (token.kind === "snow") return "s";
  if (token.kind === "phyrexian") return "p";
  if (token.kind === "tap") return "tap";
  if (token.kind === "untap") return "untap";
  if (token.kind === "energy") return "e";
  return token.manaClass;
}

function BorderlessPowerToughness({ power, toughness, color }: { power: string; toughness: string; color: FrameColor }): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f3e7c8" : "#1a1206";

  const points = `
    ${PT_X + 14},${PT_Y}
    ${PT_X + PT_W},${PT_Y}
    ${PT_X + PT_W},${PT_Y + PT_H}
    ${PT_X},${PT_Y + PT_H}
    ${PT_X},${PT_Y + 14}
  `;
  return (
    <g>
      <polygon points={points} fill={stops.plate} />
      <polygon points={points} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={1.2} />
      <text
        x={PT_X + PT_W / 2 + 1}
        y={PT_Y + PT_H / 2 + 12}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={34}
        textAnchor="middle"
        fill={ink}
        style={{ letterSpacing: "0.5px" }}
      >
        {`${power || "*"}/${toughness || "*"}`}
      </text>
    </g>
  );
}

function BorderlessCollector({ artist, setCode, collectorNumber }: { artist: string; setCode?: string; collectorNumber?: string }): JSX.Element {
  const year = new Date().getFullYear();
  const left = artist ? `Illus. ${artist}` : "Illus. —";
  const middle = [setCode, collectorNumber].filter(Boolean).join(" · ");
  const cy = COLLECTOR_Y + COLLECTOR_H / 2;
  return (
    <g>
      <foreignObject x={COLLECTOR_X} y={cy - 12} width={COLLECTOR_W} height={24}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: "#1a1206",
            letterSpacing: "0.2px",
            height: "100%",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "40%" }}>{left}</span>
          {middle ? (
            <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {middle}
            </span>
          ) : <span />}
          <span style={{ opacity: 0.78, fontSize: "10px", whiteSpace: "nowrap" }}>™ &amp; © {year}</span>
        </div>
      </foreignObject>
    </g>
  );
}
