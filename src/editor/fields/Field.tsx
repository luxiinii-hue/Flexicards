import { ReactNode } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps): JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">{label}</label>
        {hint ? <span className="text-[10px] text-ink-400">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
  collapsible,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}): JSX.Element {
  return (
    <details open={defaultOpen} className="group border-t border-ink-200 first:border-t-0">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 ${
          collapsible ? "" : "pointer-events-none"
        }`}
      >
        <span>{title}</span>
        <span className="text-xs text-ink-400 group-open:rotate-90 transition">▸</span>
      </summary>
      <div className="space-y-3 px-4 pb-4 pt-1">{children}</div>
    </details>
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
      className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm focus:border-ink-500 focus:outline-none"
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
      className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm focus:border-ink-500 focus:outline-none"
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
      className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm focus:border-ink-500 focus:outline-none"
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm focus:border-ink-500 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
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
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}
