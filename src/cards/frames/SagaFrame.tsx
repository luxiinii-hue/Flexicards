/**
 * Saga frame — chapter rows occupy the left third, art occupies the right two
 * thirds. Type line is below the art/chapter area. Vertical roman-numeral cap
 * on the left side mimics the M21+ saga template.
 */
import type { SagaCard, SagaChapter } from "@/types/card";
import { CardSvgDefs } from "../parts/SvgDefs";
import { Border } from "../parts/Border";
import { InnerFrame } from "../parts/InnerFrame";
import { TitleBar } from "../parts/TitleBar";
import { TypeLine } from "../parts/TypeLine";
import { CollectorLine } from "../parts/CollectorLine";
import { Holostamp } from "../parts/Holostamp";
import { resolveFrameColor } from "../frameColor";
import { useArtHref } from "../useArtHref";
import { ART_H, ART_X, ART_Y, ART_W, BORDER, TYPE_Y } from "../tokens";

const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" };

interface Props {
  card: SagaCard;
}

export function SagaFrame({ card }: Props): JSX.Element {
  const color = resolveFrameColor(card);
  const artHref = useArtHref(card.artImage);

  // Layout: chapters on left (40% width), art on right (60% width)
  const chapterAreaX = ART_X;
  const chapterAreaY = ART_Y;
  const chapterAreaW = Math.round(ART_W * 0.42);
  const chapterAreaH = ART_H + (TYPE_Y - ART_Y - ART_H);

  const artNewX = chapterAreaX + chapterAreaW + 8;
  const artNewW = ART_X + ART_W - artNewX;
  const artNewH = ART_H;

  return (
    <g>
      <CardSvgDefs />
      <Border />
      <InnerFrame color={color} gradientId={`inner-${card.id}`} />
      <TitleBar name={card.name} manaCost={card.manaCost} color={color} />

      {/* Chapter panel */}
      <rect
        x={chapterAreaX}
        y={chapterAreaY}
        width={chapterAreaW}
        height={chapterAreaH}
        rx={8}
        ry={8}
        fill="#f6efde"
      />
      <rect
        x={chapterAreaX + 1}
        y={chapterAreaY + 1}
        width={chapterAreaW - 2}
        height={chapterAreaH - 2}
        rx={7}
        ry={7}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
      />

      {card.chapters.map((chapter, i) => (
        <SagaChapterRow
          key={i}
          chapter={chapter}
          index={i}
          total={card.chapters.length}
          x={chapterAreaX}
          y={chapterAreaY}
          w={chapterAreaW}
          h={chapterAreaH}
        />
      ))}

      {/* Right-side art window */}
      <g>
        <defs>
          <clipPath id={`saga-art-${card.id}`}>
            <rect x={artNewX} y={ART_Y} width={artNewW} height={artNewH} rx={4} ry={4} />
          </clipPath>
        </defs>
        <rect
          x={artNewX - 6}
          y={ART_Y - 6}
          width={artNewW + 12}
          height={artNewH + 12}
          rx={10}
          ry={10}
          fill="rgba(0,0,0,0.5)"
        />
        <g clipPath={`url(#saga-art-${card.id})`}>
          {artHref ? (
            <image
              href={artHref}
              x={artNewX}
              y={ART_Y}
              width={artNewW}
              height={artNewH}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <rect x={artNewX} y={ART_Y} width={artNewW} height={artNewH} fill="#1a1a22" />
          )}
        </g>
      </g>

      <TypeLine text={card.typeLine} color={color} rarity={card.rarity} />
      <Holostamp rarity={card.rarity} cx={artNewX + artNewW / 2} cy={ART_Y + artNewH - 30} />
      <CollectorLine
        artist={card.artist}
        setCode={card.setCode}
        collectorNumber={card.collectorNumber}
        color={color}
      />

      {/* Empty marker so the bottom border + corner of the inner frame is preserved */}
      <rect x={BORDER} y={TYPE_Y + 50} width={0} height={0} fill="none" />
    </g>
  );
}

interface ChapterRowProps {
  chapter: SagaChapter;
  index: number;
  total: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

function SagaChapterRow({ chapter, index, total, x, y, w, h }: ChapterRowProps): JSX.Element {
  const rowH = (h - 12) / total;
  const rowY = y + 6 + index * rowH;
  const numerals = chapter.numerals.map((n) => ROMAN[n] ?? `${n}`).join(", ");
  return (
    <g>
      {/* Numeral badge */}
      <circle cx={x + 28} cy={rowY + rowH / 2} r={20} fill="#1a1a14" stroke="#f3eee5" strokeWidth={1.2} />
      <text
        x={x + 28}
        y={rowY + rowH / 2 + 6}
        textAnchor="middle"
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight={700}
        fontSize={18}
        fill="#f5efe1"
      >
        {numerals}
      </text>

      {/* Chapter text */}
      <foreignObject x={x + 58} y={rowY + 4} width={w - 70} height={rowH - 8}>
        <div
         
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "17px",
            lineHeight: 1.18,
            color: "#0b0a08",
          }}
        >
          {chapter.text || (
            <span style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>(chapter)</span>
          )}
        </div>
      </foreignObject>

      {index < total - 1 ? (
        <line
          x1={x + 14}
          y1={rowY + rowH - 1}
          x2={x + w - 14}
          y2={rowY + rowH - 1}
          stroke="rgba(0,0,0,0.22)"
          strokeWidth={0.7}
        />
      ) : null}
    </g>
  );
}
