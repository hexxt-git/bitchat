import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a user-friendly error message from an unknown error value.
 * Handles Error instances, Convex-wrapped errors, nested errors, and primitives.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const raw = err instanceof Error ? err.message : String(err ?? "").trim();
  if (!raw) return fallback;

  // Strip Convex wrapper: [CONVEX A(path)] [Request ID: xxx] Server Error\nActual message
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const meaningful = lines.find(
    (l) =>
      !l.startsWith("[CONVEX") &&
      !l.includes("Request ID") &&
      !l.includes("Called by client") &&
      l !== "Server Error",
  );

  // Unwrap nested "Uncaught Error: Inner message" patterns
  let extracted = meaningful ?? raw;
  let prev: string;
  do {
    prev = extracted;
    extracted = extracted.replace(/^(?:Uncaught\s+)?Error:\s*/i, "").trim();
  } while (prev !== extracted);

  return extracted || fallback;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(timestamp).toLocaleDateString();
}
