import type { FrameColor } from "@/types/card";

interface Props {
  value: FrameColor | undefined;
  onChange: (v: FrameColor | undefined) => void;
}

const SWATCHES: { value: FrameColor; label: string; bead: string }[] = [
  { value: "white",      label: "W",  bead: "#f6efc8" },
  { value: "blue",       label: "U",  bead: "#9ed3f0" },
  { value: "black",      label: "B",  bead: "#3a3230" },
  { value: "red",        label: "R",  bead: "#f0926a" },
  { value: "green",      label: "G",  bead: "#9bd3ae" },
  { value: "multicolor", label: "M",  bead: "#e3c87a" },
  { value: "colorless",  label: "C",  bead: "#cccac4" },
  { value: "land",       label: "L",  bead: "#a78867" },
];

export function FrameColorInput({ value, onChange }: Props): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1">
      <ColorChip active={value === undefined} bead="#d9b266" label="Auto" onClick={() => onChange(undefined)} />
      {SWATCHES.map((s) => (
        <ColorChip
          key={s.value}
          active={value === s.value}
          bead={s.bead}
          label={s.label}
          onClick={() => onChange(s.value)}
        />
      ))}
    </div>
  );
}

function ColorChip({ active, bead, label, onClick }: { active: boolean; bead: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
      style={{
        background: active ? "linear-gradient(180deg, #2a1d0c, #1a1208)" : "linear-gradient(180deg, #1a1208, #110b05)",
        border: "1px solid #2a1c0c",
        color: "#d9b266",
        boxShadow: active ? "0 0 0 1px rgba(217,178,102,0.4), 0 0 10px rgba(217,178,102,0.18)" : "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: 999,
          background: bead,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 6px ${bead}`,
        }}
      />
      {label}
    </button>
  );
}
