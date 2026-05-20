import type { Card, FrameColor } from "@/types/card";
import { frameColorFromCost } from "./manaCost";

/**
 * Resolve a frame color for a card, considering manual override, type line hints,
 * and finally the mana cost. Lands and artifacts have special handling.
 */
export function resolveFrameColor(card: Card): FrameColor {
  if (card.borderColor) return card.borderColor;
  const type = card.typeLine.toLowerCase();
  if (type.includes("land")) return "land";
  const { color } = frameColorFromCost(card.manaCost);
  if (color === "colorless" && (type.includes("artifact") || type.includes("vehicle"))) {
    return "colorless";
  }
  return color;
}
