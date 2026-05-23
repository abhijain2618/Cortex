"use client";

import type { RetrievedChunk, SourceMetadata } from "@/app/types";
import { PanelTitle } from "./PanelTitle";
import { MetaTable } from "./MetaTable";
import { Scores } from "./Scores";
import { Chunks } from "./Chunks";
import { RAGTimeline } from "./RAGTimeline";
import { useChatStore } from "@/app/stores/chat-store";

/* ──────────────────────────────────────────────────────────────── */
/* Debug Panel */
/* ──────────────────────────────────────────────────────────────── */

export default function DebugPanel() {
  const chunks = useChatStore((s) => s.chunks);
  const metadata = useChatStore((s) => s.metadata);
  const events = useChatStore((s) => s.events);

  const sortedChunks = [...chunks].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );

  return (
    <aside className="w-[300px] min-w-[300px] border-l border-border bg-surface flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <PanelTitle />
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
        {/* RAG Timeline */}
        <RAGTimeline />

        {/* Chunks */}
        <Chunks sortedChunks={sortedChunks} />

        {/* Scores */}
        <Scores sortedChunks={sortedChunks} />

        {/* Metadata */}
        {metadata && <MetaTable metadata={metadata} />}
      </div>
    </aside>
  );
}
