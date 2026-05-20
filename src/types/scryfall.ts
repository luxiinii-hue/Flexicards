/**
 * A subset of the Scryfall card response, just the fields we use.
 * Full schema: https://scryfall.com/docs/api/cards
 */

export type ScryfallLayout =
  | "normal"
  | "split"
  | "flip"
  | "transform"
  | "modal_dfc"
  | "meld"
  | "leveler"
  | "class"
  | "saga"
  | "adventure"
  | "planar"
  | "scheme"
  | "vanguard"
  | "token"
  | "double_faced_token"
  | "emblem"
  | "augment"
  | "host"
  | "art_series"
  | "reversible_card";

export interface ScryfallImageUris {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
}

export interface ScryfallCardFace {
  name: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  flavor_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  artist?: string;
  image_uris?: ScryfallImageUris;
  colors?: string[];
}

export interface ScryfallCard {
  object: "card";
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  type_line: string;
  oracle_text?: string;
  flavor_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  layout: ScryfallLayout;
  colors?: string[];
  color_identity?: string[];
  card_faces?: ScryfallCardFace[];
  image_uris?: ScryfallImageUris;
  rarity: "common" | "uncommon" | "rare" | "mythic" | "special" | "bonus";
  artist?: string;
  set: string;
  set_name: string;
  collector_number: string;
  released_at?: string;
}

export interface ScryfallList<T> {
  object: "list";
  total_cards?: number;
  has_more: boolean;
  next_page?: string;
  data: T[];
}

export interface ScryfallCatalog {
  object: "catalog";
  total_values: number;
  data: string[];
}

export interface ScryfallError {
  object: "error";
  code: string;
  status: number;
  details: string;
  type?: string;
  warnings?: string[];
}
