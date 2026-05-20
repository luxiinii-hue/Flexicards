import { ALL_LAYOUTS, LAYOUT_DESCRIPTIONS, LAYOUT_LABELS, type CardLayout } from "@/types/card";
import { useStore } from "@/state/store";
import { Modal } from "./Modal";

interface Props {
  onClose: () => void;
}

export function LayoutPicker({ onClose }: Props): JSX.Element {
  const newCard = useStore((s) => s.newCard);
  return (
    <Modal title="Pick a layout" onClose={onClose} size="max-w-3xl">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {ALL_LAYOUTS.map((layout) => (
          <button
            key={layout}
            type="button"
            onClick={async () => {
              await newCard(layout);
              onClose();
            }}
            className="group flex flex-col gap-2 rounded-md border border-ink-300 bg-white p-3 text-left hover:border-ink-700 hover:shadow"
          >
            <LayoutThumbnail layout={layout} />
            <div>
              <div className="text-sm font-semibold text-ink-900 group-hover:text-ink-900">{LAYOUT_LABELS[layout]}</div>
              <div className="text-xs text-ink-500">{LAYOUT_DESCRIPTIONS[layout]}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function LayoutThumbnail({ layout }: { layout: CardLayout }): JSX.Element {
  // Simple iconographic thumbnails for each layout
  const w = 80;
  const h = 110;
  const borderColor = "#3a3225";
  const accentByLayout: Record<CardLayout, string> = {
    normal: "#cdb393",
    creature: "#b5d6a8",
    planeswalker: "#aabce2",
    saga: "#fbf6cf",
    adventure: "#f4a380",
    token: "#cdb393",
    split: "#e3c87a",
    modal_dfc: "#a9d6f0",
    transform: "#cbc2bf",
    class: "#9bd3ae",
    leveler: "#d5d4d0",
    custom: "#efd682",
  };
  const fill = accentByLayout[layout] ?? "#cdb393";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="mx-auto block max-w-[120px]">
      <rect x={0} y={0} width={w} height={h} rx={6} ry={6} fill={borderColor} />
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={4} ry={4} fill={fill} />
      {/* Layout-specific glyph */}
      {layout === "saga" ? (
        <g>
          <rect x={8} y={12} width={22} height={h - 24} rx={2} fill="#f3e8c2" />
          <rect x={34} y={12} width={w - 42} height={(h - 32) / 2} rx={2} fill="#1a1a22" />
          <rect x={8} y={h - 18} width={w - 16} height={10} rx={2} fill="#f3e8c2" />
        </g>
      ) : layout === "split" ? (
        <g>
          <line x1={4} y1={h / 2} x2={w - 4} y2={h / 2} stroke="#3a3225" strokeWidth={1.5} />
          <rect x={8} y={8} width={w - 16} height={(h - 22) / 2} rx={2} fill="#1a1a22" />
          <rect x={8} y={h / 2 + 4} width={w - 16} height={(h - 22) / 2} rx={2} fill="#1a1a22" />
        </g>
      ) : (
        <g>
          {/* Title row */}
          <rect x={8} y={8} width={w - 16} height={10} rx={2} fill="#f3e8c2" />
          {/* Art */}
          <rect x={8} y={22} width={w - 16} height={h * 0.4} rx={2} fill="#1a1a22" />
          {/* Type */}
          <rect x={8} y={22 + h * 0.4 + 4} width={w - 16} height={6} rx={1} fill="#f3e8c2" />
          {/* Text */}
          <rect x={8} y={22 + h * 0.4 + 14} width={w - 16} height={h * 0.3} rx={2} fill="#f3e8c2" />
          {layout === "creature" || layout === "adventure" || layout === "leveler" || layout === "token" ? (
            <rect x={w - 24} y={h - 22} width={16} height={12} rx={1} fill="#3a3225" />
          ) : null}
          {layout === "planeswalker" ? (
            <g>
              <polygon points={`${w - 14},${h - 22} ${w - 6},${h - 18} ${w - 8},${h - 8} ${w - 20},${h - 8} ${w - 22},${h - 18}`} fill="#1a1a22" />
            </g>
          ) : null}
          {layout === "modal_dfc" || layout === "transform" ? (
            <circle cx={14} cy={26} r={5} fill="#1a1a22" />
          ) : null}
        </g>
      )}
    </svg>
  );
}
