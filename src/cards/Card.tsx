/**
 * Top-level Card SVG. Sizes itself to fill its container while preserving aspect
 * ratio. Picks the appropriate frame component based on the card's `layout`.
 */
import { CSSProperties } from "react";
import type { Card as CardType } from "@/types/card";
import { CARD_H, CARD_W } from "./tokens";
import { NormalFrame } from "./frames/NormalFrame";
import { PlaneswalkerFrame } from "./frames/PlaneswalkerFrame";
import { SagaFrame } from "./frames/SagaFrame";
import { AdventureFrame } from "./frames/AdventureFrame";
import { TokenFrame } from "./frames/TokenFrame";
import { SplitFrame } from "./frames/SplitFrame";
import { DfcFrame } from "./frames/DfcFrame";
import { ClassFrame } from "./frames/ClassFrame";
import { LevelerFrame } from "./frames/LevelerFrame";
import { CustomFrame } from "./frames/CustomFrame";

interface CardProps {
  card: CardType;
  /** Render width in CSS pixels. Height computed from aspect. */
  width?: number | string;
  /** When true, show 3mm safe-zone guides as red dashed lines. */
  showSafeZone?: boolean;
  style?: CSSProperties;
  className?: string;
  /**
   * For DFC layouts, which face to render. Defaults to "front".
   */
  face?: "front" | "back";
}

export function Card({ card, width = "100%", showSafeZone, style, className, face = "front" }: CardProps): JSX.Element {
  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      width={width}
      style={{ ...style, aspectRatio: `${CARD_W} / ${CARD_H}`, display: "block" }}
      className={`card-svg ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderFrame(card, face)}
      {showSafeZone ? <SafeZoneGuide /> : null}
    </svg>
  );
}

function renderFrame(card: CardType, face: "front" | "back"): JSX.Element {
  switch (card.layout) {
    case "normal":
    case "creature":
      return <NormalFrame card={card} />;
    case "planeswalker":
      return <PlaneswalkerFrame card={card} />;
    case "saga":
      return <SagaFrame card={card} />;
    case "adventure":
      return <AdventureFrame card={card} />;
    case "token":
      return <TokenFrame card={card} />;
    case "split":
      return <SplitFrame card={card} />;
    case "modal_dfc":
    case "transform":
      return <DfcFrame card={card} face={face} />;
    case "class":
      return <ClassFrame card={card} />;
    case "leveler":
      return <LevelerFrame card={card} />;
    case "custom":
      return <CustomFrame card={card} />;
  }
}

function SafeZoneGuide(): JSX.Element {
  // 3mm at 300dpi ≈ 35.4 px in our coord space (745 = 63mm, so 1mm ≈ 11.8 px).
  const margin = 35;
  return (
    <g>
      <rect
        x={margin}
        y={margin}
        width={CARD_W - margin * 2}
        height={CARD_H - margin * 2}
        rx={20}
        ry={20}
        fill="none"
        stroke="#ff3366"
        strokeWidth={1.5}
        strokeDasharray="6 6"
        opacity={0.65}
      />
    </g>
  );
}
