/**
 * Bottom collector strip: artist · set code · collector number · copyright.
 * Rendered in low-contrast against the inner frame.
 */
import { COLLECTOR_H, COLLECTOR_W, COLLECTOR_X, COLLECTOR_Y } from "../tokens";
import type { FrameColor } from "@/types/card";

interface CollectorLineProps {
  artist: string;
  setCode?: string;
  collectorNumber?: string;
  color: FrameColor;
}

export function CollectorLine({ artist, setCode, collectorNumber, color }: CollectorLineProps): JSX.Element {
  const isDark = color === "black" || color === "blue";
  const fill = isDark ? "rgba(245,239,225,0.88)" : "rgba(11,10,8,0.82)";
  const year = new Date().getFullYear();
  const left = artist ? `Illus. ${artist}` : "Illus. —";
  const middle = [setCode, collectorNumber].filter(Boolean).join(" · ");

  return (
    <g>
      <text
        x={COLLECTOR_X + 4}
        y={COLLECTOR_Y + COLLECTOR_H / 2 + 4}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={14}
        fontWeight={500}
        fill={fill}
      >
        {left}
      </text>
      {middle ? (
        <text
          x={COLLECTOR_X + COLLECTOR_W / 2}
          y={COLLECTOR_Y + COLLECTOR_H / 2 + 4}
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={14}
          fontWeight={500}
          fill={fill}
        >
          {middle}
        </text>
      ) : null}
      <text
        x={COLLECTOR_X + COLLECTOR_W - 4}
        y={COLLECTOR_Y + COLLECTOR_H / 2 + 4}
        textAnchor="end"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={12}
        fontWeight={500}
        fill={fill}
        opacity={0.75}
      >
        ™ &amp; © {year} custom
      </text>
    </g>
  );
}
