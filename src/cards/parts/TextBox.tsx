/**
 * Rules + flavor text panel. The panel itself is rendered as a creamy parchment
 * rectangle inset into the inner color frame. The text content is rendered with
 * mana symbols inline.
 *
 * Two rendering modes:
 *   - "screen": uses <foreignObject> + HTML — perfect text reflow, easy CSS styling
 *   - "vector": uses SVG <text> with manual word-wrapping — for PDF export
 *
 * The "screen" mode is used in the editor. The "vector" mode is used by the PDF
 * exporter (pdfExport.ts swaps the foreignObject for a vector text equivalent
 * during export — see pdfExport.serializeSvgForPdf).
 */
import { TEXT_BOX_BG, TEXT_H, TEXT_INK, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";
import { parseManaCost } from "../manaCost";
import { ManaSymbol } from "../symbols/ManaSymbol";

interface TextBoxProps {
  rulesText: string;
  flavorText?: string;
  /** Reduce the right-side width to leave room for a P/T or loyalty box. */
  rightInset?: number;
  /** Height override (saga / planeswalker layouts use a taller box). */
  height?: number;
  /** Top offset override (used by Adventure subcard). */
  topInset?: number;
}

const PADDING_X = 24;
const PADDING_Y = 16;

export function TextBox({
  rulesText,
  flavorText,
  rightInset = 0,
  height,
  topInset = 0,
}: TextBoxProps): JSX.Element {
  const boxX = TEXT_X;
  const boxY = TEXT_Y + topInset;
  const boxW = TEXT_W;
  const boxH = (height ?? TEXT_H) - topInset;

  return (
    <g>
      {/* Parchment panel */}
      <defs>
        <linearGradient id="text-box-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffaea" />
          <stop offset="60%" stopColor={TEXT_BOX_BG} />
          <stop offset="100%" stopColor="#ede4cb" />
        </linearGradient>
      </defs>
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={8} ry={8} fill="url(#text-box-gradient)" />
      <rect
        x={boxX + 1}
        y={boxY + 1}
        width={boxW - 2}
        height={boxH - 2}
        rx={7}
        ry={7}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
        strokeWidth={1}
      />

      {/* Text content via foreignObject for proper reflow in the editor */}
      <foreignObject
        x={boxX + PADDING_X}
        y={boxY + PADDING_Y}
        width={boxW - PADDING_X * 2 - rightInset}
        height={boxH - PADDING_Y * 2}
      >
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "22px",
            lineHeight: 1.18,
            color: TEXT_INK,
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          <RulesContent text={rulesText} />
          {flavorText ? <FlavorBlock text={flavorText} /> : null}
        </div>
      </foreignObject>

      {/* Marker for the PDF exporter to find this element and replace its
          foreignObject with a manual SVG text layout. */}
      <metadata data-pdf-text-region="true" data-rules={rulesText} data-flavor={flavorText ?? ""} />
    </g>
  );
}

/**
 * Render rules text with inline mana symbols. We split the text on {…} tokens
 * and render each segment, inserting mana pip SVGs between text runs.
 */
function RulesContent({ text }: { text: string }): JSX.Element {
  if (!text.trim()) {
    return <span style={{ color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>(rules text)</span>;
  }
  const paragraphs = text.split(/\n+/);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45em" }}>
      {paragraphs.map((p, i) => (
        <div key={i}>{renderInline(p)}</div>
      ))}
    </div>
  );
}

function FlavorBlock({ text }: { text: string }): JSX.Element {
  return (
    <div style={{ marginTop: "auto", paddingTop: "0.5em" }}>
      <div
        style={{
          height: 1,
          margin: "0.4em auto",
          width: "70%",
          background: "rgba(0,0,0,0.4)",
        }}
      />
      <div style={{ fontStyle: "italic", color: "#1a1610", fontSize: "0.95em", whiteSpace: "pre-wrap" }}>
        {text}
      </div>
    </div>
  );
}

/** Replace {SYMBOL} tokens with inline mana symbol pips. */
function renderInline(text: string): JSX.Element[] {
  const segments: JSX.Element[] = [];
  const tokens = parseManaCost(text);
  if (tokens.length === 0) {
    return [<span key={0}>{text}</span>];
  }
  let lastIndex = 0;
  const re = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(<span key={`t-${i}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    const token = tokens[i];
    if (token) {
      segments.push(
        <span
          key={`m-${i}`}
          style={{
            display: "inline-block",
            verticalAlign: "-0.18em",
            width: "0.95em",
            height: "0.95em",
            margin: "0 0.06em",
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <ManaSymbol token={token} x={0} y={0} size={100} />
          </svg>
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
    i++;
  }
  if (lastIndex < text.length) {
    segments.push(<span key={`tail`}>{text.slice(lastIndex)}</span>);
  }
  return segments;
}
