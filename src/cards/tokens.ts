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

/** Frame color gradients. [top, bottom] for the inner color band. */
export const FRAME_COLOR_STOPS: Record<FrameColor, { top: string; bottom: string; ink: string }> = {
  white:      { top: "#fbf6cf", bottom: "#e6d68a", ink: "#3a3220" },
  blue:       { top: "#a9d6f0", bottom: "#3f7fb0", ink: "#0f2a44" },
  black:      { top: "#4b4540", bottom: "#161210", ink: "#f3eee5" },
  red:        { top: "#f4a380", bottom: "#c4502a", ink: "#3a120a" },
  green:      { top: "#b5d6a8", bottom: "#577a4d", ink: "#1a2c12" },
  multicolor: { top: "#efd682", bottom: "#b8923a", ink: "#3a2812" },
  colorless:  { top: "#d5d4d0", bottom: "#8e8d89", ink: "#1c1a18" },
  land:       { top: "#cdb393", bottom: "#876043", ink: "#22150c" },
};

/** Slightly darker stops used on the rim around the art window and text box. */
export const FRAME_RIM_STOPS: Record<FrameColor, { top: string; bottom: string }> = {
  white:      { top: "#d8c87a", bottom: "#a8954b" },
  blue:       { top: "#1f4a6b", bottom: "#0e2d49" },
  black:      { top: "#1c1815", bottom: "#0a0807" },
  red:        { top: "#823016", bottom: "#4e1d0e" },
  green:      { top: "#3d5832", bottom: "#1f2f19" },
  multicolor: { top: "#8e6e22", bottom: "#523f12" },
  colorless:  { top: "#67676a", bottom: "#363639" },
  land:       { top: "#604229", bottom: "#352213" },
};

/** Color used for text body (rules + flavor) in the text box. Always near-black. */
export const TEXT_BOX_BG = "#f6efde";
export const TEXT_INK = "#0b0a08";
