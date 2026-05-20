/**
 * Card-type taxonomy used in the onboarding flow. Step 1 shows these eight
 * top-level types — each maps to a single default layout. Step 2 picks a
 * frame style (visual skin) independent of layout. Users can change layout
 * sub-variants later via the Layout dropdown in the form panel.
 */
import type { CardLayout } from "@/types/card";

export interface CardType {
  id: string;
  label: string;
  /** Scryfall query that returns a representative random card. */
  scryfallQuery: string;
  /** Brief one-liner shown on the floating card. */
  blurb: string;
  /** The layout assigned when this type is picked. */
  layout: CardLayout;
  /** Default type-line text used when creating the card. */
  defaultTypeLine?: string;
}

export const CARD_TYPES: CardType[] = [
  {
    id: "creature",
    label: "Creature",
    scryfallQuery: "t:creature -t:token -t:legendary -is:digital",
    blurb: "A being with power and toughness that fights for you.",
    layout: "creature",
    defaultTypeLine: "Creature — ",
  },
  {
    id: "sorcery",
    label: "Sorcery",
    scryfallQuery: "t:sorcery -t:legendary -is:digital",
    blurb: "A spell cast at sorcery speed for a one-shot effect.",
    layout: "normal",
    defaultTypeLine: "Sorcery",
  },
  {
    id: "instant",
    label: "Instant",
    scryfallQuery: "t:instant -is:digital",
    blurb: "A spell cast at any time for a quick reaction.",
    layout: "normal",
    defaultTypeLine: "Instant",
  },
  {
    id: "enchantment",
    label: "Enchantment",
    scryfallQuery: "t:enchantment -t:saga -t:class -t:creature -t:aura -is:digital",
    blurb: "A persistent magical effect that stays in play.",
    layout: "normal",
    defaultTypeLine: "Enchantment",
  },
  {
    id: "artifact",
    label: "Artifact",
    scryfallQuery: "t:artifact -t:creature -t:land -is:digital",
    blurb: "A mechanical or magical object.",
    layout: "normal",
    defaultTypeLine: "Artifact",
  },
  {
    id: "land",
    label: "Land",
    scryfallQuery: "t:land -t:legendary -is:digital",
    blurb: "A source of mana — the foundation of every deck.",
    layout: "normal",
    defaultTypeLine: "Land",
  },
  {
    id: "planeswalker",
    label: "Planeswalker",
    scryfallQuery: "t:planeswalker -is:digital",
    blurb: "A loyal hero with multiple activated abilities.",
    layout: "planeswalker",
  },
  {
    id: "saga",
    label: "Saga",
    scryfallQuery: "t:saga -t:transform -is:digital",
    blurb: "A story told over multiple chapters.",
    layout: "saga",
  },
];

export const FREEFORM_TYPE: CardType = {
  id: "custom",
  label: "Custom",
  scryfallQuery: "t:creature",
  blurb: "Freeform — no Magic template. Toggle stats, loyalty, abilities as you like.",
  layout: "custom",
};
