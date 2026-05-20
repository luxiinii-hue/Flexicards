import type { Card } from "@/types/card";
import { ALL_FRAME_STYLES, FRAME_STYLE_LABELS } from "@/types/card";
import { useStore } from "@/state/store";
import { Field, Section, TextInput, TextArea, NumberInput, ToggleRow, SelectInput } from "../fields/Field";
import { ManaCostInput } from "../fields/ManaCostInput";
import { RulesTextEditor } from "../fields/RulesTextEditor";
import { RarityInput } from "../fields/RarityInput";
import { FrameColorInput } from "../fields/FrameColorInput";
import { ArtUploader } from "../fields/ArtUploader";

interface Props {
  card: Card;
}

/**
 * One big form that adapts to the active card's layout. Common fields appear at
 * the top; layout-specific fields follow.
 */
export function CardForm({ card }: Props): JSX.Element {
  const updateCard = useStore((s) => s.updateCard);
  const patch = (p: Partial<Card>) => void updateCard(card.id, p);

  return (
    <div>
      <Section title="Identity" collapsible>
        <Field label="Name">
          <TextInput value={card.name} onChange={(v) => patch({ name: v })} placeholder="Lightning Bolt" />
        </Field>
        {card.layout !== "token" && card.layout !== "split" ? (
          <Field label="Mana cost">
            <ManaCostInput value={card.manaCost} onChange={(v) => patch({ manaCost: v })} />
          </Field>
        ) : null}
        <Field label="Type line">
          <TextInput value={card.typeLine} onChange={(v) => patch({ typeLine: v })} placeholder="Creature — Human Wizard" />
        </Field>
        <Field label="Frame color" hint="Auto by default">
          <FrameColorInput value={card.borderColor} onChange={(v) => patch({ borderColor: v })} />
        </Field>
        <Field label="Frame style" hint="Visual skin">
          <SelectInput
            value={card.frameStyle ?? "standard"}
            onChange={(v) => patch({ frameStyle: v })}
            options={ALL_FRAME_STYLES.map((s) => ({ value: s, label: FRAME_STYLE_LABELS[s] }))}
          />
        </Field>
        <Field label="Rarity">
          <RarityInput value={card.rarity} onChange={(v) => patch({ rarity: v })} />
        </Field>
      </Section>

      <Section title="Art" collapsible>
        <Field label="Art image">
          <ArtUploader value={card.artImage} onChange={(v) => patch({ artImage: v })} />
        </Field>
        <Field label="Artist">
          <TextInput value={card.artist} onChange={(v) => patch({ artist: v })} placeholder="You" />
        </Field>
      </Section>

      <LayoutSpecificFields card={card} />

      <Section title="Rules text" collapsible defaultOpen={!isPlaneswalkerish(card)}>
        {/* Planeswalkers and classes use their own per-ability text fields elsewhere */}
        {!isPlaneswalkerish(card) ? (
          <Field label={card.layout === "saga" ? "Reminder text (optional)" : "Rules text"}>
            <RulesTextEditor value={card.rulesText} onChange={(v) => patch({ rulesText: v })} rows={5} />
          </Field>
        ) : (
          <div className="text-xs text-ink-500">
            This layout uses per-ability rows below. Use the rules text field on each ability.
          </div>
        )}
        <Field label="Flavor text">
          <TextArea value={card.flavorText ?? ""} onChange={(v) => patch({ flavorText: v })} rows={3} placeholder="Optional flavor quote" />
        </Field>
      </Section>

      <Section title="Collector info" collapsible defaultOpen={false}>
        <Field label="Set code">
          <TextInput value={card.setCode ?? ""} onChange={(v) => patch({ setCode: v.toUpperCase().slice(0, 4) })} placeholder="FLX" />
        </Field>
        <Field label="Collector number">
          <TextInput value={card.collectorNumber ?? ""} onChange={(v) => patch({ collectorNumber: v })} placeholder="001" />
        </Field>
      </Section>
    </div>
  );
}

function isPlaneswalkerish(card: Card): boolean {
  if (card.layout === "planeswalker") return true;
  if (card.layout === "custom" && card.show.abilities) return true;
  return false;
}

function LayoutSpecificFields({ card }: { card: Card }): JSX.Element | null {
  const updateCard = useStore((s) => s.updateCard);
  const patch = (p: Partial<Card>) => void updateCard(card.id, p);

  switch (card.layout) {
    case "creature":
    case "token":
      return (
        <Section title="Stats" collapsible>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Power"><TextInput value={card.power ?? ""} onChange={(v) => patch({ power: v } as Partial<Card>)} placeholder="2" /></Field>
            <Field label="Toughness"><TextInput value={card.toughness ?? ""} onChange={(v) => patch({ toughness: v } as Partial<Card>)} placeholder="2" /></Field>
          </div>
        </Section>
      );

    case "planeswalker":
      return (
        <Section title="Planeswalker" collapsible>
          <Field label="Starting loyalty">
            <NumberInput value={card.startingLoyalty} onChange={(v) => patch({ startingLoyalty: v } as Partial<Card>)} min={0} max={20} />
          </Field>
          <Field label="Abilities">
            <div className="space-y-2">
              {card.abilities.map((ab, i) => (
                <div key={i} className="rounded-md border border-ink-200 bg-white p-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={ab.cost}
                      onChange={(e) => {
                        const next = [...card.abilities];
                        next[i] = { ...ab, cost: e.target.value };
                        patch({ abilities: next } as Partial<Card>);
                      }}
                      className="w-16 rounded border border-ink-300 px-1 py-0.5 text-center text-xs"
                      placeholder="+1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = card.abilities.filter((_, j) => j !== i);
                        patch({ abilities: next } as Partial<Card>);
                      }}
                      className="ml-auto rounded px-1.5 py-0.5 text-xs text-red-700 hover:bg-red-50"
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={ab.text}
                    onChange={(e) => {
                      const next = [...card.abilities];
                      next[i] = { ...ab, text: e.target.value };
                      patch({ abilities: next } as Partial<Card>);
                    }}
                    rows={2}
                    className="mt-1 w-full rounded border border-ink-300 px-1.5 py-1 text-xs"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => patch({ abilities: [...card.abilities, { cost: "0", text: "" }] } as Partial<Card>)}
                className="w-full rounded-md border border-dashed border-ink-300 px-2 py-1.5 text-xs text-ink-600 hover:bg-white"
              >
                + Add ability
              </button>
            </div>
          </Field>
        </Section>
      );

    case "saga":
      return (
        <Section title="Saga chapters" collapsible>
          {card.chapters.map((ch, i) => (
            <div key={i} className="rounded-md border border-ink-200 bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  value={ch.numerals.join(",")}
                  onChange={(e) => {
                    const numerals = e.target.value
                      .split(",")
                      .map((n) => Number(n.trim()))
                      .filter((n) => Number.isFinite(n) && n > 0);
                    const next = [...card.chapters];
                    next[i] = { ...ch, numerals };
                    patch({ chapters: next } as Partial<Card>);
                  }}
                  className="w-20 rounded border border-ink-300 px-1 py-0.5 text-center text-xs"
                  placeholder="1,2"
                />
                <span className="text-xs text-ink-500">Chapter {i + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = card.chapters.filter((_, j) => j !== i);
                    patch({ chapters: next } as Partial<Card>);
                  }}
                  className="ml-auto text-xs text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={ch.text}
                onChange={(e) => {
                  const next = [...card.chapters];
                  next[i] = { ...ch, text: e.target.value };
                  patch({ chapters: next } as Partial<Card>);
                }}
                rows={2}
                className="mt-1 w-full rounded border border-ink-300 px-1.5 py-1 text-xs"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch({
                chapters: [...card.chapters, { numerals: [card.chapters.length + 1], text: "" }],
              } as Partial<Card>)
            }
            className="w-full rounded-md border border-dashed border-ink-300 px-2 py-1.5 text-xs text-ink-600 hover:bg-white"
          >
            + Add chapter
          </button>
        </Section>
      );

    case "adventure":
      return (
        <>
          <Section title="Adventure side" collapsible>
            <Field label="Adventure name">
              <TextInput
                value={card.adventure.name}
                onChange={(v) => patch({ adventure: { ...card.adventure, name: v } } as Partial<Card>)}
              />
            </Field>
            <Field label="Adventure type">
              <TextInput
                value={card.adventure.typeLine}
                onChange={(v) => patch({ adventure: { ...card.adventure, typeLine: v } } as Partial<Card>)}
              />
            </Field>
            <Field label="Adventure cost">
              <ManaCostInput
                value={card.adventure.manaCost}
                onChange={(v) => patch({ adventure: { ...card.adventure, manaCost: v } } as Partial<Card>)}
              />
            </Field>
            <Field label="Adventure rules">
              <RulesTextEditor
                value={card.adventure.rulesText}
                onChange={(v) => patch({ adventure: { ...card.adventure, rulesText: v } } as Partial<Card>)}
                rows={3}
              />
            </Field>
          </Section>
          <Section title="Creature stats" collapsible>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Power"><TextInput value={card.power} onChange={(v) => patch({ power: v } as Partial<Card>)} /></Field>
              <Field label="Toughness"><TextInput value={card.toughness} onChange={(v) => patch({ toughness: v } as Partial<Card>)} /></Field>
            </div>
          </Section>
        </>
      );

    case "split":
      return (
        <Section title="Split halves" collapsible>
          {([
            { key: "leftHalf" as const, label: "Left" },
            { key: "rightHalf" as const, label: "Right" },
          ]).map(({ key, label }) => {
            const h = card[key];
            return (
              <div key={key} className="rounded-md border border-ink-200 bg-white p-2 space-y-2">
                <div className="text-xs font-semibold text-ink-700">{label} half</div>
                <Field label="Name">
                  <TextInput value={h.name} onChange={(v) => patch({ [key]: { ...h, name: v } } as Partial<Card>)} />
                </Field>
                <Field label="Mana cost">
                  <ManaCostInput value={h.manaCost} onChange={(v) => patch({ [key]: { ...h, manaCost: v } } as Partial<Card>)} />
                </Field>
                <Field label="Type line">
                  <TextInput value={h.typeLine} onChange={(v) => patch({ [key]: { ...h, typeLine: v } } as Partial<Card>)} />
                </Field>
                <Field label="Rules">
                  <RulesTextEditor value={h.rulesText} onChange={(v) => patch({ [key]: { ...h, rulesText: v } } as Partial<Card>)} rows={3} />
                </Field>
              </div>
            );
          })}
          <ToggleRow label="Fuse" checked={card.fuse ?? false} onChange={(v) => patch({ fuse: v } as Partial<Card>)} />
        </Section>
      );

    case "transform":
    case "modal_dfc":
      return <BackFaceFields card={card} />;

    case "class":
      return (
        <Section title="Class levels" collapsible>
          <div className="text-xs text-ink-500">
            Base class text goes in the main Rules section. Add upgrade levels here:
          </div>
          {card.levels.map((lvl, i) => (
            <div key={i} className="rounded-md border border-ink-200 bg-white p-2 space-y-1">
              <Field label={`Level ${i + 2} cost`}>
                <ManaCostInput
                  value={lvl.cost}
                  onChange={(v) => {
                    const next = [...card.levels];
                    next[i] = { ...lvl, cost: v };
                    patch({ levels: next } as Partial<Card>);
                  }}
                />
              </Field>
              <Field label="Level text">
                <RulesTextEditor
                  value={lvl.text}
                  onChange={(v) => {
                    const next = [...card.levels];
                    next[i] = { ...lvl, text: v };
                    patch({ levels: next } as Partial<Card>);
                  }}
                  rows={2}
                />
              </Field>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => patch({ levels: card.levels.filter((_, j) => j !== i) } as Partial<Card>)}
                  className="text-xs text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch({ levels: [...card.levels, { cost: "", text: "" }] } as Partial<Card>)}
            className="w-full rounded-md border border-dashed border-ink-300 px-2 py-1.5 text-xs text-ink-600 hover:bg-white"
          >
            + Add level
          </button>
        </Section>
      );

    case "leveler":
      return (
        <Section title="Leveler" collapsible>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Base power"><TextInput value={card.basePower} onChange={(v) => patch({ basePower: v } as Partial<Card>)} /></Field>
            <Field label="Base toughness"><TextInput value={card.baseToughness} onChange={(v) => patch({ baseToughness: v } as Partial<Card>)} /></Field>
          </div>
          <div className="text-xs text-ink-500">Levels</div>
          {card.levels.map((lvl, i) => (
            <div key={i} className="rounded-md border border-ink-200 bg-white p-2 space-y-1">
              <div className="grid grid-cols-3 gap-2">
                <Field label="Range"><TextInput value={lvl.range} onChange={(v) => patchLevel(i, { range: v })} /></Field>
                <Field label="P"><TextInput value={lvl.power} onChange={(v) => patchLevel(i, { power: v })} /></Field>
                <Field label="T"><TextInput value={lvl.toughness} onChange={(v) => patchLevel(i, { toughness: v })} /></Field>
              </div>
              <Field label="Abilities">
                <TextArea
                  value={lvl.abilities}
                  onChange={(v) => patchLevel(i, { abilities: v })}
                  rows={2}
                />
              </Field>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => patch({ levels: card.levels.filter((_, j) => j !== i) } as Partial<Card>)}
                  className="text-xs text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch({ levels: [...card.levels, { range: "", power: "", toughness: "", abilities: "" }] } as Partial<Card>)}
            className="w-full rounded-md border border-dashed border-ink-300 px-2 py-1.5 text-xs text-ink-600 hover:bg-white"
          >
            + Add level
          </button>
        </Section>
      );

    case "custom":
      return (
        <Section title="Custom layout" collapsible>
          <ToggleRow
            label="Show power/toughness"
            checked={card.show.powerToughness}
            onChange={(v) => patch({ show: { ...card.show, powerToughness: v } } as Partial<Card>)}
          />
          {card.show.powerToughness ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Power"><TextInput value={card.power ?? ""} onChange={(v) => patch({ power: v } as Partial<Card>)} /></Field>
              <Field label="Toughness"><TextInput value={card.toughness ?? ""} onChange={(v) => patch({ toughness: v } as Partial<Card>)} /></Field>
            </div>
          ) : null}
          <ToggleRow
            label="Show loyalty"
            checked={card.show.loyalty}
            onChange={(v) => patch({ show: { ...card.show, loyalty: v } } as Partial<Card>)}
          />
          {card.show.loyalty ? (
            <Field label="Loyalty">
              <NumberInput value={card.loyalty ?? 3} onChange={(v) => patch({ loyalty: v } as Partial<Card>)} min={0} />
            </Field>
          ) : null}
          <ToggleRow
            label="Show ability rows"
            checked={card.show.abilities}
            onChange={(v) => patch({ show: { ...card.show, abilities: v } } as Partial<Card>)}
          />
          {card.show.abilities ? (
            <Field label="Abilities">
              <div className="space-y-2">
                {(card.abilities ?? []).map((ab, i) => (
                  <div key={i} className="rounded-md border border-ink-200 bg-white p-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={ab.cost}
                        onChange={(e) => {
                          const next = [...(card.abilities ?? [])];
                          next[i] = { ...ab, cost: e.target.value };
                          patch({ abilities: next } as Partial<Card>);
                        }}
                        className="w-16 rounded border border-ink-300 px-1 py-0.5 text-center text-xs"
                        placeholder="•"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (card.abilities ?? []).filter((_, j) => j !== i);
                          patch({ abilities: next } as Partial<Card>);
                        }}
                        className="ml-auto text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={ab.text}
                      onChange={(e) => {
                        const next = [...(card.abilities ?? [])];
                        next[i] = { ...ab, text: e.target.value };
                        patch({ abilities: next } as Partial<Card>);
                      }}
                      rows={2}
                      className="mt-1 w-full rounded border border-ink-300 px-1.5 py-1 text-xs"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => patch({ abilities: [...(card.abilities ?? []), { cost: "•", text: "" }] } as Partial<Card>)}
                  className="w-full rounded-md border border-dashed border-ink-300 px-2 py-1.5 text-xs text-ink-600 hover:bg-white"
                >
                  + Add row
                </button>
              </div>
            </Field>
          ) : null}
        </Section>
      );

    case "normal":
    default:
      return null;
  }

  function patchLevel(i: number, partial: Partial<{ range: string; power: string; toughness: string; abilities: string }>) {
    if (card.layout !== "leveler") return;
    const next = [...card.levels];
    const current = next[i];
    if (!current) return;
    next[i] = { ...current, ...partial };
    patch({ levels: next } as Partial<Card>);
  }
}

interface BackFaceFieldsProps {
  card: Card & { layout: "transform" | "modal_dfc" };
}

function BackFaceFields({ card }: BackFaceFieldsProps): JSX.Element {
  const updateCard = useStore((s) => s.updateCard);
  const back = card.backFace;
  function patchBack(p: Record<string, unknown>) {
    const next = { ...back, ...p } as typeof back;
    void updateCard(card.id, { backFace: next } as Partial<Card>);
  }
  return (
    <Section title="Back face" collapsible>
      <Field label="Back name"><TextInput value={back.name} onChange={(v) => patchBack({ name: v })} /></Field>
      <Field label="Back mana cost">
        <ManaCostInput value={back.manaCost} onChange={(v) => patchBack({ manaCost: v })} />
      </Field>
      <Field label="Back type line">
        <TextInput value={back.typeLine} onChange={(v) => patchBack({ typeLine: v })} />
      </Field>
      <Field label="Back rules">
        <RulesTextEditor value={back.rulesText} onChange={(v) => patchBack({ rulesText: v })} rows={4} />
      </Field>
      <Field label="Back flavor">
        <TextArea value={back.flavorText ?? ""} onChange={(v) => patchBack({ flavorText: v })} rows={2} />
      </Field>
      {back.layout === "creature" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Back P"><TextInput value={back.power} onChange={(v) => patchBack({ power: v })} /></Field>
          <Field label="Back T"><TextInput value={back.toughness} onChange={(v) => patchBack({ toughness: v })} /></Field>
        </div>
      ) : null}
      {back.layout === "planeswalker" ? (
        <Field label="Back starting loyalty">
          <NumberInput value={back.startingLoyalty} onChange={(v) => patchBack({ startingLoyalty: v })} />
        </Field>
      ) : null}
    </Section>
  );
}
