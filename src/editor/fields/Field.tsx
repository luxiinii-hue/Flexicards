import { ReactNode, useState } from "react";
import { Nameplate } from "../workshop/Gear";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps): JSX.Element {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="ws-label">{label}</span>
        {hint ? <span className="font-mono text-[9px] uppercase tracking-widest text-ink-200">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  right?: ReactNode;
}

export function Section({ title, children, defaultOpen = true, right }: SectionProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brass-700/40 last:border-b-0">
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <Nameplate
          right={
            <>
              {right}
              <span className="font-mono text-[11px] text-ink-200">{open ? "▾" : "▸"}</span>
            </>
          }
        >
          {title}
        </Nameplate>
      </div>
      {open ? <div className="space-y-3 px-4 pb-4 pt-3">{children}</div> : null}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}): JSX.Element {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="ws-input font-fell"
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}): JSX.Element {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="ws-input font-fell"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}): JSX.Element {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="ws-input font-mono text-center"
    />
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}): JSX.Element {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className="ws-input font-fell">
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#1a1208" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}): JSX.Element {
  return (
    <label className="flex items-center justify-between font-fell text-sm text-ink-50">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative"
        style={{
          width: 38,
          height: 20,
          borderRadius: 999,
          background: "linear-gradient(180deg, #14100a, #0a0703)",
          border: "1px solid #2a1c0c",
          boxShadow: "inset 0 1px 0 rgba(0,0,0,0.6)",
          cursor: "pointer",
        }}
        aria-pressed={checked}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            transition: "left .15s ease",
            width: 14,
            height: 14,
            borderRadius: 999,
            background: checked
              ? "radial-gradient(circle at 35% 30%, #ffd0a0, #ff7a3a 60%, #5a1f0a)"
              : "radial-gradient(circle at 35% 30%, #f3d99a, #6a4a1c 60%, #2a1c0c)",
            boxShadow: checked ? "0 0 10px rgba(255,140,70,0.5)" : "0 1px 0 rgba(0,0,0,0.5)",
          }}
        />
      </button>
    </label>
  );
}
