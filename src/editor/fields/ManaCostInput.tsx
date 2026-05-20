import { useState } from "react";
import { parseManaCost } from "@/cards/manaCost";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

/**
 * Mana cost input — text field + a compact glyph palette using the mana-font
 * CSS to display the actual symbols on the buttons.
 */
export function ManaCostInput({ value, onChange }: Props): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  function insert(token: string) {
    onChange(value + token);
  }
  function clear() {
    onChange("");
  }
  function deleteLast() {
    onChange(value.replace(/\{[^}]*\}\s*$/, ""));
  }

  const cmc = computeCmc(value);
  const colorSet = ["W", "U", "B", "R", "G", "C"];
  const numberSet = ["0", "1", "2", "3", "4", "5", "X"];
  const advanced = ["6", "7", "8", "10", "S", "T", "Q", "E", "W/U", "U/B", "B/R", "R/G", "G/W", "W/B", "U/R", "B/G", "R/W", "G/U", "2/W", "2/U", "2/B", "2/R", "2/G", "W/P", "U/P", "B/P", "R/P", "G/P", "½", "∞"];

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="{2}{W}{U}"
        className="ws-input font-mono"
      />
      <div className="flex flex-wrap items-center gap-1">
        {colorSet.map((s) => (
          <SymbolBtn key={s} cls={s.toLowerCase()} label={s} onClick={() => insert(`{${s}}`)} />
        ))}
        {numberSet.map((s) => (
          <SymbolBtn key={`gen-${s}`} cls={s.toLowerCase()} label={s} onClick={() => insert(`{${s}}`)} />
        ))}
        <button type="button" onClick={deleteLast} className="ws-btn ws-btn-secondary px-2 py-1 text-[10px]" title="Remove last">
          ⌫
        </button>
        <button type="button" onClick={clear} className="ws-btn ws-btn-secondary px-2 py-1 text-[10px]" title="Clear">
          ×
        </button>
        <button type="button" onClick={() => setShowAll((v) => !v)} className="ws-btn ws-btn-secondary px-2 py-1 text-[10px]">
          {showAll ? "Less" : "More…"}
        </button>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-ink-200">
          {cmc} CMC
        </span>
      </div>
      {showAll ? (
        <div className="grid grid-cols-6 gap-1 rounded p-2" style={{ border: "1px dashed #3a2811", background: "rgba(217,178,102,0.04)" }}>
          {advanced.map((s) => (
            <SymbolBtn key={s} cls={s.toLowerCase()} label={s} onClick={() => insert(`{${s}}`)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SymbolBtn({ cls, label, onClick }: { cls: string; label: string; onClick: () => void }) {
  // Try to render the actual mana-font glyph; fall back to text if the class doesn't exist.
  const manaClass = `ms ms-${cls} ms-cost ms-shadow`;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center rounded px-1 py-1 hover:brightness-110"
      style={{
        background: "linear-gradient(180deg, #1a1208, #0e0a05)",
        border: "1px solid #2a1c0c",
        width: 30,
        height: 30,
        boxShadow: "inset 0 1px 0 rgba(255,220,160,0.06)",
      }}
      title={`Insert {${label}}`}
    >
      <i className={manaClass} style={{ fontSize: 18, lineHeight: 1 }} aria-hidden />
    </button>
  );
}

function computeCmc(value: string): number {
  const tokens = parseManaCost(value);
  let total = 0;
  for (const t of tokens) {
    if (t.kind === "color" || t.kind === "colorless" || t.kind === "snow" || t.kind === "phyrexian-color") {
      total += 1;
    } else if (t.kind === "generic") {
      const n = Number.parseInt(t.manaClass, 10);
      if (Number.isFinite(n)) total += n;
    } else if (t.kind === "hybrid") {
      // Hybrid pips contribute 1 to CMC; "2/W" contributes 2, etc.
      const match = t.manaClass.match(/^(\d+)/);
      total += match ? Number.parseInt(match[1]!, 10) : 1;
    } else if (t.kind === "x") {
      total += 0;
    }
  }
  return total;
}
