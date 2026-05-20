/**
 * Design tokens for card rendering. All coordinates are in the card's SVG
 * coordinate system (745 × 1040, ≈ 63×88mm at 300 DPI).
 */

import type { FrameColor } from "@/types/card";

export const CARD_W = 745;
export const CARD_H = 1040;

export const BORDER = 24;
export const CORNER_R = 28;
export const INNER_CORNER_R = 14;

/** Title bar (card name + mana cost). */
export const TITLE_X = BORDER + 8;
export const TITLE_Y = BORDER + 12;
export const TITLE_W = CARD_W - 2 * (BORDER + 8);
export const TITLE_H = 64;

/** Art window. */
export const ART_X = BORDER + 8;
export const ART_Y = TITLE_Y + TITLE_H + 6;
export const ART_W = CARD_W - 2 * (BORDER + 8);
export const ART_H = 470;

/** Type line. */
export const TYPE_X = ART_X;
export const TYPE_Y = ART_Y + ART_H + 6;
export const TYPE_W = ART_W;
export const TYPE_H = 48;

/** Rules / flavor text box. */
export const TEXT_X = ART_X;
export const TEXT_Y = TYPE_Y + TYPE_H + 6;
export const TEXT_W = ART_W;
export const TEXT_H = 332;

/** Power/Toughness box (bottom-right inset over the text box). */
export const PT_W = 110;
export const PT_H = 56;
export const PT_X = ART_X + ART_W - PT_W - 4;
export const PT_Y = TEXT_Y + TEXT_H - PT_H + 16;

/** Loyalty badge (bottom-right of art frame, just inside text box). */
export const LOYALTY_SIZE = 92;
export const LOYALTY_X = ART_X + ART_W - LOYALTY_SIZE - 8;
export const LOYALTY_Y = TEXT_Y + TEXT_H - LOYALTY_SIZE / 2 - 4;

/** Collector / artist line at the very bottom. */
export const COLLECTOR_X = ART_X;
export const COLLECTOR_Y = TEXT_Y + TEXT_H + 6;
export const COLLECTOR_W = TEXT_W;
export const COLLECTOR_H = 26;

/**
 * Frame color stops. Each color resolves to:
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

/** Color of the text box parchment. */
export const TEXT_BOX_BG = "#f6efde";
export const TEXT_INK = "#0b0908";
