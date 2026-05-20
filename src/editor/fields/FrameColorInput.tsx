import type { FrameColor } from "@/types/card";

interface Props {
  value: FrameColor | undefined;
  onChange: (v: FrameColor | undefined) => void;
}

const SWATCHES: { value: FrameColor; label: string; color: string }[] = [
  { value: "white",      label: "W",  color: "#fbf6cf" },
  { value: "blue",       label: "U",  color: "#a9d6f0" },
  { value: "black",      label: "B",  color: "#3a342f" },
  { value: "red",        label: "R",  color: "#f4a380" },
  { value: "green",      label: "G",  color: "#b5d6a8" },
  { value: "multicolor", label: "M",  color: "#e3c87a" },
  { value: "colorless",  label: "C",  color: "#d5d4d0" },
  { value: "land",       label: "L",  color: "#cdb393" },
];

export function FrameColorInput({ value, onChange }: Props): JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`rounded-md border px-2 py-1 text-xs ${
            value === undefined ? "border-ink-700 bg-ink-100" : "border-ink-300 bg-white hover:bg-ink-50"
          }`}
          title="Auto-derive from mana cost"
        >
          Auto
        </button>
        {SWATCHES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
              value === s.value ? "border-ink-700 bg-ink-100" : "border-ink-300 bg-white hover:bg-ink-50"
            }`}
            title={`Force ${s.value}`}
          >
            <span className="inline-block h-3 w-3 rounded-full border border-ink-400" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
