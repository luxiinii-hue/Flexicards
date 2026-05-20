import { useState } from "react";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

/**
 * Mana cost input — text field with a quick-insert toolbar for common symbols.
 * The user can also type {2}{W}{U} freeform.
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

  const colorSet = ["W", "U", "B", "R", "G", "C"];
  const numberSet = ["0", "1", "2", "3", "4", "5", "X"];
  const advanced = ["W/U", "U/B", "B/R", "R/G", "G/W", "W/B", "U/R", "B/G", "R/W", "G/U", "2/W", "2/U", "2/B", "2/R", "2/G", "W/P", "U/P", "B/P", "R/P", "G/P", "S", "T", "Q", "E"];

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="{2}{W}{U}"
        className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 font-mono text-sm focus:border-ink-500 focus:outline-none"
      />
      <div className="flex flex-wrap gap-1">
        {colorSet.map((s) => (
          <SymbolBtn key={s} token={`{${s}}`} label={s} onClick={() => insert(`{${s}}`)} />
        ))}
        {numberSet.map((s) => (
          <SymbolBtn key={`gen-${s}`} token={`{${s}}`} label={s} onClick={() => insert(`{${s}}`)} />
        ))}
        <button
          type="button"
          onClick={deleteLast}
          className="rounded-md border border-ink-300 bg-white px-1.5 py-1 text-[10px] font-bold text-ink-700 hover:bg-ink-100"
          title="Remove last symbol"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-md border border-ink-300 bg-white px-1.5 py-1 text-[10px] font-bold text-ink-700 hover:bg-ink-100"
          title="Clear"
        >
          ×
        </button>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-md border border-ink-300 bg-white px-1.5 py-1 text-[10px] text-ink-700 hover:bg-ink-100"
        >
          {showAll ? "Less" : "More…"}
        </button>
      </div>
      {showAll ? (
        <div className="flex flex-wrap gap-1 rounded-md border border-dashed border-ink-300 p-2">
          {advanced.map((s) => (
            <SymbolBtn key={s} token={`{${s}}`} label={s} onClick={() => insert(`{${s}}`)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SymbolBtn({ label, onClick }: { token: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-ink-300 bg-white px-2 py-1 text-[11px] font-mono hover:bg-ink-100"
      title={`Insert {${label}}`}
    >
      {label}
    </button>
  );
}
