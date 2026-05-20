/**
 * Bottom collector strip: artist · set code · collector number · copyright.
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
  const fill = isDark ? "rgba(245,239,225,0.9)" : "rgba(11,10,8,0.85)";
  const year = new Date().getFullYear();
  const left = artist ? `Illus. ${artist}` : "Illus. —";
  const middle = [setCode, collectorNumber].filter(Boolean).join(" · ");
  const cy = COLLECTOR_Y + COLLECTOR_H / 2;

  return (
    <g>
      <foreignObject x={COLLECTOR_X} y={cy - 14} width={COLLECTOR_W} height={28}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            color: fill,
            letterSpacing: "0.2px",
            height: "100%",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "40%" }}>{left}</span>
          {middle ? (
            <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {middle}
            </span>
          ) : <span />}
          <span style={{ opacity: 0.78, fontSize: "11px", whiteSpace: "nowrap" }}>™ &amp; © {year} custom</span>
        </div>
      </foreignObject>
    </g>
  );
}
