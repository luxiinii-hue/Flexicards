/**
 * Design tokens for card rendering. All coordinates are in the card's SVG
 * coordinate system (745 × 1040, ≈ 63×88mm at 300 DPI).
 *
 * Frame element positions are calibrated against the m15Frame*.png assets
 * (2010×2814 source), extracted from the m15Mask*.png alpha bounding boxes
 * at scale factor 745/2010 ≈ 0.371.
 */

import type { FrameColor } from "@/types/card";

export const CARD_W = 745;
export const CARD_H = 1040;

export const BORDER = 24;
export const CORNER_R = 30;
export const INNER_CORNER_R = 14;

/** Title bar (card name + mana cost). Matches m15MaskTitle bbox. */
export const TITLE_X = 44;
export const TITLE_Y = 50;
export const TITLE_W = 657;
export const TITLE_H = 60;

/** Art window — sits between title bar and type bar, inset slightly. */
export const ART_X = 44;
export const ART_Y = 115;
export const ART_W = 657;
export const ART_H = 465;

/** Type line. Matches m15MaskType bbox. */
export const TYPE_X = 44;
export const TYPE_Y = 585;
export const TYPE_W = 657;
export const TYPE_H = 60;

/** Rules / flavor text box. Matches m15MaskRules bbox. */
export const TEXT_X = 55;
export const TEXT_Y = 650;
export const TEXT_W = 635;
export const TEXT_H = 309;

/** Power/Toughness badge (m15PT*.png is 377×206 → 140×76 in SVG). */
export const PT_W = 140;
export const PT_H = 76;
export const PT_X = TEXT_X + TEXT_W - PT_W + 26;
export const PT_Y = TEXT_Y + TEXT_H - PT_H + 18;

/** Loyalty badge (planeswalkers). */
export const LOYALTY_SIZE = 92;
export const LOYALTY_X = ART_X + ART_W - LOYALTY_SIZE - 8;
export const LOYALTY_Y = TEXT_Y + TEXT_H - LOYALTY_SIZE / 2 - 4;

/** Collector / artist line — sits below the rules box at the bottom of the card. */
export const COLLECTOR_X = TEXT_X;
export const COLLECTOR_Y = TEXT_Y + TEXT_H + 6;
export const COLLECTOR_W = TEXT_W;
export const COLLECTOR_H = 26;

/**
 * Frame color stops. Used by fallback/borderless renderers when the m15
 * frame PNG is not in play.
 *  - top:    band top color
 *  - bottom: band bottom color (slightly darker)
 *  - plate:  color used for title/type/PT panels (darker shade in same family)
 *  - ink:    text color on the band
 */
export const FRAME_COLOR_STOPS: Record<FrameColor, { top: string; bottom: string; plate: string; ink: string }> = {
  white:      { top: "#f0e7c2", bottom: "#cbb476", plate: "#b69d4a", ink: "#1f1606" },
  blue:       { top: "#9ed3f0", bottom: "#3c7baf", plate: "#1f5587", ink: "#06223a" },
  black:      { top: "#3a3230", bottom: "#0e0a08", plate: "#0a0807", ink: "#e8dcc4" },
  red:        { top: "#ed9d77", bottom: "#a04220", plate: "#6e2a10", ink: "#1a0604" },
  green:      { top: "#aacba1", bottom: "#3f7142", plate: "#234a26", ink: "#08160a" },
  multicolor: { top: "#edd479", bottom: "#a37b1f", plate: "#7a5a10", ink: "#23170a" },
  colorless:  { top: "#cdcecb", bottom: "#7e7f7c", plate: "#5a5b58", ink: "#080807" },
  land:       { top: "#c2a884", bottom: "#7a553a", plate: "#4d3320", ink: "#180c04" },
};

export const TEXT_BOX_BG = "#f6efde";
export const TEXT_INK = "#0b0908";
