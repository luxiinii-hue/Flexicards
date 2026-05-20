/**
 * Planeswalker frame — ability rows with cost badges in the text area, plus a
 * loyalty shield at the bottom-right.
 */
import type { PlaneswalkerCard } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { ArtBox } from "../parts/ArtBox";
import { TypeLine } from "../parts/TypeLine";
import { CollectorLine } from "../parts/CollectorLine";
import { LoyaltyBadge } from "../parts/LoyaltyBadge";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";
import { TEXT_BOX_BG, TEXT_H, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";

interface Props {
  card: PlaneswalkerCard;
}

export function PlaneswalkerFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);
  const rows = card.abilities.length || 3;
  const rowH = (TEXT_H - 24) / rows;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />
      <ArtBox imageHref={artHref} color={color} clipId={`art-${card.id}`} />
      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />

      {/* Ability panel */}
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
        strokeWidth={1}
      />

      {card.abilities.map((ability, i) => {
        const rowY = TEXT_Y + 12 + i * rowH;
        return (
          <PWAbilityRow
            key={i}
            cost={ability.cost}
            text={ability.text}
            x={TEXT_X}
            y={rowY}
            w={TEXT_W}
            h={rowH - 8}
            isLast={i === card.abilities.length - 1}
          />
        );
      })}

      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />
      <LoyaltyBadge loyalty={card.startingLoyalty} />
    </g>
  );
}

interface AbilityRowProps {
  cost: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isLast: boolean;
}

function PWAbilityRow({ cost, text, x, y, w, h, isLast }: AbilityRowProps): JSX.Element {
  const badgeSize = 48;
  const badgeX = x + 14;
  const badgeY = y + (h - badgeSize) / 2;
  const isMinus = cost.trim().startsWith("-") || cost.includes("−");
  const isStatic = !cost.trim() || cost.trim() === "0";

  return (
    <g>
      {/* Cost badge: chevron-like shape */}
      <PWAbilityCostBadge cost={cost} x={badgeX} y={badgeY} size={badgeSize} variant={isMinus ? "minus" : isStatic ? "static" : "plus"} />

      {/* Ability text */}
      <foreignObject x={badgeX + badgeSize + 12} y={y + 2} width={w - (badgeSize + 36)} height={h - 4}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "20px",
            lineHeight: 1.2,
            color: "#0b0a08",
          }}
        >
          {text || <span style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>(ability)</span>}
        </div>
      </foreignObject>

      {/* Divider line */}
      {!isLast ? (
        <line
          x1={x + 16}
          y1={y + h + 4}
          x2={x + w - 16}
          y2={y + h + 4}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={0.7}
        />
      ) : null}
    </g>
  );
}

interface BadgeProps {
  cost: string;
  x: number;
  y: number;
  size: number;
  variant: "plus" | "minus" | "static";
}

function PWAbilityCostBadge({ cost, x, y, size, variant }: BadgeProps): JSX.Element {
  // Plus = pointed up, Minus = pointed down, Static = oval
  const cx = x + size / 2;
  const cy = y + size / 2;
  const half = size / 2;
  const fill = variant === "plus" ? "#1d4a31" : variant === "minus" ? "#4a1d1d" : "#3a3225";
  let shape: JSX.Element;
  if (variant === "plus") {
    shape = (
      <path
        d={`M ${cx} ${cy - half} L ${cx + half} ${cy - 4} L ${cx + half - 4} ${cy + half} L ${cx - half + 4} ${cy + half} L ${cx - half} ${cy - 4} Z`}
        fill={fill}
        stroke="#f3eee5"
        strokeWidth={1.2}
      />
    );
  } else if (variant === "minus") {
    shape = (
      <path
        d={`M ${cx - half + 4} ${cy - half} L ${cx + half - 4} ${cy - half} L ${cx + half} ${cy + 4} L ${cx} ${cy + half} L ${cx - half} ${cy + 4} Z`}
        fill={fill}
        stroke="#f3eee5"
        strokeWidth={1.2}
      />
    );
  } else {
    shape = (
      <ellipse cx={cx} cy={cy} rx={half} ry={half * 0.78} fill={fill} stroke="#f3eee5" strokeWidth={1.2} />
    );
  }
  return (
    <g>
      {shape}
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        fontFamily="'Source Sans 3', system-ui, sans-serif"
        fontWeight={700}
        fontSize={22}
        fill="#f5efe1"
      >
        {cost || "0"}
      </text>
    </g>
  );
}
