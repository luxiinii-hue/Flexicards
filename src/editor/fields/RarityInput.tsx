import type { Rarity } from "@/types/card";

interface Props {
  value: Rarity;
  onChange: (v: Rarity) => void;
}

const RARITIES: { value: Rarity; label: string; color: string }[] = [
  { value: "common",   label: "Common",   color: "#1c1a18" },
  { value: "uncommon", label: "Uncommon", color: "#9aa6ad" },
  { value: "rare",     label: "Rare",     color: "#e1c97c" },
  { value: "mythic",   label: "Mythic",   color: "#c95b1e" },
  { value: "special",  label: "Special",  color: "#8b3aa8" },
];

export function RarityInput({ value, onChange }: Props): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1">
      {RARITIES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${
            value === r.value ? "border-ink-700 bg-ink-100" : "border-ink-300 bg-white hover:bg-ink-50"
          }`}
        >
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: r.color, border: "1px solid #00000022" }} />
          {r.label}
        </button>
      ))}
    </div>
  );
}
