/**
 * Token frame — no mana cost, larger art window, simple type line.
 */
import type { TokenCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { TextBox } from "../parts/TextBox";
import { PowerToughness } from "../parts/PowerToughness";
import { CollectorLine } from "../parts/CollectorLine";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";

interface Props {
  card: TokenCard;
}

export function TokenFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);
  const showPT = card.power !== undefined || card.toughness !== undefined;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      {/* Tokens still have a name but mana cost stays empty — pass "" so the strip is omitted */}
      <TitleBar name={card.name} manaCost="" color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine || "Token"} color={color} rarity={card.rarity} />
      <TextBox rulesText={card.rulesText} flavorText={card.flavorText} rightInset={showPT ? 100 : 0} />
      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />
      {showPT ? (
        <PowerToughness power={card.power ?? ""} toughness={card.toughness ?? ""} color={color} />
      ) : null}
    </g>
  );
}
