"use client";

import { Bug } from "lucide-react";

interface DebugToggleProps {
  debugOpen: boolean;
  onToggleDebug: () => void;
}

// Convert this into a Floating button or put debug always true
export const DebugToggle = ({ debugOpen, onToggleDebug }: DebugToggleProps) => {
  return (
    <button
      onClick={onToggleDebug}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors ${
        debugOpen
          ? "bg-hover border-accent text-accent"
          : "bg-raised border-border text-text-secondary hover:bg-hover hover:text-text-primary"
      }`}
    >
      <Bug size={13} />
      Debug
    </button>
  );
};
