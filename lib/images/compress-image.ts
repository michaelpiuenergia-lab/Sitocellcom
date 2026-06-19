"use client";

/**
 * Compressione foto lato client -> data URL JPEG.
 *
 * Le foto allegate (es. permuta) viaggiano come data URL compressi nel payload
 * verso il CRM, che le salva in DB (niente filesystem: prod-safe su Vercel).
 * Ridimensioniamo via canvas a ~1280px e qualita' 0.7 -> ~100-300 KB a foto.
 *
 * Solo client (usa Image/canvas/FileReader del browser).
 */

export type CompressOptions = {
  /** Lato massimo (px). Default 1280. */
  maxDim?: number;
  /** Qualita' JPEG 0..1. Default 0.7. */
  quality?: number;
};

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error("Lettura file fallita"));
    fr.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Immagine non valida"));
    img.src = src;
  });

export async function fileToCompressedDataUrl(
  file: File,
  opts: CompressOptions = {},
): Promise<string> {
  const maxDim = opts.maxDim ?? 1280;
  const quality = opts.quality ?? 0.7;

  if (!file.type.startsWith("image/")) {
    throw new Error("Il file non è un'immagine");
  }
  const original = await readAsDataUrl(file);

  let img: HTMLImageElement;
  try {
    img = await loadImage(original);
  } catch {
    return original;
  }

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, width, height);

  try {
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return original;
  }
}
