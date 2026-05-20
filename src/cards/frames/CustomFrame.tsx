/**
 * Custom (freeform) frame — same normal frame, but every optional element is
 * conditionally rendered based on the `show` flags.
 */
import type { CustomCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { TextBox } from "../parts/TextBox";
import { PowerToughness } from "../parts/PowerToughness";
import { LoyaltyBadge } from "../parts/LoyaltyBadge";
import { CollectorLine } from "../parts/CollectorLine";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";
import { TEXT_BOX_BG, TEXT_H, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";

interface Props {
  card: CustomCard;
}

export function CustomFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);
  const showPT = card.show.powerToughness;
  const showLoyalty = card.show.loyalty;
  const showAbilities = card.show.abilities;

  const rightInset = showPT ? 100 : showLoyalty ? 100 : 0;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />

      {showAbilities ? (
        <CustomAbilityList abilities={card.abilities ?? []} rulesText={card.rulesText} flavorText={card.flavorText} />
      ) : (
        <TextBox rulesText={card.rulesText} flavorText={card.flavorText} rightInset={rightInset} />
      )}

      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />

      {showPT ? (
        <PowerToughness power={card.power ?? ""} toughness={card.toughness ?? ""} color={color} />
      ) : null}
      {showLoyalty ? <LoyaltyBadge loyalty={card.loyalty ?? 3} /> : null}
    </g>
  );
}

interface AbilityListProps {
  abilities: { cost: string; text: string }[];
  rulesText: string;
  flavorText?: string;
}

function CustomAbilityList({ abilities, rulesText, flavorText }: AbilityListProps): JSX.Element {
  const padding = 16;
  return (
    <g>
      <rect x={TEXT_X} y={TEXT_Y} width={TEXT_W} height={TEXT_H} rx={8} ry={8} fill={TEXT_BOX_BG} />
      <rect x={TEXT_X + 1} y={TEXT_Y + 1} width={TEXT_W - 2} height={TEXT_H - 2} rx={7} ry={7} fill="none" stroke="rgba(0,0,0,0.32)" />
      <foreignObject x={TEXT_X + padding} y={TEXT_Y + padding} width={TEXT_W - padding * 2} height={TEXT_H - padding * 2}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "19px",
            lineHeight: 1.18,
            color: "#0b0a08",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            height: "100%",
          }}
        >
          {rulesText ? <div style={{ whiteSpace: "pre-wrap" }}>{rulesText}</div> : null}
          {abilities.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  flex: "0 0 auto",
                  minWidth: 48,
                  textAlign: "center",
                  background: "#1a1a14",
                  color: "#f5efe1",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontWeight: 700,
                  fontFamily: "'Source Sans 3', system-ui, sans-serif",
                }}
              >
                {a.cost || "•"}
              </div>
              <div style={{ flex: 1, whiteSpace: "pre-wrap" }}>{a.text}</div>
            </div>
          ))}
          {flavorText ? (
            <div style={{ marginTop: "auto" }}>
              <div style={{ height: 1, margin: "0.4em auto", width: "70%", background: "rgba(0,0,0,0.4)" }} />
              <div style={{ fontStyle: "italic", fontSize: "0.94em" }}>{flavorText}</div>
            </div>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
}
