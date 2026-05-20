/**
 * Class frame — enchantment with level-up upgrade rows. Each level after the
 * base has a mana cost on the left and rules text on the right.
 */
import type { ClassCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { CollectorLine } from "../parts/CollectorLine";
import { ManaCostStrip } from "../symbols/ManaSymbol";
import { TEXT_BOX_BG, TEXT_H, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";

interface Props {
  card: ClassCard;
}

export function ClassFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);
  const rows = card.levels.length + 1; // base + upgrades
  const rowH = (TEXT_H - 24) / rows;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />

      <rect x={TEXT_X} y={TEXT_Y} width={TEXT_W} height={TEXT_H} rx={8} ry={8} fill={TEXT_BOX_BG} />
      <rect x={TEXT_X + 1} y={TEXT_Y + 1} width={TEXT_W - 2} height={TEXT_H - 2} rx={7} ry={7} fill="none" stroke="rgba(0,0,0,0.32)" />

      {/* Base text */}
      <foreignObject x={TEXT_X + 64} y={TEXT_Y + 12} width={TEXT_W - 80} height={rowH - 8}>
        <div
         
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "18px", lineHeight: 1.18, color: "#0b0a08", whiteSpace: "pre-wrap" }}
        >
          {card.rulesText || <span style={{ opacity: 0.5, fontStyle: "italic" }}>(base class text)</span>}
        </div>
      </foreignObject>
      <text x={TEXT_X + 14} y={TEXT_Y + 30} fontFamily="'Cinzel', Georgia, serif" fontWeight={700} fontSize={14} fill="#0b0a08">I</text>

      {/* Upgrades */}
      {card.levels.map((lvl, i) => {
        const rowY = TEXT_Y + 12 + (i + 1) * rowH;
        const labelRoman = ["II", "III", "IV", "V", "VI"][i] ?? `${i + 2}`;
        return (
          <g key={i}>
            <line
              x1={TEXT_X + 14}
              y1={rowY - 4}
              x2={TEXT_X + TEXT_W - 14}
              y2={rowY - 4}
              stroke="rgba(0,0,0,0.22)"
              strokeWidth={0.7}
            />
            <text x={TEXT_X + 14} y={rowY + 22} fontFamily="'Cinzel', Georgia, serif" fontWeight={700} fontSize={14} fill="#0b0a08">{labelRoman}</text>
            <ManaCostStrip cost={lvl.cost} x={TEXT_X + 54} y={rowY + 14} size={26} gap={3} align="left" />
            <foreignObject x={TEXT_X + 14} y={rowY + 30} width={TEXT_W - 28} height={rowH - 36}>
              <div
               
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "17px", lineHeight: 1.18, color: "#0b0a08", whiteSpace: "pre-wrap" }}
              >
                {lvl.text || <span style={{ opacity: 0.5, fontStyle: "italic" }}>(level text)</span>}
              </div>
            </foreignObject>
          </g>
        );
      })}

      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />
    </g>
  );
}
