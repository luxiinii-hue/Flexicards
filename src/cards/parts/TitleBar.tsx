import { ManaCostStrip } from "../symbols/ManaSymbol";
import { TITLE_H, TITLE_W, TITLE_X, TITLE_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface TitleBarProps {
  name: string;
  manaCost: string;
  color: FrameColor;
  isDarkFrame?: boolean;
}

export function TitleBar({ name, manaCost, color, isDarkFrame }: TitleBarProps): JSX.Element {
  const isDark = isDarkFrame ?? (color === "black" || color === "blue");
  // True MTG text is usually black unless on dark frames.
  const textColor = isDark ? "#ffffff" : "#000000";

  return (
    <g>
      <foreignObject x={TITLE_X + 16} y={TITLE_Y + 4} width={TITLE_W * 0.62} height={TITLE_H - 8}>
        <div
          style={{
            fontFamily: "'Beleren', 'Cinzel', Georgia, serif",
            fontWeight: 700,
            fontSize: "30px",
            lineHeight: 1.05,
            color: textColor,
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            height: "100%",
            textShadow: isDark ? "1px 1px 2px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {name || "Untitled"}
        </div>
      </foreignObject>

      <ManaCostStrip
        cost={manaCost}
        x={TITLE_X + TITLE_W - 12}
        y={TITLE_Y + TITLE_H / 2}
        size={38}
        gap={3}
        align="right"
      />
    </g>
  );
}
