/**
 * Design tokens for card rendering. All coordinates are in the card's SVG
 * coordinate system (745 × 1040, ≈ 63×88mm at 300 DPI).
 *
 * Mental model: the card has three nested rectangles —
 *   1. Outer trim (the card edge, 745 × 1040)
 *   2. Outer black border (BORDER thick on all sides)
 *   3. Inner color frame (the colored band the user sees as "the card frame")
 *
 * Title bar, art window, type bar, text box and collector line all live INSIDE
 * the inner color frame. Their positions are derived from these tokens so
 * design changes ripple consistently.
 */

import type { FrameColor } from "@/types/card";

export const CARD_W = 745;
export const CARD_H = 1040;

export const BORDER = 22;        // outer black border thickness (≈3mm at 300 DPI)
export const CORNER_R = 28;      // outer rounded corner radius (≈3.5mm) — sleeve-friendly
export const INNER_CORNER_R = 18;

/** Title bar (card name + mana cost). */
export const TITLE_X = BORDER + 8;
export const TITLE_Y = BORDER + 22;
export const TITLE_W = CARD_W - 2 * (BORDER + 8);
export const TITLE_H = 70;

/** Art window. */
export const ART_X = BORDER + 8;
export const ART_Y = TITLE_Y + TITLE_H + 6;
export const ART_W = CARD_W - 2 * (BORDER + 8);
export const ART_H = 490;

/** Type line. */
export const TYPE_X = ART_X;
export const TYPE_Y = ART_Y + ART_H + 6;
export const TYPE_W = ART_W;
export const TYPE_H = 50;

/** Rules / flavor text box. */
export const TEXT_X = ART_X;
export const TEXT_Y = TYPE_Y + TYPE_H + 6;
export const TEXT_W = ART_W;
export const TEXT_H = 320;

/** Power/Toughness box (bottom-right inset over the text box). */
export const PT_W = 110;
export const PT_H = 60;
export const PT_X = ART_X + ART_W - PT_W - 4;
export const PT_Y = TEXT_Y + TEXT_H - PT_H + 16;

/** Loyalty badge (bottom-right of art frame, just inside text box). */
export const LOYALTY_SIZE = 90;
export const LOYALTY_X = ART_X + ART_W - LOYALTY_SIZE - 8;
export const LOYALTY_Y = TEXT_Y + TEXT_H - LOYALTY_SIZE / 2 - 4;

/** Collector / artist line at the very bottom. */
export const COLLECTOR_X = ART_X;
export const COLLECTOR_Y = TEXT_Y + TEXT_H + 8;
export const COLLECTOR_W = TEXT_W;
export const COLLECTOR_H = 30;

/**
 * Frame color stops. Each color resolves to:
 *  - top:    inner band top color (the bright/saturated side)
 *  - mid:    midpoint, used to add gradient richness
 *  - bottom: inner band bottom color (the deep/saturated side)
 *  - ink:    text color used on this frame
 */
export const FRAME_COLOR_STOPS: Record<FrameColor, { top: string; mid: string; bottom: string; ink: string }> = {
  white:      { top: "#fdf7c8", mid: "#ecd87f", bottom: "#c5a64a", ink: "#26200f" },
  blue:       { top: "#a7d9f2", mid: "#4d8fc1", bottom: "#1f5587", ink: "#06223a" },
  black:      { top: "#544b44", mid: "#221d1a", bottom: "#0a0807", ink: "#f1e6d2" },
  red:        { top: "#f1a481", mid: "#c45826", bottom: "#742a0e", ink: "#290a04" },
  green:      { top: "#b7d6a8", mid: "#5d8a51", bottom: "#21401a", ink: "#0b1a08" },
  multicolor: { top: "#f1da80", mid: "#c69d2b", bottom: "#6e4d10", ink: "#28190a" },
  colorless:  { top: "#dadbd8", mid: "#9a9b97", bottom: "#535453", ink: "#0d0d0c" },
  land:       { top: "#cfb491", mid: "#876043", bottom: "#3f2914", ink: "#1a0e05" },
};

/** Slightly darker stops used on the rim around the art window and text box. */
export const FRAME_RIM_STOPS: Record<FrameColor, { top: string; bottom: string }> = {
  white:      { top: "#9c7d2a", bottom: "#594314" },
  blue:       { top: "#143b5b", bottom: "#06223a" },
  black:      { top: "#1a1612", bottom: "#040302" },
  red:        { top: "#5a1f0c", bottom: "#291006" },
  green:      { top: "#2a4322", bottom: "#0e1d07" },
  multicolor: { top: "#5d4310", bottom: "#28190a" },
  colorless:  { top: "#3b3c3a", bottom: "#181918" },
  land:       { top: "#3f2914", bottom: "#1c0e06" },
};

/** Slightly brighter highlight used on the inner bevel rim above the art/text. */
export const FRAME_HIGHLIGHT_STOPS: Record<FrameColor, string> = {
  white:      "rgba(255,250,220,0.55)",
  blue:       "rgba(200,225,245,0.4)",
  black:      "rgba(150,140,130,0.32)",
  red:        "rgba(255,200,170,0.45)",
  green:      "rgba(220,235,200,0.4)",
  multicolor: "rgba(255,240,195,0.55)",
  colorless:  "rgba(230,230,228,0.45)",
  land:       "rgba(240,220,180,0.4)",
};

/** Color used for text body (rules + flavor) in the text box. Always near-black. */
export const TEXT_BOX_BG = "#f6efde";
export const TEXT_INK = "#0b0a08";

/** Rarity stripe accent color above the type bar on rare+/mythic/special. */
export const RARITY_STRIPE: Record<string, string | null> = {
  common:   null,
  uncommon: "linear-gradient(to right, rgba(200,210,215,0.0), rgba(200,210,215,0.85), rgba(200,210,215,0.0))",
  rare:     "linear-gradient(to right, rgba(225,201,124,0.0), rgba(225,201,124,0.95), rgba(225,201,124,0.0))",
  mythic:   "linear-gradient(to right, rgba(201,91,30,0.0), rgba(201,91,30,0.95), rgba(201,91,30,0.0))",
  special:  "linear-gradient(to right, rgba(139,58,168,0.0), rgba(139,58,168,0.95), rgba(139,58,168,0.0))",
};
