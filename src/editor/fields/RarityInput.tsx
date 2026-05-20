import type { Rarity } from "@/types/card";

interface Props {
  value: Rarity;
  onChange: (v: Rarity) => void;
}

const RARITIES: { value: Rarity; label: string; glow: string }[] = [
  { value: "common",   label: "Common",   glow: "#5a4a3a" },
  { value: "uncommon", label: "Uncommon", glow: "#9ec3d8" },
  { value: "rare",     label: "Rare",     glow: "#d9b266" },
  { value: "mythic",   label: "Mythic",   glow: "#ff7a3a" },
  { value: "special",  label: "Special",  glow: "#b388e0" },
];

export function RarityInput({ value, onChange }: Props): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1">
      {RARITIES.map((r) => {
        const isActive = value === r.value;
        return (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange(r.value)}
            className="flex items-center gap-2 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
            style={{
              background: isActive ? "linear-gradient(180deg, #2a1d0c, #1a1208)" : "linear-gradient(180deg, #1a1208, #110b05)",
              border: "1px solid #2a1c0c",
              color: "#d9b266",
              boxShadow: isActive ? "0 0 0 1px rgba(217,178,102,0.4), 0 0 12px rgba(217,178,102,0.18)" : "none",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: 999,
                background: r.glow,
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.5), 0 0 6px ${r.glow}`,
              }}
            />
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
