/**
 * Card-type taxonomy used in the onboarding flow. Step 1 shows these eight
 * top-level types. Step 2 narrows to specific frame variants (our layouts).
 */
import type { CardLayout } from "@/types/card";

export interface CardType {
  id: string;
  label: string;
  /** Scryfall query that returns a representative random card. */
  scryfallQuery: string;
  /** Brief one-liner shown on the floating card. */
  blurb: string;
  /** Variants exposed in step 2. The first entry is the default. */
  variants: TypeVariant[];
}

export interface TypeVariant {
  id: string;
  label: string;
  description: string;
  layout: CardLayout;
  /** Default type-line text used when creating the card. */
  defaultTypeLine?: string;
  /** Default rarity used when creating the card. */
  defaultRarity?: "common" | "uncommon" | "rare" | "mythic" | "special";
}

export const CARD_TYPES: CardType[] = [
  {
    id: "creature",
    label: "Creature",
    scryfallQuery: "t:creature -t:token -t:legendary",
    blurb: "A being with power and toughness that fights for you.",
    variants: [
      { id: "creature",       label: "Standard Creature",   description: "A regular creature card.", layout: "creature", defaultTypeLine: "Creature — " },
      { id: "legendary",      label: "Legendary Creature",  description: "Begins with \"Legendary Creature —\".", layout: "creature", defaultTypeLine: "Legendary Creature — " },
      { id: "adventure",      label: "Creature with Adventure", description: "Creature on top, spell-side at bottom.", layout: "adventure" },
      { id: "transform",      label: "Transforming Creature",   description: "Double-faced. Front transforms into back.", layout: "transform" },
      { id: "modal_dfc",      label: "Modal DFC Creature",      description: "Double-faced. Either side can be cast.", layout: "modal_dfc" },
      { id: "leveler",        label: "Leveler",                 description: "Creature with level-up brackets.", layout: "leveler" },
      { id: "token",          label: "Creature Token",          description: "Borderless token frame, no mana cost.", layout: "token", defaultTypeLine: "Token Creature — " },
    ],
  },
  {
    id: "sorcery",
    label: "Sorcery",
    scryfallQuery: "t:sorcery -t:legendary",
    blurb: "A spell cast at sorcery speed for a one-shot effect.",
    variants: [
      { id: "sorcery",        label: "Standard Sorcery",    description: "A regular sorcery.", layout: "normal", defaultTypeLine: "Sorcery" },
      { id: "split",          label: "Split Spell",         description: "Two halves on one card.", layout: "split" },
      { id: "modal_dfc",      label: "Modal DFC Sorcery",   description: "Double-faced, either side can be cast.", layout: "modal_dfc" },
    ],
  },
  {
    id: "instant",
    label: "Instant",
    scryfallQuery: "t:instant",
    blurb: "A spell cast at any time for a quick reaction.",
    variants: [
      { id: "instant",        label: "Standard Instant",    description: "A regular instant.", layout: "normal", defaultTypeLine: "Instant" },
      { id: "split",          label: "Split Spell",         description: "Two halves on one card.", layout: "split" },
      { id: "modal_dfc",      label: "Modal DFC Instant",   description: "Double-faced, either side can be cast.", layout: "modal_dfc" },
    ],
  },
  {
    id: "enchantment",
    label: "Enchantment",
    scryfallQuery: "t:enchantment -t:saga -t:class -t:creature -t:aura",
    blurb: "A persistent magical effect that stays in play.",
    variants: [
      { id: "enchantment",    label: "Standard Enchantment", description: "A regular enchantment.", layout: "normal", defaultTypeLine: "Enchantment" },
      { id: "aura",           label: "Aura",                description: "An enchantment that attaches to a permanent.", layout: "normal", defaultTypeLine: "Enchantment — Aura" },
      { id: "saga",           label: "Saga",                description: "Multi-chapter enchantment.", layout: "saga" },
      { id: "class",          label: "Class",               description: "Level-up class enchantment.", layout: "class" },
    ],
  },
  {
    id: "artifact",
    label: "Artifact",
    scryfallQuery: "t:artifact -t:creature -t:land",
    blurb: "A mechanical or magical object.",
    variants: [
      { id: "artifact",       label: "Standard Artifact",   description: "A regular artifact.", layout: "normal", defaultTypeLine: "Artifact" },
      { id: "equipment",      label: "Equipment",           description: "Artifact that equips a creature.", layout: "normal", defaultTypeLine: "Artifact — Equipment" },
      { id: "vehicle",        label: "Vehicle",             description: "Artifact that becomes a creature when crewed.", layout: "normal", defaultTypeLine: "Artifact — Vehicle" },
      { id: "artifact-creature", label: "Artifact Creature", description: "Artifact + creature with P/T.", layout: "creature", defaultTypeLine: "Artifact Creature — " },
    ],
  },
  {
    id: "land",
    label: "Land",
    scryfallQuery: "t:land is:nonbasic -t:legendary",
    blurb: "A source of mana — the foundation of every deck.",
    variants: [
      { id: "land",           label: "Standard Land",       description: "A regular land.", layout: "normal", defaultTypeLine: "Land" },
      { id: "basic-land",     label: "Basic Land",          description: "A basic land — Plains, Island, etc.", layout: "normal", defaultTypeLine: "Basic Land — " },
      { id: "modal-dfc-land", label: "Modal DFC Land",      description: "Land on one face, spell on the other.", layout: "modal_dfc" },
    ],
  },
  {
    id: "planeswalker",
    label: "Planeswalker",
    scryfallQuery: "t:planeswalker -is:digital",
    blurb: "A loyal hero with multiple activated abilities.",
    variants: [
      { id: "planeswalker",   label: "Standard Planeswalker", description: "A regular planeswalker.", layout: "planeswalker" },
      { id: "transforming-pw",label: "Transforming Walker", description: "Planeswalker on the back face.", layout: "transform" },
    ],
  },
  {
    id: "saga",
    label: "Saga",
    scryfallQuery: "t:saga -t:transform",
    blurb: "A story told over multiple chapters.",
    variants: [
      { id: "saga",           label: "Standard Saga",       description: "Multi-chapter enchantment.", layout: "saga" },
    ],
  },
];

/** Special "I don't know yet" option that drops the user straight into Custom. */
export const FREEFORM_TYPE: CardType = {
  id: "custom",
  label: "Custom",
  scryfallQuery: "t:creature",
  blurb: "Freeform — no Magic template. Toggle stats, loyalty, abilities as you like.",
  variants: [
    { id: "custom",         label: "Custom Frame",        description: "Blank card with everything optional.", layout: "custom" },
  ],
};
