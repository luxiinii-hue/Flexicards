/**
 * Rules + flavor text panel. Rendered as a parchment-tinted SVG <rect> with a
 * foreignObject for the HTML text content. Inline mana symbols use the
 * mana-font CSS class names (`ms ms-X`) loaded from CDN via index.html.
 */
import { TEXT_BOX_BG, TEXT_H, TEXT_INK, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";
import { parseManaCost } from "../manaCost";

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

const PADDING_X = 26;
const PADDING_Y = 18;

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
  const gradId = `text-box-grad-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffaea" />
          <stop offset="50%" stopColor={TEXT_BOX_BG} />
          <stop offset="100%" stopColor="#ebe1c5" />
        </linearGradient>
        {/* Subtle inner shadow approximated by an outline + soft stroke */}
      </defs>
      {/* Parchment panel */}
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={9} ry={9} fill={`url(#${gradId})`} />
      {/* Outer rim shadow */}
      <rect
        x={boxX - 1}
        y={boxY - 1}
        width={boxW + 2}
        height={boxH + 2}
        rx={10}
        ry={10}
        fill="none"
        stroke="rgba(0,0,0,0.42)"
        strokeWidth={1.2}
      />
      {/* Inner bevel highlight */}
      <rect
        x={boxX + 1}
        y={boxY + 1}
        width={boxW - 2}
        height={boxH - 2}
        rx={8}
        ry={8}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={1}
      />
      {/* Inner shadow line just inside the rim */}
      <rect
        x={boxX + 2.5}
        y={boxY + 2.5}
        width={boxW - 5}
        height={boxH - 5}
        rx={7.5}
        ry={7.5}
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={0.8}
      />

      {/* Text content via foreignObject for proper HTML reflow + mana-font icons */}
      <foreignObject
        x={boxX + PADDING_X}
        y={boxY + PADDING_Y}
        width={boxW - PADDING_X * 2 - rightInset}
        height={boxH - PADDING_Y * 2}
      >
        <div
          style={{
            fontFamily: "'Source Serif 4', 'EB Garamond', Georgia, serif",
            fontSize: "23px",
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

      {/* Marker for the PDF exporter to identify this region. */}
      <metadata data-pdf-text-region="true" data-rules={rulesText} data-flavor={flavorText ?? ""} />
    </g>
  );
}

function RulesContent({ text }: { text: string }): JSX.Element {
  if (!text.trim()) {
    return <span style={{ color: "rgba(0,0,0,0.32)", fontStyle: "italic" }}>(rules text)</span>;
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
          width: "60%",
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.45), transparent)",
        }}
      />
      <div style={{ fontStyle: "italic", color: "#1a1610", fontSize: "0.92em", whiteSpace: "pre-wrap" }}>
        {text}
      </div>
    </div>
  );
}

/** Replace {SYMBOL} tokens with inline mana-font icons. */
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
      const cls = manaFontClassForToken(token);
      segments.push(
        <i
          key={`m-${i}`}
          className={`ms ms-${cls} ms-cost ms-shadow`}
          style={{
            fontSize: "0.86em",
            verticalAlign: "-0.12em",
            margin: "0 0.06em",
            display: "inline-block",
            lineHeight: 1,
          }}
          aria-hidden
        />
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

function manaFontClassForToken(token: ReturnType<typeof parseManaCost>[number]): string {
  if (token.kind === "color") return token.manaClass;
  if (token.kind === "colorless") return "c";
  if (token.kind === "generic" || token.kind === "x") return token.manaClass;
  if (token.kind === "snow") return "s";
  if (token.kind === "phyrexian") return "p";
  if (token.kind === "tap") return "tap";
  if (token.kind === "untap") return "untap";
  if (token.kind === "energy") return "e";
  if (token.kind === "half") return "half";
  if (token.kind === "infinity") return "infinity";
  return token.manaClass;
}
