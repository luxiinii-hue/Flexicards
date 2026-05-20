/**
 * Background fill colors for each mana pip. Approximates the M15 mana symbol
 * palette without copying Wizards' own SVG assets.
 */
export const MANA_BG: Record<string, string> = {
  w: "#fffbd5",
  u: "#aabce2",
  b: "#cbc2bf",
  r: "#f9aa8f",
  g: "#9bd3ae",
  c: "#cccac4",
  generic: "#cccac4",
  x: "#cccac4",
  s: "#e9eef4",
  p: "#cccac4",
};

export const MANA_INK: Record<string, string> = {
  w: "#1a1810",
  u: "#0c2440",
  b: "#1b1715",
  r: "#3a1408",
  g: "#0e2114",
  c: "#1a1916",
  generic: "#1a1916",
  x: "#1a1916",
  s: "#13334a",
  p: "#1a1916",
};

export function colorForLetter(letter: string): string {
  return MANA_BG[letter.toLowerCase()] ?? MANA_BG.generic!;
}
export function inkForLetter(letter: string): string {
  return MANA_INK[letter.toLowerCase()] ?? MANA_INK.generic!;
}
