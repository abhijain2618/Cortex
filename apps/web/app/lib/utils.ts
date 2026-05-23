import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DocType } from "@/app/types";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format bytes → human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format ISO date → time string for sidebar */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Group chat sessions by date bucket */
export function groupByDate(
  items: { createdAt: string }[]
): Record<string, number[]> {
  const now = new Date();
  const groups: Record<string, number[]> = {};
  items.forEach((item, i) => {
    const d = new Date(item.createdAt);
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    const label =
      diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : "Earlier";
    if (!groups[label]) groups[label] = [];
    groups[label].push(i);
  });
  return groups;
}

/** Return Tailwind colour classes per doc extension */
export function docColorClasses(type: DocType): {
  bg: string;
  text: string;
} {
  switch (type) {
    case "pdf":  return { bg: "bg-red/10",    text: "text-red" };
    case "txt":  return { bg: "bg-accent/10", text: "text-accent" };
    case "md":   return { bg: "bg-green/10",  text: "text-green" };
    case "docx": return { bg: "bg-amber/10",  text: "text-amber" };
    case "csv":  return { bg: "bg-green/10",  text: "text-green" };
    case "html": return { bg: "bg-accent/10", text: "text-accent" };
    default:     return { bg: "bg-hover",     text: "text-text-secondary" };
  }
}

/** Clamp score → bar width percentage */
export function scoreToWidth(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/** Colour classes for similarity score */
export function scoreColor(score: number): string {
  if (score >= 0.85) return "text-green";
  if (score >= 0.70) return "text-accent";
  if (score >= 0.55) return "text-amber";
  return "text-text-secondary";
}

export function scoreBgColor(score: number): string {
  if (score >= 0.85) return "bg-green";
  if (score >= 0.70) return "bg-accent";
  if (score >= 0.55) return "bg-amber";
  return "bg-text-muted";
}
