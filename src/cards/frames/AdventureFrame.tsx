/**
 * Adventure frame — creature on top, with a sub-spell ("the adventure") taking
 * the bottom-left half of the text box.
 */
import type { AdventureCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { PowerToughness } from "../parts/PowerToughness";
import { CollectorLine } from "../parts/CollectorLine";
import { Holostamp } from "../parts/Holostamp";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { TEXT_BOX_BG, TEXT_H, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";

interface Props {
  card: AdventureCard;
}

export function AdventureFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);

  // Adventure subcard takes the left half of the text box, the main creature rules fill the rest.
  const halfW = (TEXT_W - 6) / 2;
  const advX = TEXT_X;
  const mainX = TEXT_X + halfW + 6;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />

      {/* Background for both halves */}
      <rect x={TEXT_X} y={TEXT_Y} width={TEXT_W} height={TEXT_H} rx={8} ry={8} fill={TEXT_BOX_BG} />
      <rect
        x={TEXT_X + 1}
        y={TEXT_Y + 1}
        width={TEXT_W - 2}
        height={TEXT_H - 2}
        rx={7}
        ry={7}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
      />
      <line x1={advX + halfW + 3} y1={TEXT_Y + 8} x2={advX + halfW + 3} y2={TEXT_Y + TEXT_H - 8} stroke="rgba(0,0,0,0.3)" strokeWidth={0.6} />

      {/* Adventure (left) sub-card */}
      <foreignObject x={advX + 16} y={TEXT_Y + 14} width={halfW - 32} height={TEXT_H - 28}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "18px",
            lineHeight: 1.18,
            color: "#0b0a08",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 700, fontSize: 18 }}>
              {card.adventure.name || "Adventure"}
            </div>
          </div>
          <div style={{ fontStyle: "italic", fontSize: "14px", color: "rgba(0,0,0,0.7)", marginBottom: 4 }}>
            {card.adventure.typeLine || "Instant — Adventure"}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {card.adventure.rulesText || <span style={{ opacity: 0.5, fontStyle: "italic" }}>(adventure rules)</span>}
          </div>
        </div>
      </foreignObject>
      {/* Adventure mana cost overlaid */}
      <g>
        <ManaCostStrip
          cost={card.adventure.manaCost}
          x={advX + halfW - 14}
          y={TEXT_Y + 22}
          size={28}
          gap={4}
          align="right"
        />
      </g>

      {/* Main rules (right) */}
      <foreignObject x={mainX + 16} y={TEXT_Y + 14} width={halfW - 32} height={TEXT_H - 28}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "18px",
            lineHeight: 1.18,
            color: "#0b0a08",
            whiteSpace: "pre-wrap",
          }}
        >
          {card.rulesText || <span style={{ opacity: 0.5, fontStyle: "italic" }}>(main rules)</span>}
        </div>
      </foreignObject>

      {/* Use the standard TextBox flavor handling via dedicated TextBox below P/T? — actually keep it simpler */}
      {card.flavorText ? (
        <foreignObject x={mainX + 16} y={TEXT_Y + TEXT_H - 70} width={halfW - 32} height={56}>
          <div
           
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: "italic",
              fontSize: "14px",
              lineHeight: 1.18,
              color: "#1a1610",
              borderTop: "1px solid rgba(0,0,0,0.35)",
              paddingTop: 4,
            }}
          >
            {card.flavorText}
          </div>
        </foreignObject>
      ) : null}

      <Holostamp rarity={card.rarity} />
      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />
      <PowerToughness power={card.power} toughness={card.toughness} color={color} />
    </g>
  );
}
