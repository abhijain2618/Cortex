/* ──────────────────────────────────────────────────────────────── */
/* Chunk Card */
/* ──────────────────────────────────────────────────────────────── */

import { cn } from "@/app/lib/utils";
import { RetrievedChunk } from "@/app/types";
import { FileText, Hash, Layers } from "lucide-react";

export const Chunks = ({
  sortedChunks,
}: {
  sortedChunks: RetrievedChunk[];
}) => {
  return (
    <section>
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-text-muted mb-2">
        <Layers size={13} />
        Retrieved chunks
      </div>

      <div className="flex flex-col gap-2">
        {sortedChunks.length === 0 ? (
          <div className="text-[11px] text-text-muted">
            Waiting for retrieval…
          </div>
        ) : (
          sortedChunks.map((chunk) => {
            const isTop = chunk.rank === 1;
            const Icon = chunk.type === "md" ? Hash : FileText;

            return (
              <div
                key={chunk.id}
                className={cn(
                  "relative bg-raised border rounded p-2.5 transition-colors hover:border-border-mid",
                  isTop ? "border-accent/30" : "border-border",
                )}
              >
                {/* Rank */}
                <span
                  className={cn(
                    "absolute top-2 right-2 text-[9px] font-mono",
                    isTop ? "text-accent" : "text-text-muted",
                  )}
                >
                  #{chunk.rank ?? "-"}
                </span>

                {/* Text */}
                <p className="text-[11px] leading-relaxed text-text-secondary line-clamp-3 mb-2 pr-6">
                  {chunk.text}
                </p>

                {/* Source */}
                <div className="flex items-center gap-1 bg-base border border-border rounded px-1.5 py-0.5 w-fit">
                  <Icon size={11} className="text-text-muted" />
                  <span className="text-[10px] font-mono text-text-muted truncate max-w-[140px]">
                    {chunk.source ?? "unknown"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
