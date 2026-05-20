/**
 * Double-faced card frame. Renders either the front face or the back face.
 * Both faces follow the normal layout. A small chevron icon in the bottom-right
 * indicates the DFC nature.
 */
import type { ModalDfcCard, TransformCard, Card } from "@/types/card";
import { NormalFrame } from "./NormalFrame";
import { PowerToughness } from "../parts/PowerToughness";
import { LoyaltyBadge } from "../parts/LoyaltyBadge";
import { resolveFrameColor } from "../frameColor";
import { ART_X, ART_Y } from "../tokens";

interface Props {
  card: ModalDfcCard | TransformCard;
  face: "front" | "back";
}

export function DfcFrame({ card, face }: Props): JSX.Element {
  const front = card;
  const back = card.backFace;
  const active: Card =
    face === "back"
      ? ({
          ...back,
          id: `${card.id}-back`,
          collectionId: card.collectionId,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        } as Card)
      : front;

  return (
    <g>
      <NormalFrame card={active} colorOverride={resolveFrameColor(active)} />
      <DfcIndicator variant={card.layout} face={face} />
      {/* Render layout-specific stats from the active face */}
      {active.layout === "creature" ? (
        <PowerToughness power={active.power} toughness={active.toughness} color={resolveFrameColor(active)} />
      ) : null}
      {active.layout === "planeswalker" ? (
        <LoyaltyBadge loyalty={active.startingLoyalty} />
      ) : null}
    </g>
  );
}

function DfcIndicator({ variant, face }: { variant: "modal_dfc" | "transform"; face: "front" | "back" }): JSX.Element {
  // Small badge top-left of the art window: triangle for transform, double-arrow for modal_dfc.
  const cx = ART_X + 28;
  const cy = ART_Y + 28;
  if (variant === "transform") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={18} fill="#0c0a08" stroke="#f3eee5" strokeWidth={1.2} />
        <path
          d={face === "front" ? `M ${cx - 6} ${cy - 6} L ${cx + 8} ${cy} L ${cx - 6} ${cy + 6} Z` : `M ${cx + 6} ${cy - 6} L ${cx - 8} ${cy} L ${cx + 6} ${cy + 6} Z`}
          fill="#f5efe1"
        />
      </g>
    );
  }
  // Modal DFC: two arrows
  return (
    <g>
      <circle cx={cx} cy={cy} r={18} fill="#0c0a08" stroke="#f3eee5" strokeWidth={1.2} />
      <g fill="#f5efe1">
        <path d={`M ${cx - 8} ${cy - 5} L ${cx + 2} ${cy - 5} L ${cx} ${cy - 9} L ${cx + 8} ${cy - 5} L ${cx} ${cy - 1} L ${cx + 2} ${cy - 5} Z`} />
        <path d={`M ${cx + 8} ${cy + 5} L ${cx - 2} ${cy + 5} L ${cx} ${cy + 9} L ${cx - 8} ${cy + 5} L ${cx} ${cy + 1} L ${cx - 2} ${cy + 5} Z`} />
      </g>
    </g>
  );
}
