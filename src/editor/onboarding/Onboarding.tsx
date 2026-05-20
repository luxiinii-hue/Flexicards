/**
 * First-launch onboarding controller. Drives two steps:
 *   1. TypePicker — pick a Magic card type (with random Scryfall examples)
 *   2. FrameStylePicker — pick a visual frame style
 * After step 2, creates a blank card with the chosen type's layout + the
 * chosen frame style and the user enters the regular editor.
 */
import { useState } from "react";
import { useStore } from "@/state/store";
import { createCard } from "@/state/factories";
import { db } from "@/state/db";
import { TypePicker } from "./TypePicker";
import { FrameStylePicker } from "./FrameStylePicker";
import { type CardType } from "./types";
import type { Card, FrameStyle } from "@/types/card";
import { pushToast } from "../toastBus";

interface Props {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: Props): JSX.Element {
  const [step, setStep] = useState<"type" | "style">("type");
  const [chosenType, setChosenType] = useState<CardType | null>(null);
  const activeCollectionId = useStore((s) => s.activeCollectionId);
  const setActiveCard = useStore((s) => s.setActiveCard);

  async function commit(type: CardType, frameStyle: FrameStyle) {
    if (!activeCollectionId) {
      onComplete();
      return;
    }
    const card = createCard(type.layout, { collectionId: activeCollectionId });
    if (type.defaultTypeLine) card.typeLine = type.defaultTypeLine;
    (card as Card).frameStyle = frameStyle;

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

    const [cards, collections] = await Promise.all([
      db.cards.orderBy("updatedAt").reverse().toArray(),
      db.collections.orderBy("createdAt").toArray(),
    ]);
    useStore.setState({ cards, collections });
    setActiveCard(card.id);
    pushToast(`Forged a ${type.label} in ${frameStyle} frame`, "success");
    onComplete();
  }

  if (step === "type") {
    return (
      <TypePicker
        onPick={(type) => {
          setChosenType(type);
          setStep("style");
        }}
        onSkip={onComplete}
      />
    );
  }

  return (
    <FrameStylePicker
      type={chosenType!}
      onPick={(style) => void commit(chosenType!, style)}
      onBack={() => {
        setChosenType(null);
        setStep("type");
      }}
    />
  );
}
