/**
 * Map a Scryfall card response into our internal Card model.
 * Falls back to "normal"/"creature" for layouts we don't render.
 */
import type {
  AdventureCard,
  Card,
  CardLayout,
  CreatureCard,
  ModalDfcCard,
  NormalCard,
  PlaneswalkerAbility,
  PlaneswalkerCard,
  Rarity,
  SagaCard,
  SagaChapter,
  SplitCard,
  TokenCard,
  TransformCard,
} from "@/types/card";
import type { ScryfallCard, ScryfallCardFace, ScryfallLayout } from "@/types/scryfall";

function mapLayout(layout: ScryfallLayout, typeLine: string): CardLayout {
  switch (layout) {
    case "normal":
      return typeLine.toLowerCase().includes("creature") ? "creature" : "normal";
    case "split":
      return "split";
    case "transform":
      return "transform";
    case "modal_dfc":
      return "modal_dfc";
    case "saga":
      return "saga";
    case "adventure":
      return "adventure";
    case "token":
    case "double_faced_token":
      return "token";
    case "leveler":
      return "leveler";
    case "class":
      return "class";
    case "flip":
      // No flip frame in v1 — fall back to normal
      return typeLine.toLowerCase().includes("creature") ? "creature" : "normal";
    case "meld":
    case "planar":
    case "scheme":
    case "vanguard":
    case "emblem":
    case "augment":
    case "host":
    case "art_series":
    case "reversible_card":
      return "normal";
  }
}

function rarity(r: ScryfallCard["rarity"]): Rarity {
  if (r === "bonus") return "special";
  return r;
}

function parsePlaneswalkerAbilities(oracleText: string): { abilities: PlaneswalkerAbility[] } {
  // Heuristic: lines starting with [+1], +1:, −2:, −7:, etc.
  const lines = oracleText.split(/\n+/);
  const abilities: PlaneswalkerAbility[] = [];
  for (const line of lines) {
    const m = line.match(/^([+\-−–]?\d+|0|X|−X):\s*(.+)$/);
    if (m) {
      abilities.push({ cost: m[1]!.replace("−", "-").replace("–", "-"), text: m[2]!.trim() });
    } else if (abilities.length && line.trim()) {
      // Continuation of the previous ability
      const last = abilities[abilities.length - 1]!;
      last.text = `${last.text}\n${line.trim()}`;
    }
  }
  return { abilities: abilities.length ? abilities : [{ cost: "0", text: oracleText }] };
}

function parseSagaChapters(oracleText: string): SagaChapter[] {
  // Scryfall sagas use lines like "I — Each opponent..." or "I, II — ..."
  const lines = oracleText.split(/\n+/);
  const ROMAN_RE = /^([IVX]+(?:,\s*[IVX]+)*)\s+[—–-]\s*(.+)$/;
  const ROMAN_TO_NUM: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };
  const out: SagaChapter[] = [];
  for (const line of lines) {
    const m = line.match(ROMAN_RE);
    if (m) {
      const numerals = m[1]!.split(/,\s*/).map((r) => ROMAN_TO_NUM[r] ?? (Number.parseInt(r) || 1));
      out.push({ numerals, text: m[2]!.trim() });
    }
  }
  return out.length > 0 ? out : [{ numerals: [1], text: oracleText }];
}

interface MapOpts {
  collectionId: string;
  setCode?: string;
}

export function scryfallToCard(sc: ScryfallCard, opts: MapOpts): Card {
  const id = crypto.randomUUID();
  const now = Date.now();
  const layout = mapLayout(sc.layout, sc.type_line);

  const baseFields = {
    id,
    collectionId: opts.collectionId,
    name: sc.name,
    manaCost: sc.mana_cost ?? "",
    typeLine: sc.type_line,
    rarity: rarity(sc.rarity),
    artist: sc.artist ?? "",
    setCode: opts.setCode ?? (sc.set ? sc.set.toUpperCase().slice(0, 4) : "FLX"),
    collectorNumber: sc.collector_number,
    language: "EN" as const,
    rulesText: sc.oracle_text ?? "",
    flavorText: sc.flavor_text ?? "",
    createdAt: now,
    updatedAt: now,
  };

  if (layout === "creature") {
    return { ...baseFields, layout: "creature", power: sc.power ?? "1", toughness: sc.toughness ?? "1" } satisfies CreatureCard;
  }
  if (layout === "normal") {
    return { ...baseFields, layout: "normal" } satisfies NormalCard;
  }
  if (layout === "planeswalker") {
    const { abilities } = parsePlaneswalkerAbilities(sc.oracle_text ?? "");
    const startingLoyalty = sc.loyalty ? Number.parseInt(sc.loyalty) : 3;
    return {
      ...baseFields,
      layout: "planeswalker",
      startingLoyalty: Number.isFinite(startingLoyalty) ? startingLoyalty : 3,
      abilities,
      rulesText: "",
    } satisfies PlaneswalkerCard;
  }
  if (layout === "saga") {
    return {
      ...baseFields,
      layout: "saga",
      chapters: parseSagaChapters(sc.oracle_text ?? ""),
      rulesText: "",
    } satisfies SagaCard;
  }
  if (layout === "adventure") {
    const main = sc.card_faces?.[0];
    const adventure = sc.card_faces?.[1];
    return {
      ...baseFields,
      layout: "adventure",
      power: sc.power ?? main?.power ?? "1",
      toughness: sc.toughness ?? main?.toughness ?? "1",
      manaCost: main?.mana_cost ?? sc.mana_cost ?? "",
      typeLine: main?.type_line ?? sc.type_line,
      rulesText: main?.oracle_text ?? sc.oracle_text ?? "",
      adventure: {
        name: adventure?.name ?? "Adventure",
        typeLine: adventure?.type_line ?? "Instant — Adventure",
        manaCost: adventure?.mana_cost ?? "",
        rulesText: adventure?.oracle_text ?? "",
      },
    } satisfies AdventureCard;
  }
  if (layout === "token") {
    return {
      ...baseFields,
      layout: "token",
      manaCost: "",
      power: sc.power ?? "1",
      toughness: sc.toughness ?? "1",
    } satisfies TokenCard;
  }
  if (layout === "split") {
    const a = sc.card_faces?.[0];
    const b = sc.card_faces?.[1];
    return {
      ...baseFields,
      layout: "split",
      manaCost: "",
      leftHalf: faceToSplitHalf(a, "Left"),
      rightHalf: faceToSplitHalf(b, "Right"),
    } satisfies SplitCard;
  }
  if (layout === "modal_dfc" || layout === "transform") {
    const front = sc.card_faces?.[0];
    const back = sc.card_faces?.[1];
    const frontIsCreature = (front?.type_line ?? sc.type_line).toLowerCase().includes("creature");
    const backIsCreature = (back?.type_line ?? "").toLowerCase().includes("creature");
    const backIsPW = (back?.type_line ?? "").toLowerCase().includes("planeswalker");
    const baseFront = frontIsCreature
      ? ({
          ...baseFields,
          layout: "creature" as const,
          name: front?.name ?? sc.name,
          manaCost: front?.mana_cost ?? sc.mana_cost ?? "",
          typeLine: front?.type_line ?? sc.type_line,
          rulesText: front?.oracle_text ?? "",
          flavorText: front?.flavor_text ?? "",
          power: front?.power ?? sc.power ?? "1",
          toughness: front?.toughness ?? sc.toughness ?? "1",
        } as CreatureCard)
      : ({
          ...baseFields,
          layout: "normal" as const,
          name: front?.name ?? sc.name,
          manaCost: front?.mana_cost ?? sc.mana_cost ?? "",
          typeLine: front?.type_line ?? sc.type_line,
          rulesText: front?.oracle_text ?? "",
          flavorText: front?.flavor_text ?? "",
        } as NormalCard);

    const backFace = backIsCreature
      ? ({
          name: back?.name ?? "Back",
          manaCost: back?.mana_cost ?? "",
          typeLine: back?.type_line ?? "",
          rulesText: back?.oracle_text ?? "",
          flavorText: back?.flavor_text ?? "",
          rarity: rarity(sc.rarity),
          artist: sc.artist ?? "",
          setCode: baseFields.setCode,
          language: "EN" as const,
          layout: "creature" as const,
          power: back?.power ?? "1",
          toughness: back?.toughness ?? "1",
        } as CreatureCard)
      : backIsPW
        ? ({
            name: back?.name ?? "Back",
            manaCost: back?.mana_cost ?? "",
            typeLine: back?.type_line ?? "",
            rulesText: "",
            flavorText: back?.flavor_text ?? "",
            rarity: rarity(sc.rarity),
            artist: sc.artist ?? "",
            setCode: baseFields.setCode,
            language: "EN" as const,
            layout: "planeswalker" as const,
            startingLoyalty: back?.loyalty ? Number.parseInt(back.loyalty) || 3 : 3,
            abilities: parsePlaneswalkerAbilities(back?.oracle_text ?? "").abilities,
          } as PlaneswalkerCard)
        : ({
            name: back?.name ?? "Back",
            manaCost: back?.mana_cost ?? "",
            typeLine: back?.type_line ?? "",
            rulesText: back?.oracle_text ?? "",
            flavorText: back?.flavor_text ?? "",
            rarity: rarity(sc.rarity),
            artist: sc.artist ?? "",
            setCode: baseFields.setCode,
            language: "EN" as const,
            layout: "normal" as const,
          } as NormalCard);

    if (layout === "modal_dfc") {
      return { ...(baseFront as Card), layout: "modal_dfc", backFace } as ModalDfcCard;
    }
    return { ...(baseFront as Card), layout: "transform", backFace } as TransformCard;
  }

  // Fallback
  return { ...baseFields, layout: "normal" } satisfies NormalCard;
}

function faceToSplitHalf(face: ScryfallCardFace | undefined, fallbackName: string) {
  return {
    name: face?.name ?? fallbackName,
    manaCost: face?.mana_cost ?? "",
    typeLine: face?.type_line ?? "Sorcery",
    rulesText: face?.oracle_text ?? "",
    flavorText: face?.flavor_text ?? "",
  };
}
