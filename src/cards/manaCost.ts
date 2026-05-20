/**
 * Mana cost / mana symbol parsing.
 *
 * Tokens in the input string look like {W}, {U}, {B}, {R}, {G}, {C} (colorless),
 * {S} (snow), {X}, {Y}, {Z}, {0}..{20}, {W/U} (hybrid), {2/W} (hybrid generic),
 * {P} (phyrexian), {W/P} (phyrexian colored), {T}, {Q}, {E} (energy), {CHAOS},
 * {TK} (ticket), {½}, {∞}, etc.
 *
 * We tokenize liberally and pass through anything we don't recognize as a
 * "free text" token so the rendering layer can decide what to do with it.
 */

export type ManaToken = {
  raw: string; // original "{W/U}"
  kind:
    | "color"
    | "colorless"
    | "generic"
    | "x"
    | "snow"
    | "hybrid"
    | "phyrexian"
    | "phyrexian-color"
    | "tap"
    | "untap"
    | "energy"
    | "loyalty"
    | "infinity"
    | "half"
    | "unknown";
  /**
   * Class name used by mana-font (with the leading "ms-" prefix stripped).
   * E.g. {W} → "w", {U/W} → "wu", {2/W} → "2w", {W/P} → "wp", {T} → "tap"
   */
  manaClass: string;
};

const COLORS = new Set(["W", "U", "B", "R", "G"]);

export function parseManaCost(cost: string): ManaToken[] {
  if (!cost) return [];
  const tokens: ManaToken[] = [];
  const re = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(cost)) !== null) {
    const raw = match[0];
    const inner = match[1]?.toUpperCase() ?? "";
    tokens.push(classify(raw, inner));
  }
  return tokens;
}

function classify(raw: string, inner: string): ManaToken {
  if (inner === "T") return { raw, kind: "tap", manaClass: "tap" };
  if (inner === "Q") return { raw, kind: "untap", manaClass: "untap" };
  if (inner === "E") return { raw, kind: "energy", manaClass: "e" };
  if (inner === "S") return { raw, kind: "snow", manaClass: "s" };
  if (inner === "X" || inner === "Y" || inner === "Z") {
    return { raw, kind: "x", manaClass: inner.toLowerCase() };
  }
  if (inner === "C") return { raw, kind: "colorless", manaClass: "c" };
  if (inner === "P") return { raw, kind: "phyrexian", manaClass: "p" };
  if (inner === "½") return { raw, kind: "half", manaClass: "half" };
  if (inner === "∞") return { raw, kind: "infinity", manaClass: "infinity" };
  if (/^\d+$/.test(inner)) {
    return { raw, kind: "generic", manaClass: inner };
  }
  if (inner.length === 1 && COLORS.has(inner)) {
    return { raw, kind: "color", manaClass: inner.toLowerCase() };
  }
  // Hybrid like W/U or 2/W or W/P
  if (inner.includes("/")) {
    const parts = inner.split("/");
    const sorted = [...parts].sort().join("").toLowerCase();
    if (parts.length === 2 && parts.includes("P")) {
      return { raw, kind: "phyrexian-color", manaClass: `${parts[0]?.toLowerCase()}p` };
    }
    return { raw, kind: "hybrid", manaClass: sorted };
  }
  return { raw, kind: "unknown", manaClass: inner.toLowerCase() };
}

/**
 * Resolve the dominant frame color from a mana cost.
 * Returns "land" only if forced by the caller; this function focuses on cost-derived color.
 */
export function frameColorFromCost(cost: string): {
  color: "white" | "blue" | "black" | "red" | "green" | "multicolor" | "colorless";
} {
  const tokens = parseManaCost(cost);
  const colors = new Set<string>();
  for (const t of tokens) {
    if (t.kind === "color") colors.add(t.manaClass);
    else if (t.kind === "hybrid") {
      for (const c of t.manaClass) if ("wubrg".includes(c)) colors.add(c);
    } else if (t.kind === "phyrexian-color") {
      const first = t.manaClass[0];
      if (first && "wubrg".includes(first)) colors.add(first);
    }
  }
  if (colors.size === 0) return { color: "colorless" };
  if (colors.size === 1) {
    const only = [...colors][0];
    return {
      color:
        only === "w" ? "white"
        : only === "u" ? "blue"
        : only === "b" ? "black"
        : only === "r" ? "red"
        : "green",
    };
  }
  return { color: "multicolor" };
}
