import { useRef } from "react";

interface Props {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}

const QUICK_SYMBOLS = ["T", "Q", "W", "U", "B", "R", "G", "C", "X", "E", "S"];

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
    <div className="space-y-1.5">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder ?? "Inscribe the rules. Use {T}, {W}, {U}… inline."}
        className="ws-input font-fell"
      />
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink-200 mr-1">Glyphs</span>
        {QUICK_SYMBOLS.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => insertAtCursor(`{${s}}`)}
            className="flex items-center justify-center hover:brightness-110"
            style={{
              background: "linear-gradient(180deg, #1a1208, #0e0a05)",
              border: "1px solid #2a1c0c",
              width: 26,
              height: 26,
              borderRadius: 2,
            }}
            title={`Insert {${s}}`}
          >
            <i className={`ms ms-${s.toLowerCase()}`} style={{ fontSize: 14, color: "#d9b266" }} aria-hidden />
          </button>
        ))}
        <button
          type="button"
          onClick={() => insertAtCursor("\n")}
          className="ws-btn ws-btn-secondary px-2 py-0 text-[10px]"
          style={{ height: 26 }}
          title="New paragraph"
        >
          ¶
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("—")}
          className="ws-btn ws-btn-secondary px-2 py-0 text-[10px]"
          style={{ height: 26 }}
          title="Em-dash"
        >
          —
        </button>
      </div>
    </div>
  );
}
