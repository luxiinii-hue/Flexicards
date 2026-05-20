/**
 * Rules + flavor text panel. Clean off-white parchment with a single thin
 * dark border. Inline mana symbols use the mana-font CSS class names.
 */
import { TEXT_BOX_BG, TEXT_H, TEXT_INK, TEXT_W, TEXT_X, TEXT_Y } from "../tokens";
import { parseManaCost, type ManaToken } from "../manaCost";

interface TextBoxProps {
  rulesText: string;
  flavorText?: string;
  rightInset?: number;
  height?: number;
  topInset?: number;
}

const PADDING_X = 22;
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
      {/* Clean parchment fill */}
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={4} ry={4} fill={TEXT_BOX_BG} />
      {/* Single thin dark border */}
      <rect
        x={boxX}
        y={boxY}
        width={boxW}
        height={boxH}
        rx={4}
        ry={4}
        fill="none"
        stroke="rgba(0,0,0,0.65)"
        strokeWidth={1.2}
      />

      <foreignObject
        x={boxX + PADDING_X}
        y={boxY + PADDING_Y}
        width={boxW - PADDING_X * 2 - rightInset}
        height={boxH - PADDING_Y * 2}
      >
        <div
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
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
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.5), transparent)",
        }}
      />
      <div style={{ fontStyle: "italic", color: "#1a1610", fontSize: "0.9em", whiteSpace: "pre-wrap" }}>
        {text}
      </div>
    </div>
  );
}

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
        <i
          key={`m-${i}`}
          className={`ms ms-${manaFontClassForToken(token)} ms-cost ms-shadow`}
          style={{
            fontSize: "0.88em",
            verticalAlign: "-0.14em",
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

function manaFontClassForToken(token: ManaToken): string {
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
