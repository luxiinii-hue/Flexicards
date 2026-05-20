/**
 * Split card — rotated 90° so the two halves stack on a normally-oriented page.
 * The card SVG is still 745×1040, but the two halves are drawn rotated to
 * present a "wide" card when the SVG is viewed.
 *
 * We render the card as two mini-card halves stacked top-to-bottom in the SVG.
 * For print, the card would be cut and used in landscape orientation.
 */
import type { SplitCard, SplitHalf, FrameColor } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { resolveFrameColor } from "../frameColor";
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { frameColorFromCost } from "../manaCost";
import { FRAME_COLOR_STOPS, BORDER, CARD_H, CARD_W } from "../tokens";

interface Props {
  card: SplitCard;
}

export function SplitFrame({ card }: Props): JSX.Element {
  const leftColor = frameColorFromCost(card.leftHalf.manaCost).color;
  const rightColor = frameColorFromCost(card.rightHalf.manaCost).color;
  const overallColor = resolveFrameColor(card);
  void overallColor;

  // We split the card vertically. The two halves are rendered rotated -90° so
  // the user reads them landscape after cutting/printing.
  const halfH = (CARD_H - BORDER * 2) / 2;
  return (
    <g>
      <CardSvgDefs />
      <Border />
      <SplitHalfFrame half={card.leftHalf} color={leftColor} y={BORDER} h={halfH} id={`${card.id}-l`} />
      <SplitHalfFrame half={card.rightHalf} color={rightColor} y={BORDER + halfH} h={halfH} id={`${card.id}-r`} />
      <line
        x1={BORDER}
        y1={BORDER + halfH}
        x2={CARD_W - BORDER}
        y2={BORDER + halfH}
        stroke="#0c0a08"
        strokeWidth={2}
      />
    </g>
  );
}

interface HalfProps {
  half: SplitHalf;
  color: FrameColor;
  y: number;
  h: number;
  id: string;
}

function SplitHalfFrame({ half, color, y, h, id }: HalfProps): JSX.Element {
  const stops = FRAME_COLOR_STOPS[color];
  const x = BORDER;
  const w = CARD_W - BORDER * 2;
  const isDark = color === "black" || color === "blue";
  const ink = isDark ? "#f5efe1" : "#15110a";

  return (
    <g>
      <defs>
        <linearGradient id={`split-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stops.top} />
          <stop offset="100%" stopColor={stops.bottom} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#split-${id})`} />
      {/* Title row */}
      <rect x={x + 8} y={y + 12} width={w - 16} height={48} rx={6} ry={6} fill={stops.top} stroke="rgba(0,0,0,0.32)" />
      <text
        x={x + 24}
        y={y + 12 + 33}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={26}
        fill={ink}
      >
        {half.name || "Untitled"}
      </text>
      <ManaCostStrip cost={half.manaCost} x={x + w - 20} y={y + 12 + 24} size={32} gap={4} align="right" />

      {/* Type line */}
      <rect x={x + 8} y={y + 66} width={w - 16} height={34} rx={6} ry={6} fill={stops.top} stroke="rgba(0,0,0,0.32)" />
      <text
        x={x + 22}
        y={y + 66 + 23}
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={600}
        fontSize={18}
        fill={ink}
      >
        {half.typeLine || "Sorcery"}
      </text>

      {/* Rules */}
      <rect x={x + 8} y={y + 108} width={w - 16} height={h - 124} rx={6} ry={6} fill="#f6efde" stroke="rgba(0,0,0,0.32)" />
      <foreignObject x={x + 24} y={y + 120} width={w - 48} height={h - 144}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "18px",
            lineHeight: 1.18,
            color: "#0b0a08",
            whiteSpace: "pre-wrap",
          }}
        >
          {half.rulesText || <span style={{ opacity: 0.5, fontStyle: "italic" }}>(rules)</span>}
          {half.flavorText ? (
            <>
              <div style={{ height: 1, margin: "0.4em auto", width: "70%", background: "rgba(0,0,0,0.35)" }} />
              <div style={{ fontStyle: "italic", fontSize: "0.9em" }}>{half.flavorText}</div>
            </>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
}
