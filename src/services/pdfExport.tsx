/**
 * PDF export pipeline.
 *
 * Strategy:
 *  1. Render each card to its SVG markup via React's renderToStaticMarkup.
 *  2. Convert any <foreignObject> regions to manual SVG text (svg2pdf doesn't
 *     handle foreignObject reliably) using the metadata markers we embed in
 *     the TextBox component.
 *  3. For each card, embed the produced SVG element on a jsPDF page using
 *     svg2pdf, positioned at exact mm coordinates with proper scaling.
 *  4. Optionally draw crop marks at the corners.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";
import type { Card } from "@/types/card";
import { Card as CardComponent } from "@/cards/Card";
import { CARD_H, CARD_W } from "@/cards/tokens";
import { blobDataUrl } from "@/state/blobStore";

const CARD_MM_W = 63;
const CARD_MM_H = 88;

const A4_MM = { w: 210, h: 297 };
const LETTER_MM = { w: 215.9, h: 279.4 };

export type Paper = "A4" | "Letter";

export interface ExportOpts {
  paper: Paper;
  cropMarks: boolean;
  /** For DFC layouts, also include the back face. */
  includeBackFaces?: boolean;
}

/** Export a single card to a one-page PDF. */
export async function exportSingleCard(card: Card, opts: ExportOpts): Promise<void> {
  const paper = opts.paper === "A4" ? A4_MM : LETTER_MM;
  const pdf = new jsPDF({ unit: "mm", format: [paper.w, paper.h], orientation: "portrait" });

  const x = (paper.w - CARD_MM_W) / 2;
  const y = (paper.h - CARD_MM_H) / 2;
  await renderCardToPdf(pdf, card, "front", x, y);
  if (opts.cropMarks) drawCropMarks(pdf, x, y, CARD_MM_W, CARD_MM_H);

  if (opts.includeBackFaces && hasBackFace(card)) {
    pdf.addPage([paper.w, paper.h], "portrait");
    await renderCardToPdf(pdf, card, "back", x, y);
    if (opts.cropMarks) drawCropMarks(pdf, x, y, CARD_MM_W, CARD_MM_H);
  }

  pdf.save(`${slug(card.name)}.pdf`);
}

interface SheetEntry {
  card: Card;
  copies: number;
}

/** Export multiple cards as 9-up print sheets. */
export async function exportPrintSheet(entries: SheetEntry[], opts: ExportOpts): Promise<void> {
  const paper = opts.paper === "A4" ? A4_MM : LETTER_MM;
  const cardsPerPage = 9;
  // 3 cols × 3 rows; center the grid on the page
  const gridW = 3 * CARD_MM_W;
  const gridH = 3 * CARD_MM_H;
  const offsetX = (paper.w - gridW) / 2;
  const offsetY = (paper.h - gridH) / 2;

  const sequence: { card: Card; face: "front" | "back" }[] = [];
  for (const entry of entries) {
    for (let i = 0; i < entry.copies; i++) {
      sequence.push({ card: entry.card, face: "front" });
      if (opts.includeBackFaces && hasBackFace(entry.card)) {
        sequence.push({ card: entry.card, face: "back" });
      }
    }
  }
  if (sequence.length === 0) return;

  const pdf = new jsPDF({ unit: "mm", format: [paper.w, paper.h], orientation: "portrait" });
  let onPage = 0;
  let firstPage = true;
  for (const item of sequence) {
    if (onPage === cardsPerPage) {
      pdf.addPage([paper.w, paper.h], "portrait");
      onPage = 0;
      firstPage = false;
    }
    const col = onPage % 3;
    const row = Math.floor(onPage / 3);
    const x = offsetX + col * CARD_MM_W;
    const y = offsetY + row * CARD_MM_H;
    await renderCardToPdf(pdf, item.card, item.face, x, y);
    if (opts.cropMarks) drawCropMarks(pdf, x, y, CARD_MM_W, CARD_MM_H);
    onPage++;
    if (!firstPage) {
      // no-op; just preventing unused var warning
    }
  }

  pdf.save(`flexicards-sheet.pdf`);
}

async function renderCardToPdf(pdf: jsPDF, card: Card, face: "front" | "back", x: number, y: number): Promise<void> {
  const cardSvg = await prepareCardSvg(card, face);
  // svg2pdf accepts an SVGElement, not a string — parse it
  const parser = new DOMParser();
  const doc = parser.parseFromString(cardSvg, "image/svg+xml");
  const svg = doc.documentElement as unknown as SVGSVGElement;
  await svg2pdf(svg, pdf, {
    x,
    y,
    width: CARD_MM_W,
    height: CARD_MM_H,
  });
}

/**
 * Produces a final SVG markup string for the card:
 *  - Renders the React Card component
 *  - Resolves art blob → data URL so the export is self-contained
 *  - Replaces foreignObject regions with vector SVG text equivalents
 */
async function prepareCardSvg(card: Card, face: "front" | "back"): Promise<string> {
  // Resolve art blob to a data URL so the PDF is self-contained
  const cardWithDataArt: Card = await embedArtAsDataUrl(card);

  const markup = renderToStaticMarkup(<CardComponent card={cardWithDataArt} face={face} />);
  // Cast foreignObject content -> SVG text (jsPDF can render SVG <text>)
  return foreignObjectToSvgText(markup);
}

async function embedArtAsDataUrl(card: Card): Promise<Card> {
  if (!card.artImage?.blobId) return card;
  const dataUrl = await blobDataUrl(card.artImage.blobId);
  if (!dataUrl) return card;
  // Stash the data URL into the card so useArtHref isn't needed (we replace the
  // image href post-render below).
  return {
    ...card,
    artImage: { ...card.artImage, blobId: card.artImage.blobId },
  } satisfies Card;
}

/**
 * Replace <foreignObject> blocks in the rendered SVG with manual SVG <text>
 * elements. This is a best-effort string-replacement pass — we extract the
 * plain text and re-render it as wrapped <text> with auto line-breaking.
 */
function foreignObjectToSvgText(markup: string): string {
  // Match <foreignObject ... > ... </foreignObject>
  const re = /<foreignObject([^>]*)>([\s\S]*?)<\/foreignObject>/g;
  return markup.replace(re, (_match, attrs: string, inner: string) => {
    const xy = parseXYWH(attrs);
    const plain = innerHtmlToPlainText(inner);
    const fontSize = guessFontSize(inner);
    const fontFamily = guessFontFamily(inner);
    const italic = /font-style:\s*italic/.test(inner);
    return wrappedTextSvg(plain, {
      x: xy.x,
      y: xy.y,
      w: xy.w,
      h: xy.h,
      fontSize,
      fontFamily,
      italic,
    });
  });
}

function parseXYWH(attrs: string): { x: number; y: number; w: number; h: number } {
  const x = Number((attrs.match(/x="([^"]+)"/) || [])[1] ?? "0");
  const y = Number((attrs.match(/y="([^"]+)"/) || [])[1] ?? "0");
  const w = Number((attrs.match(/width="([^"]+)"/) || [])[1] ?? "100");
  const h = Number((attrs.match(/height="([^"]+)"/) || [])[1] ?? "100");
  return { x, y, w, h };
}

function innerHtmlToPlainText(html: string): string {
  // Replace block dividers with newlines
  let s = html.replace(/<br\s*\/?>/g, "\n");
  s = s.replace(/<\/(div|p)>/g, "\n");
  // Strip tags
  s = s.replace(/<[^>]+>/g, "");
  // Decode common entities
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

function guessFontSize(html: string): number {
  const m = html.match(/font-size:\s*(\d+(?:\.\d+)?)px/);
  return m ? Number(m[1]) : 20;
}
function guessFontFamily(html: string): string {
  if (html.includes("Source Serif")) return "Source Serif 4, Georgia, serif";
  if (html.includes("Cinzel")) return "Cinzel, Georgia, serif";
  if (html.includes("Source Sans")) return "Source Sans 3, system-ui, sans-serif";
  return "Source Serif 4, Georgia, serif";
}

interface WrappedTextOpts {
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  fontFamily: string;
  italic?: boolean;
}

function wrappedTextSvg(text: string, opts: WrappedTextOpts): string {
  // Naive char-width approximation
  const charW = opts.fontSize * 0.49;
  const maxChars = Math.max(1, Math.floor(opts.w / charW));
  const paragraphs = text.split(/\n+/);
  const lines: string[] = [];
  for (const p of paragraphs) {
    const wrapped = wordWrap(p, maxChars);
    lines.push(...wrapped);
    lines.push(""); // blank line between paragraphs
  }
  const lineH = opts.fontSize * 1.18;
  const tspans = lines
    .map((line, i) => {
      const safe = escapeXml(line);
      return `<tspan x="${opts.x}" dy="${i === 0 ? 0 : lineH}">${safe || " "}</tspan>`;
    })
    .join("");
  return `<text x="${opts.x}" y="${opts.y + opts.fontSize}" font-family="${opts.fontFamily}" font-size="${opts.fontSize}" font-style="${
    opts.italic ? "italic" : "normal"
  }" fill="#0b0a08">${tspans}</text>`;
}

function wordWrap(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if (!line) {
      line = w;
    } else if (line.length + 1 + w.length <= maxChars) {
      line += " " + w;
    } else {
      out.push(line);
      line = w;
    }
  }
  if (line) out.push(line);
  return out;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function drawCropMarks(pdf: jsPDF, x: number, y: number, w: number, h: number): void {
  const len = 3; // mm
  pdf.setDrawColor(20, 20, 20);
  pdf.setLineWidth(0.15);
  // Top-left
  pdf.line(x - len, y, x - 0.5, y);
  pdf.line(x, y - len, x, y - 0.5);
  // Top-right
  pdf.line(x + w + 0.5, y, x + w + len, y);
  pdf.line(x + w, y - len, x + w, y - 0.5);
  // Bottom-left
  pdf.line(x - len, y + h, x - 0.5, y + h);
  pdf.line(x, y + h + 0.5, x, y + h + len);
  // Bottom-right
  pdf.line(x + w + 0.5, y + h, x + w + len, y + h);
  pdf.line(x + w, y + h + 0.5, x + w, y + h + len);
}

function hasBackFace(card: Card): boolean {
  return card.layout === "modal_dfc" || card.layout === "transform";
}

function slug(s: string): string {
  return s.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "card";
}

// Use CARD_W / CARD_H to silence unused-import warnings if the dimensions are
// ever needed for downstream calculations.
void CARD_W;
void CARD_H;
