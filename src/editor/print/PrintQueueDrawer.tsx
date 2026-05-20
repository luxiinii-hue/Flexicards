import { useState } from "react";
import { useStore } from "@/state/store";
import { Modal } from "../dialogs/Modal";
import { LAYOUT_LABELS, hasBackFace } from "@/types/card";
import { exportPrintSheet, exportSingleCard } from "@/services/pdfExport";
import { pushToast } from "../toastBus";

interface Props {
  onClose: () => void;
}

export function PrintQueueDrawer({ onClose }: Props): JSX.Element {
  const printQueue = useStore((s) => s.printQueue);
  const cards = useStore((s) => s.cards);
  const setPrintQueueCount = useStore((s) => s.setPrintQueueCount);
  const clearPrintQueue = useStore((s) => s.clearPrintQueue);
  const settings = useStore((s) => s.settings);

  const [paper, setPaper] = useState<"A4" | "Letter">(settings.defaultPaperSize);
  const [cropMarks, setCropMarks] = useState(settings.defaultCropMarks);
  const [includeBackFaces, setIncludeBackFaces] = useState(true);
  const [busy, setBusy] = useState(false);

  const entries = Object.entries(printQueue)
    .map(([cardId, copies]) => {
      const card = cards.find((c) => c.id === cardId);
      return card ? { card, copies } : null;
    })
    .filter((x): x is { card: NonNullable<ReturnType<typeof cards.find>>; copies: number } => Boolean(x));
  const totalCount = entries.reduce((a, e) => a + e.copies, 0);

  async function doExportSheet() {
    if (entries.length === 0) return;
    setBusy(true);
    try {
      await exportPrintSheet(entries, { paper, cropMarks, includeBackFaces });
      pushToast(`Exported ${totalCount}-card print sheet`, "success");
    } catch (err) {
      pushToast(`PDF export failed: ${(err as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Print queue & PDF export" onClose={onClose} size="max-w-2xl">
      <div className="space-y-4">
        <div className="rounded-md border border-ink-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-ink-700">Settings</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="w-24 text-ink-600">Paper</span>
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value as "A4" | "Letter")}
                className="flex-1 rounded border border-ink-300 px-2 py-1 text-sm"
              >
                <option value="A4">A4 (210×297mm)</option>
                <option value="Letter">US Letter (215.9×279.4mm)</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={cropMarks} onChange={(e) => setCropMarks(e.target.checked)} />
              <span>Add crop marks</span>
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={includeBackFaces}
                onChange={(e) => setIncludeBackFaces(e.target.checked)}
              />
              <span>Include back faces for DFC/Transform cards</span>
            </label>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-md border border-dashed border-ink-300 p-6 text-center text-sm text-ink-500">
            Print queue is empty. Click the <strong>+P</strong> button on a card in the sidebar to add it.
          </div>
        ) : (
          <div className="rounded-md border border-ink-200 bg-white">
            <ul className="divide-y divide-ink-100">
              {entries.map(({ card, copies }) => (
                <li key={card.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-ink-900">{card.name || "Untitled"}</div>
                    <div className="text-[10px] uppercase tracking-wide text-ink-500">
                      {LAYOUT_LABELS[card.layout]}
                      {hasBackFace(card) && includeBackFaces ? " · 2 faces" : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPrintQueueCount(card.id, Math.max(0, copies - 1))}
                      className="rounded-md border border-ink-300 bg-white px-2 py-0.5 text-xs hover:bg-ink-100"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{copies}</span>
                    <button
                      type="button"
                      onClick={() => setPrintQueueCount(card.id, copies + 1)}
                      className="rounded-md border border-ink-300 bg-white px-2 py-0.5 text-xs hover:bg-ink-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await exportSingleCard(card, { paper, cropMarks, includeBackFaces });
                      } catch (err) {
                        pushToast(`Export failed: ${(err as Error).message}`, "error");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="rounded-md border border-ink-300 bg-white px-2 py-1 text-xs hover:bg-ink-100"
                    title="Export this card as a single-page PDF"
                  >
                    Single PDF
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-ink-200 px-3 py-2 text-xs text-ink-500">
              <span>{totalCount} cards total</span>
              <button type="button" onClick={clearPrintQueue} className="text-red-700 hover:underline">
                Clear queue
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={doExportSheet}
            disabled={entries.length === 0 || busy}
            className="rounded-md bg-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-50 hover:bg-ink-700 disabled:opacity-50"
          >
            {busy ? "Generating…" : `Export 9-up sheet PDF (${entries.length === 0 ? 0 : Math.ceil(totalCount / 9)} pages)`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
