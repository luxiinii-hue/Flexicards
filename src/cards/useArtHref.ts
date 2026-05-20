import { useEffect, useState } from "react";
import type { ArtImageRef } from "@/types/card";
import { blobObjectUrl } from "@/state/blobStore";

/** Resolves an ArtImageRef to an object-URL string suitable for <image href>. */
export function useArtHref(art: ArtImageRef | undefined): string | undefined {
  const [href, setHref] = useState<string | undefined>(undefined);
  const blobId = art?.blobId;
  useEffect(() => {
    let cancelled = false;
    if (!blobId) {
      setHref(undefined);
      return;
    }
    blobObjectUrl(blobId).then((url) => {
      if (!cancelled) setHref(url ?? undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [blobId]);
  return href;
}
