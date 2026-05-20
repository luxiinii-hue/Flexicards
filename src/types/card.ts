/**
 * Card type system. All cards share a base set of fields and are discriminated
 * by `layout`. The form panel and frame renderer switch on this field.
 */

export type ManaCost = string; // e.g. "{2}{W}{U}" — tokenized at render time
export type Rarity = "common" | "uncommon" | "rare" | "mythic" | "special";
export type Language = "EN";

/** Frame color decides border + inner gradient. Auto-derived from manaCost unless overridden. */
export type FrameColor =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "multicolor"
  | "colorless"
  | "land";

/**
 * Frame style — the visual "skin" applied to the card frame. Independent
 * from the card's layout (which determines structure: creature/saga/etc.)
 * and from the frame color (which sets the palette). The style governs
 * border thickness, panel treatments, ornamental flourishes, and overlay
 * effects.
 */
export type FrameStyle =
  | "standard"   // clean color band, dark borders, parchment text
  | "borderless" // art fills the card, translucent overlays for text
  | "retro"      // thicker rounded outer border, parchment-heavy
  | "showcase";  // standard + ornamental corner flourishes + gold inner rim

export const ALL_FRAME_STYLES: FrameStyle[] = ["standard", "borderless", "retro", "showcase"];

export const FRAME_STYLE_LABELS: Record<FrameStyle, string> = {
  standard:   "Standard",
  borderless: "Borderless",
  retro:      "Retro",
  showcase:   "Showcase",
};

export const FRAME_STYLE_DESCRIPTIONS: Record<FrameStyle, string> = {
  standard:   "Clean color band, dark borders, parchment text box. The reliable default.",
  borderless: "Art fills the entire card. Name, type, and rules sit on translucent dark strips.",
  retro:      "Thicker rounded outer border. Parchment-heavy text panel. Vintage feel.",
  showcase:   "Standard frame with decorative corner flourishes and a gold inner rim. Premium look.",
};

export interface ArtImageRef {
  blobId: string; // key into the IndexedDB blobs table
  /** Crop transform persisted so the user can re-edit the framing later. */
  transform: { x: number; y: number; scale: number; rotation: number };
  originalFilename: string;
  /** width/height of the cropped output blob, used for aspect-ratio sanity checks */
  width: number;
  height: number;
  mimeType: string;
}

export interface SetSymbolRef {
  /** "default" / "snow" / "custom-uploaded-id" / built-in id */
  id: string;
  /** Optional user-uploaded SVG blob */
  blobId?: string;
}

/** Common fields on every card. */
export interface CardBase {
  id: string;
  collectionId: string;
  name: string;
  manaCost: ManaCost;
  typeLine: string;
  setSymbol?: SetSymbolRef;
  rarity: Rarity;
  artist: string;
  collectorNumber?: string;
  setCode?: string;
  language: Language;
  /** If null/undefined, color is derived from manaCost. */
  borderColor?: FrameColor;
  /** Visual skin for the frame. Defaults to "standard" on legacy cards. */
  frameStyle?: FrameStyle;
  artImage?: ArtImageRef;
  rulesText: string;
  flavorText?: string;
  createdAt: number;
  updatedAt: number;
}

// ---------- Layout variants ----------

export interface NormalCard extends CardBase {
  layout: "normal";
}

export interface CreatureCard extends CardBase {
  layout: "creature";
  power: string;
  toughness: string;
}

export interface PlaneswalkerAbility {
  /** "+1", "-2", "0", "-X" etc. */
  cost: string;
  text: string;
}

export interface PlaneswalkerCard extends CardBase {
  layout: "planeswalker";
  startingLoyalty: number;
  abilities: PlaneswalkerAbility[];
}

export interface SagaChapter {
  /** Roman numerals that share this chapter row. Saga.SUMs are typically [1,2], [3], etc. */
  numerals: number[];
  text: string;
}

export interface SagaCard extends CardBase {
  layout: "saga";
  chapters: SagaChapter[];
}

export interface AdventureFace {
  name: string;
  typeLine: string;
  manaCost: ManaCost;
  rulesText: string;
  flavorText?: string;
}

export interface AdventureCard extends CardBase {
  layout: "adventure";
  adventure: AdventureFace;
  power: string;
  toughness: string;
}

export interface TokenCard extends CardBase {
  layout: "token";
  power?: string;
  toughness?: string;
}

export interface SplitHalf {
  name: string;
  manaCost: ManaCost;
  typeLine: string;
  rulesText: string;
  flavorText?: string;
}

export interface SplitCard extends CardBase {
  layout: "split";
  leftHalf: SplitHalf;
  rightHalf: SplitHalf;
  fuse?: boolean;
}

/** Back face for transform/modal_dfc cards. We allow normal/creature/planeswalker on the back. */
export type DfcBackFace = Omit<NormalCard, "id" | "collectionId" | "createdAt" | "updatedAt">
  | Omit<CreatureCard, "id" | "collectionId" | "createdAt" | "updatedAt">
  | Omit<PlaneswalkerCard, "id" | "collectionId" | "createdAt" | "updatedAt">;

export interface ModalDfcCard extends CardBase {
  layout: "modal_dfc";
  backFace: DfcBackFace;
}

export interface TransformCard extends CardBase {
  layout: "transform";
  backFace: DfcBackFace;
}

export interface ClassLevel {
  cost: ManaCost;
  text: string;
}

export interface ClassCard extends CardBase {
  layout: "class";
  /** Level 1 is implicit (the base class). Subsequent entries are upgrades with mana costs. */
  levels: ClassLevel[];
}

export interface LevelerLevel {
  range: string; // "2-4", "5+", etc.
  power: string;
  toughness: string;
  abilities: string;
}

export interface LevelerCard extends CardBase {
  layout: "leveler";
  basePower: string;
  baseToughness: string;
  levels: LevelerLevel[];
}

/**
 * Freeform layout for homebrew card types that don't fit a standard Magic template.
 * Each "show" flag toggles whether the corresponding optional element appears in
 * the rendered frame and the form.
 */
export interface CustomCard extends CardBase {
  layout: "custom";
  show: {
    powerToughness: boolean;
    loyalty: boolean;
    abilities: boolean;
  };
  power?: string;
  toughness?: string;
  loyalty?: number;
  abilities?: PlaneswalkerAbility[];
}

// ---------- Union ----------

export type Card =
  | NormalCard
  | CreatureCard
  | PlaneswalkerCard
  | SagaCard
  | AdventureCard
  | TokenCard
  | SplitCard
  | ModalDfcCard
  | TransformCard
  | ClassCard
  | LevelerCard
  | CustomCard;

export type CardLayout = Card["layout"];

export const ALL_LAYOUTS: CardLayout[] = [
  "normal",
  "creature",
  "planeswalker",
  "saga",
  "adventure",
  "token",
  "split",
  "modal_dfc",
  "transform",
  "class",
  "leveler",
  "custom",
];

/** Human-readable name for each layout. */
export const LAYOUT_LABELS: Record<CardLayout, string> = {
  normal: "Spell",
  creature: "Creature",
  planeswalker: "Planeswalker",
  saga: "Saga",
  adventure: "Adventure",
  token: "Token",
  split: "Split",
  modal_dfc: "Modal DFC",
  transform: "Transform",
  class: "Class",
  leveler: "Leveler",
  custom: "Custom (freeform)",
};

/** One-line description shown in the layout picker. */
export const LAYOUT_DESCRIPTIONS: Record<CardLayout, string> = {
  normal: "Sorcery, instant, enchantment, artifact, or land.",
  creature: "A creature with power and toughness.",
  planeswalker: "Walker with starting loyalty and ability rows.",
  saga: "Enchantment with chapter rows on the left.",
  adventure: "Creature with an extra spell sub-card.",
  token: "Borderless token. No mana cost.",
  split: "Two spells on one card, side by side.",
  modal_dfc: "Double-faced. Either face can be cast.",
  transform: "Double-faced. Front transforms into back.",
  class: "Tribal class enchantment with level-up costs.",
  leveler: "Creature with Level Up brackets.",
  custom: "Blank canvas. Add optional stats/loyalty/abilities as you like.",
};

// ---------- Collections ----------

export interface Collection {
  id: string;
  name: string;
  setCode: string;
  cards: string[]; // ordered card IDs
  createdAt: number;
  updatedAt: number;
}

// ---------- Settings ----------

export interface Settings {
  id: "global";
  defaultPaperSize: "A4" | "Letter";
  defaultCropMarks: boolean;
  showSafeZoneGuide: boolean;
  schemaVersion: number;
}

// ---------- Type guards ----------

export function hasPowerToughness(
  card: Card
): card is CreatureCard | AdventureCard | TokenCard | CustomCard {
  if (card.layout === "creature" || card.layout === "adventure") return true;
  if (card.layout === "token") return card.power !== undefined || card.toughness !== undefined;
  if (card.layout === "custom") return card.show.powerToughness;
  return false;
}

export function hasLoyalty(card: Card): card is PlaneswalkerCard | CustomCard {
  if (card.layout === "planeswalker") return true;
  if (card.layout === "custom") return card.show.loyalty;
  return false;
}

export function hasAbilityRows(card: Card): card is PlaneswalkerCard | CustomCard {
  if (card.layout === "planeswalker") return true;
  if (card.layout === "custom") return card.show.abilities;
  return false;
}

export function hasBackFace(card: Card): card is ModalDfcCard | TransformCard {
  return card.layout === "modal_dfc" || card.layout === "transform";
}
