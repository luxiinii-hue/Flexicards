import { useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import type { ArtImageRef } from "@/types/card";
import { putBlob, deleteBlob, blobObjectUrl } from "@/state/blobStore";

interface Props {
  value: ArtImageRef | undefined;
  onChange: (next: ArtImageRef | undefined) => void;
  /** Aspect ratio of the art frame (w/h). Defaults to a typical creature card ratio. */
  aspect?: number;
}

const DEFAULT_ASPECT = 653 / 490; // ART_W / ART_H from tokens

export function ArtUploader({ value, onChange, aspect = DEFAULT_ASPECT }: Props): JSX.Element {
  const [editorOpen, setEditorOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | undefined>(undefined);
  const [sourceFilename, setSourceFilename] = useState<string>("uploaded.png");
  const [thumbHref, setThumbHref] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Hydrate thumbnail from blob
  useEffect(() => {
    if (!value?.blobId) {
      setThumbHref(undefined);
      return;
    }
    let cancelled = false;
    blobObjectUrl(value.blobId).then((u) => {
      if (!cancelled) setThumbHref(u ?? undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [value?.blobId]);

  function pickFile() {
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please pick an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    setSourceFilename(file.name);
    setEditorOpen(true);
  }

  async function commitCrop(cropped: Blob, transform: { x: number; y: number; scale: number; rotation: number }) {
    // Delete previous blob if present
    if (value?.blobId) {
      try {
        await deleteBlob(value.blobId);
      } catch {
        // ignore
      }
    }
    const blobId = await putBlob(cropped);
    const dimensions = await measureBlob(cropped);
    const next: ArtImageRef = {
      blobId,
      originalFilename: sourceFilename,
      transform,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: cropped.type || "image/jpeg",
    };
    onChange(next);
    setEditorOpen(false);
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(undefined);
  }

  async function remove() {
    if (value?.blobId) {
      try {
        await deleteBlob(value.blobId);
      } catch {
        // ignore
      }
    }
    onChange(undefined);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-16 w-24 overflow-hidden rounded-md border border-ink-300 bg-ink-100">
          {thumbHref ? (
            <img src={thumbHref} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-ink-400">No art</div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={pickFile}
            className="rounded-md border border-ink-300 bg-white px-2 py-1 text-xs font-semibold text-ink-700 hover:bg-ink-100"
          >
            {value ? "Replace…" : "Upload art…"}
          </button>
          {value ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  // Re-open editor on existing blob
                  if (!value.blobId) return;
                  const url = await blobObjectUrl(value.blobId);
                  if (url) {
                    setSourceUrl(url);
                    setSourceFilename(value.originalFilename || "edit.png");
                    setEditorOpen(true);
                  }
                }}
                className="rounded-md border border-ink-300 bg-white px-2 py-1 text-xs text-ink-700 hover:bg-ink-100"
              >
                Re-frame…
              </button>
              <button
                type="button"
                onClick={remove}
                className="text-xs text-red-700 hover:underline"
              >
                Remove
              </button>
            </>
          ) : null}
        </div>
      </div>
      <p className="text-[11px] text-ink-500">
        Drag or click to upload. Use the framing tool to crop, pan, zoom and rotate the image to fit the art window.
      </p>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

      {editorOpen && sourceUrl ? (
        <CropEditor
          src={sourceUrl}
          aspect={aspect}
          initialTransform={value?.transform}
          onCancel={() => {
            setEditorOpen(false);
            if (sourceUrl) URL.revokeObjectURL(sourceUrl);
            setSourceUrl(undefined);
          }}
          onCommit={commitCrop}
        />
      ) : null}
    </div>
  );
}

interface EditorProps {
  src: string;
  aspect: number;
  initialTransform?: { x: number; y: number; scale: number; rotation: number };
  onCancel: () => void;
  onCommit: (blob: Blob, transform: { x: number; y: number; scale: number; rotation: number }) => void;
}

function CropEditor({ src, aspect, initialTransform, onCancel, onCommit }: EditorProps): JSX.Element {
  const [crop, setCrop] = useState<{ x: number; y: number }>(
    initialTransform ? { x: initialTransform.x, y: initialTransform.y } : { x: 0, y: 0 }
  );
  const [zoom, setZoom] = useState<number>(initialTransform?.scale ?? 1);
  const [rotation, setRotation] = useState<number>(initialTransform?.rotation ?? 0);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);

  async function commit() {
    if (!areaPixels) return;
    const blob = await renderCroppedBlob(src, areaPixels, rotation);
    onCommit(blob, { x: crop.x, y: crop.y, scale: zoom, rotation });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-ink-50 shadow-deep">
        <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
          <h2 className="text-base font-semibold text-ink-900">Frame the art</h2>
          <button type="button" onClick={onCancel} className="text-ink-500 hover:text-ink-900">
            ×
          </button>
        </div>
        <div className="relative flex-1 bg-ink-200" style={{ minHeight: 380 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, areaPx) => setAreaPixels(areaPx)}
            objectFit="contain"
          />
        </div>
        <div className="space-y-3 border-t border-ink-200 p-4">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-20 text-ink-600">Zoom</span>
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-right text-xs tabular-nums text-ink-500">{zoom.toFixed(2)}×</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <span className="w-20 text-ink-600">Rotate</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-right text-xs tabular-nums text-ink-500">{rotation}°</span>
            <button
              type="button"
              onClick={() => setRotation(0)}
              className="rounded-md border border-ink-300 bg-white px-2 py-1 text-xs hover:bg-ink-100"
            >
              Reset
            </button>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={commit}
              className="rounded-md bg-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-50 hover:bg-ink-700"
            >
              Use this framing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Renders the cropped region to a JPEG Blob suitable for storage. */
async function renderCroppedBlob(src: string, area: Area, rotation: number): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  // Output size: at least 2x the displayed art frame (≈1300×975 for normal cards)
  const outW = Math.min(1600, Math.max(area.width, 1300));
  const outH = Math.round(outW * (area.height / area.width));

  canvas.width = outW;
  canvas.height = outH;

  // Rotation handling: render the source onto a rotation-aware canvas, then crop.
  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const safeW = image.width * cos + image.height * sin;
  const safeH = image.width * sin + image.height * cos;

  const tmp = document.createElement("canvas");
  tmp.width = safeW;
  tmp.height = safeH;
  const tmpCtx = tmp.getContext("2d");
  if (!tmpCtx) throw new Error("2D context unavailable");
  tmpCtx.translate(safeW / 2, safeH / 2);
  tmpCtx.rotate(radians);
  tmpCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // area is in the rotated source coordinates (Cropper.js convention)
  ctx.drawImage(tmp, area.x, area.y, area.width, area.height, 0, 0, outW, outH);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode blob"));
      },
      "image/jpeg",
      0.92
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function measureBlob(blob: Blob): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    return { width: img.width, height: img.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}
