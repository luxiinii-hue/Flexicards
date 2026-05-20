/**
 * Leveler frame — base creature stats with level-up brackets stacked on the
 * right side showing alternate stat blocks.
 */
import type { LevelerCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { TextBox } from "../parts/TextBox";
import { PowerToughness } from "../parts/PowerToughness";
import { CollectorLine } from "../parts/CollectorLine";
import { TEXT_H, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";

interface Props {
  card: LevelerCard;
}

export function LevelerFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);
  const bracketW = 150;
  const bracketX = TEXT_X + TEXT_W - bracketW - 8;
  const bracketRowH = (TEXT_H - 16) / Math.max(card.levels.length, 1);

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />
      <TextBox rulesText={card.rulesText} flavorText={card.flavorText} rightInset={bracketW + 24} />
      <CollectorLine artist={card.artist} setCode={card.setCode} collectorNumber={card.collectorNumber} color={color} />
      <PowerToughness power={card.basePower} toughness={card.baseToughness} color={color} />

      {/* Bracket rows on the right */}
      {card.levels.map((lvl, i) => {
        const y = TEXT_Y + 8 + i * bracketRowH;
        return (
          <g key={i}>
            <rect
              x={bracketX}
              y={y}
              width={bracketW}
              height={bracketRowH - 6}
              rx={6}
              ry={6}
              fill="rgba(0,0,0,0.15)"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth={0.8}
            />
            <text
              x={bracketX + 10}
              y={y + 22}
              fontFamily="'Source Sans 3', system-ui, sans-serif"
              fontWeight={700}
              fontSize={18}
              fill="#15110a"
            >
              LEVEL {lvl.range}
            </text>
            <text
              x={bracketX + bracketW - 10}
              y={y + 22}
              textAnchor="end"
              fontFamily="'Source Sans 3', system-ui, sans-serif"
              fontWeight={700}
              fontSize={20}
              fill="#15110a"
            >
              {lvl.power}/{lvl.toughness}
            </text>
            <foreignObject x={bracketX + 8} y={y + 26} width={bracketW - 16} height={bracketRowH - 36}>
              <div
               
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "13px", lineHeight: 1.18, color: "#0b0a08", whiteSpace: "pre-wrap" }}
              >
                {lvl.abilities}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </g>
  );
}
