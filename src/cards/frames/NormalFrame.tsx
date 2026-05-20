/**
 * The M15-style "normal" frame — used by creatures, sorceries, instants,
 * enchantments, artifacts, and lands. Conditionally renders the P/T box for
 * creature layouts and the holographic stamp for rare+ rarities.
 */
import type { Card, CreatureCard, NormalCard, FrameColor } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { TextBox } from "../parts/TextBox";
import { PowerToughness } from "../parts/PowerToughness";
import { CollectorLine } from "../parts/CollectorLine";
import { Holostamp } from "../parts/Holostamp";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";

interface NormalFrameProps {
  card: NormalCard | CreatureCard | Card;
  colorOverride?: FrameColor;
  forcePT?: { power: string; toughness: string };
  hidePT?: boolean;
}

export function NormalFrame({ card, colorOverride, forcePT, hidePT }: NormalFrameProps): JSX.Element {
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

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} setSymbolId={card.setSymbol?.id} />
      <TextBox rulesText={card.rulesText} flavorText={card.flavorText} rightInset={showPT ? 100 : 0} />
      <Holostamp rarity={card.rarity} />
      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />
      {showPT ? <PowerToughness {...showPT} color={color} /> : null}
    </g>
  );
}
