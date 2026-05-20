/**
 * First-launch onboarding controller. Drives two steps:
 *   1. TypePicker — pick a Magic card type (with random Scryfall examples)
 *   2. VariantPicker — pick a specific layout variant for that type
 * After step 2, creates a blank card with the chosen layout and the user
 * enters the regular editor.
 */
import { useState } from "react";
import { useStore } from "@/state/store";
import { createCard } from "@/state/factories";
import { db } from "@/state/db";
import { TypePicker } from "./TypePicker";
import { VariantPicker } from "./VariantPicker";
import { type CardType, type TypeVariant } from "./types";
import { pushToast } from "../toastBus";

interface Props {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: Props): JSX.Element {
  const [step, setStep] = useState<"type" | "variant">("type");
  const [chosenType, setChosenType] = useState<CardType | null>(null);
  const activeCollectionId = useStore((s) => s.activeCollectionId);
  const setActiveCard = useStore((s) => s.setActiveCard);

  async function commitVariant(variant: TypeVariant) {
    if (!activeCollectionId) {
      onComplete();
      return;
    }
    // Build a blank card with the chosen layout and apply variant defaults
    const card = createCard(variant.layout, { collectionId: activeCollectionId });
    if (variant.defaultTypeLine) card.typeLine = variant.defaultTypeLine;
    if (variant.defaultRarity) card.rarity = variant.defaultRarity;

    await db.transaction("rw", db.cards, db.collections, async () => {
      await db.cards.put(card);
      const col = await db.collections.get(activeCollectionId);
      if (col) {
        await db.collections.update(activeCollectionId, {
          cards: [...col.cards, card.id],
          updatedAt: Date.now(),
        });
      }
    });

    // Refresh store
    const [cards, collections] = await Promise.all([
      db.cards.orderBy("updatedAt").reverse().toArray(),
      db.collections.orderBy("createdAt").toArray(),
    ]);
    useStore.setState({ cards, collections });
    setActiveCard(card.id);
    pushToast(`Forged a ${variant.label}`, "success");
    onComplete();
  }

  if (step === "type") {
    return (
      <TypePicker
        onPick={(type) => {
          if (type.variants.length === 1) {
            // Single variant — skip step 2 entirely
            void commitVariant(type.variants[0]!);
          } else {
            setChosenType(type);
            setStep("variant");
          }
        }}
        onSkip={onComplete}
      />
    );
  }

  return (
    <VariantPicker
      type={chosenType!}
      onPick={commitVariant}
      onBack={() => {
        setChosenType(null);
        setStep("type");
      }}
    />
  );
}
