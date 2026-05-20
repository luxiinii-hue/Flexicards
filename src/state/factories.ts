import type {
  AdventureCard,
  Card,
  CardLayout,
  ClassCard,
  CreatureCard,
  CustomCard,
  LevelerCard,
  ModalDfcCard,
  NormalCard,
  PlaneswalkerCard,
  SagaCard,
  SplitCard,
  TokenCard,
  TransformCard,
} from "@/types/card";

const newId = () => crypto.randomUUID();

interface BaseInit {
  id?: string;
  collectionId: string;
  name?: string;
  setCode?: string;
}

function baseDefaults(init: BaseInit, name: string) {
  const now = Date.now();
  return {
    id: init.id ?? newId(),
    collectionId: init.collectionId,
    name: init.name ?? name,
    manaCost: "",
    typeLine: "",
    rarity: "common" as const,
    artist: "",
    setCode: init.setCode ?? "FLX",
    language: "EN" as const,
    rulesText: "",
    flavorText: "",
    createdAt: now,
    updatedAt: now,
  };
}

export const factories = {
  normal(init: BaseInit): NormalCard {
    return { ...baseDefaults(init, "Untitled Spell"), layout: "normal", typeLine: "Sorcery" };
  },
  creature(init: BaseInit): CreatureCard {
    return {
      ...baseDefaults(init, "Untitled Creature"),
      layout: "creature",
      typeLine: "Creature — ",
      power: "1",
      toughness: "1",
    };
  },
  planeswalker(init: BaseInit): PlaneswalkerCard {
    return {
      ...baseDefaults(init, "Untitled Planeswalker"),
      layout: "planeswalker",
      typeLine: "Legendary Planeswalker — ",
      startingLoyalty: 3,
      abilities: [
        { cost: "+1", text: "" },
        { cost: "-2", text: "" },
        { cost: "-7", text: "" },
      ],
    };
  },
  saga(init: BaseInit): SagaCard {
    return {
      ...baseDefaults(init, "Untitled Saga"),
      layout: "saga",
      typeLine: "Enchantment — Saga",
      chapters: [
        { numerals: [1], text: "" },
        { numerals: [2], text: "" },
        { numerals: [3], text: "" },
      ],
    };
  },
  adventure(init: BaseInit): AdventureCard {
    return {
      ...baseDefaults(init, "Untitled Adventure"),
      layout: "adventure",
      typeLine: "Creature — ",
      power: "1",
      toughness: "1",
      adventure: {
        name: "Adventure Side",
        typeLine: "Instant — Adventure",
        manaCost: "",
        rulesText: "",
      },
    };
  },
  token(init: BaseInit): TokenCard {
    return {
      ...baseDefaults(init, "Untitled Token"),
      layout: "token",
      typeLine: "Token Creature — ",
      power: "1",
      toughness: "1",
    };
  },
  split(init: BaseInit): SplitCard {
    return {
      ...baseDefaults(init, "Untitled // Split"),
      layout: "split",
      leftHalf: { name: "Left", manaCost: "", typeLine: "Sorcery", rulesText: "" },
      rightHalf: { name: "Right", manaCost: "", typeLine: "Sorcery", rulesText: "" },
    };
  },
  modal_dfc(init: BaseInit): ModalDfcCard {
    const front = factories.normal(init);
    return {
      ...front,
      layout: "modal_dfc",
      backFace: { ...factories.normal({ collectionId: init.collectionId, name: "Back Face" }) },
    } satisfies ModalDfcCard;
  },
  transform(init: BaseInit): TransformCard {
    const front = factories.creature(init);
    return {
      ...front,
      layout: "transform",
      backFace: { ...factories.creature({ collectionId: init.collectionId, name: "Transformed Face" }) },
    } satisfies TransformCard;
  },
  class(init: BaseInit): ClassCard {
    return {
      ...baseDefaults(init, "Untitled Class"),
      layout: "class",
      typeLine: "Enchantment — Class",
      levels: [
        { cost: "", text: "" },
        { cost: "", text: "" },
      ],
    };
  },
  leveler(init: BaseInit): LevelerCard {
    return {
      ...baseDefaults(init, "Untitled Leveler"),
      layout: "leveler",
      typeLine: "Creature — ",
      basePower: "1",
      baseToughness: "1",
      levels: [
        { range: "1-3", power: "2", toughness: "2", abilities: "" },
        { range: "4+", power: "4", toughness: "4", abilities: "" },
      ],
    };
  },
  custom(init: BaseInit): CustomCard {
    return {
      ...baseDefaults(init, "Untitled Custom"),
      layout: "custom",
      typeLine: "",
      show: { powerToughness: false, loyalty: false, abilities: false },
    };
  },
};

export function createCard(layout: CardLayout, init: BaseInit): Card {
  return factories[layout](init);
}
