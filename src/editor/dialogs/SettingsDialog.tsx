import { useStore } from "@/state/store";
import { Modal } from "./Modal";
import { Field, ToggleRow } from "../fields/Field";
import { db } from "@/state/db";
import { exportCollectionAsJson, importCollectionFromJson } from "@/services/jsonIO";
import { pushToast } from "../toastBus";

interface Props {
  onClose: () => void;
}

export function SettingsDialog({ onClose }: Props): JSX.Element {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const activeCollectionId = useStore((s) => s.activeCollectionId);

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Default paper size">
          <select
            value={settings.defaultPaperSize}
            onChange={(e) => void updateSettings({ defaultPaperSize: e.target.value as "A4" | "Letter" })}
            className="w-full rounded-md border border-ink-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="A4">A4 (Europe)</option>
            <option value="Letter">US Letter</option>
          </select>
        </Field>
        <ToggleRow
          label="Default to crop marks in PDFs"
          checked={settings.defaultCropMarks}
          onChange={(v) => void updateSettings({ defaultCropMarks: v })}
        />
        <ToggleRow
          label="Show safe-zone guide in preview"
          checked={settings.showSafeZoneGuide}
          onChange={(v) => void updateSettings({ showSafeZoneGuide: v })}
        />

        <div className="border-t border-ink-200 pt-4">
          <div className="mb-2 text-sm font-semibold text-ink-700">Backup / restore</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!activeCollectionId) return;
                await exportCollectionAsJson(activeCollectionId);
                pushToast("Collection exported", "success");
              }}
              className="rounded-md border border-ink-300 bg-white px-3 py-1.5 text-sm hover:bg-ink-100"
            >
              Export current collection (.json)
            </button>
            <label className="cursor-pointer rounded-md border border-ink-300 bg-white px-3 py-1.5 text-sm hover:bg-ink-100">
              Import .json…
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    await importCollectionFromJson(text);
                    pushToast("Collection imported. Reload to see the new collection.", "success");
                  } catch (err) {
                    pushToast(`Import failed: ${(err as Error).message}`, "error");
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="border-t border-red-200 pt-4">
          <div className="mb-2 text-sm font-semibold text-red-700">Danger zone</div>
          <button
            type="button"
            onClick={async () => {
              if (
                !window.confirm(
                  "This will delete ALL collections, cards, art images, and settings stored in your browser. There is no undo. Are you sure?"
                )
              ) {
                return;
              }
              await db.delete();
              window.location.reload();
            }}
            className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
          >
            Reset all data
          </button>
        </div>

        <div className="border-t border-ink-200 pt-4 text-xs text-ink-500">
          <p>
            Flexicards uses no Wizards-trademarked art or fonts. Mana symbol artwork comes from the open-source{" "}
            <a href="https://mana.andrewgioia.com" target="_blank" rel="noreferrer" className="underline">
              Mana Project
            </a>{" "}
            and equivalents. Custom cards are intended for personal use only.
          </p>
        </div>
      </div>
    </Modal>
  );
}
