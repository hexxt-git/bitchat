import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";

// 1x1 white pixel fallback for SSR
const FALLBACK_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

/**
 * 8x8 Bayer matrix - 65 intensity levels for a smoother dithered gradient.
 * Single-pass O(n) algorithm.
 */
const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
] as const;

const BAYER_MAX = 64;

/**
 * Superellipse (squircle): smooth rounded shape, n=2.5 for soft corners.
 * Returns insideness: 1 at center, 0 at edge, negative outside.
 */
function superellipseSdf(
  x: number,
  y: number,
  rx: number,
  ry: number,
  n: number,
): number {
  const nx = Math.abs(x) / rx;
  const ny = Math.abs(y) / ry;
  return 1 - Math.pow(Math.pow(nx, n) + Math.pow(ny, n), 1 / n);
}

function generateDitheredIslandDataUrl(
  width: number,
  height: number,
  islandSize: number,
  edgeWidth: number,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const cx = width / 2;
  const cy = height / 2;
  const rx = width * islandSize;
  const ry = height * islandSize;
  const margin = edgeWidth;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sdf = superellipseSdf(x - cx, y - cy, rx, ry, 4.5);

      let v: number;
      if (sdf > margin) {
        v = 255;
      } else if (sdf < -margin) {
        v = 0;
      } else {
        const gradientValue = (margin - sdf) / (2 * margin);
        const bayerThreshold = BAYER_8X8[y % 8][x % 8] / BAYER_MAX;
        v = gradientValue < bayerThreshold ? 255 : 0;
      }

      const i = (y * width + x) * 4;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Auth page background: organic island shape (white) on black.
 * Uses viewport dimensions minus a few dozen pixels. Dithering only at the island edge.
 */
export function AuthBackground() {
  const [dims, setDims] = useState(() => {
    if (typeof window === "undefined") return { w: 1024, h: 1024 };
    return {
      w: Math.max(1, window.innerWidth),
      h: Math.max(1, window.innerHeight),
    };
  });
  const [displayOpacity, setDisplayOpacity] = useState(1);
  const [displayDataUrl, setDisplayDataUrl] = useState(FALLBACK_DATA_URL);
  const { resolvedTheme } = useTheme();
  const invert = resolvedTheme === "dark";

  const islandSize = invert ? 0.7 : 0.55;
  const edgeWidth = invert ? 0.32 : 0.3;

  const dataUrl = useMemo(() => {
    if (typeof document === "undefined") return FALLBACK_DATA_URL;
    const pixelScale = 1.35;
    return generateDitheredIslandDataUrl(
      Math.floor(dims.w / pixelScale),
      Math.floor(dims.h / pixelScale),
      islandSize,
      edgeWidth,
    );
  }, [dims.w, dims.h, islandSize, edgeWidth]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () =>
          setDims({
            w: Math.max(1, window.innerWidth),
            h: Math.max(1, window.innerHeight),
          }),
        150,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Crossfade when dataUrl changes (theme, resize) to avoid snapping
  useEffect(() => {
    if (dataUrl === displayDataUrl) {
      setDisplayOpacity(1);
      return;
    }
    // Initial load: show immediately
    const isInitial = displayDataUrl === FALLBACK_DATA_URL;
    if (isInitial) {
      setDisplayDataUrl(dataUrl);
      setDisplayOpacity(1);
      return;
    }
    setDisplayOpacity(0);
    const t = setTimeout(() => {
      setDisplayDataUrl(dataUrl);
      requestAnimationFrame(() => setDisplayOpacity(1));
    }, 150);
    return () => clearTimeout(t);
  }, [dataUrl, displayDataUrl]);

  return (
    <img
      src={displayDataUrl}
      alt="Auth background"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-150 ease-out"
      style={{
        objectFit: "cover",
        objectPosition: "center",
        imageRendering: "pixelated",
        width: "100%",
        height: "100%",
        opacity: displayOpacity,
        filter: invert ? "invert(1)" : undefined,
      }}
    />
  );
}
