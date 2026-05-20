import { useRef } from "react";

interface Props {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}

const QUICK_SYMBOLS = ["T", "Q", "W", "U", "B", "R", "G", "C", "X", "E", "S"];

/**
 * Rules text editor — a textarea with a symbol-insert toolbar that inserts
 * tokens at the current cursor position.
 */
export function RulesTextEditor({ value, onChange, rows = 5, placeholder }: Props): JSX.Element {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function insertAtCursor(token: string) {
    const ta = ref.current;
    if (!ta) {
      onChange(value + token);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const next = before + token + after;
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + token.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="space-y-1">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder ?? "Rules text. Use {T}, {W}, {U}… inline."}
        className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 font-body text-sm focus:border-ink-500 focus:outline-none"
      />
      <div className="flex flex-wrap gap-1">
        {QUICK_SYMBOLS.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => insertAtCursor(`{${s}}`)}
            className="rounded-md border border-ink-300 bg-white px-2 py-0.5 text-[10px] font-mono hover:bg-ink-100"
            title={`Insert {${s}}`}
          >
            {`{${s}}`}
          </button>
        ))}
        <button
          type="button"
          onClick={() => insertAtCursor("\n")}
          className="rounded-md border border-ink-300 bg-white px-2 py-0.5 text-[10px] hover:bg-ink-100"
          title="New paragraph"
        >
          ¶
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("—")}
          className="rounded-md border border-ink-300 bg-white px-2 py-0.5 text-[10px] hover:bg-ink-100"
          title="Em-dash"
        >
          —
        </button>
      </div>
    </div>
  );
}
