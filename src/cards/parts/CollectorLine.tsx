/**
 * Bottom collector strip: artist · set code · collector number · year.
 * Tiny readable text against the inner color band.
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
  const fill = isDark ? "rgba(243,231,200,0.92)" : "rgba(11,9,8,0.85)";
  const year = new Date().getFullYear();
  const left = artist ? `Illus. ${artist}` : "Illus. —";
  const middle = [setCode, collectorNumber].filter(Boolean).join(" · ");
  const cy = COLLECTOR_Y + COLLECTOR_H / 2;

  return (
    <g>
      <foreignObject x={COLLECTOR_X} y={cy - 12} width={COLLECTOR_W} height={24}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: fill,
            letterSpacing: "0.2px",
            height: "100%",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "40%" }}>
            {left}
          </span>
          {middle ? (
            <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {middle}
            </span>
          ) : (
            <span />
          )}
          <span style={{ opacity: 0.78, fontSize: "10px", whiteSpace: "nowrap" }}>™ &amp; © {year}</span>
        </div>
      </foreignObject>
    </g>
  );
}
