/* ──────────────────────────────────────────────────────────────── */
/* Metadata Table */
/* ──────────────────────────────────────────────────────────────── */

import { SourceMetadata } from "@/app/types";
import { cn } from "@/app/lib/utils";
import { Info } from "lucide-react";

function Meta({ meta }: { meta: SourceMetadata }) {
  const rows: [string, string | number | undefined][] = [
    ["source", meta.source],
    ["page", meta.page],
    ["chunk_id", meta.chunkId],
    ["tokens", meta.tokens],
    ["model", meta.model],
    ["indexed", meta.indexedAt],
  ];

  return (
    <div className="bg-raised border border-border rounded overflow-hidden">
      {rows.map(([key, val]) => (
        <div
          key={key}
          className="flex items-center border-b border-border last:border-none text-[11px]"
        >
          <div className="px-2.5 py-1.5 bg-base border-r border-border text-[10px] font-mono text-text-muted w-24 flex-shrink-0">
            {key}
          </div>

          <div
            className={cn(
              "px-2.5 py-1.5 text-text-secondary break-all",
              key === "chunk_id" || key === "model"
                ? "font-mono text-[10px]"
                : "",
            )}
          >
            {val ?? "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

export const MetaTable = ({ metadata }: { metadata: SourceMetadata }) => {
  return (
    <section>
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-text-muted mb-2">
        <Info size={13} />
        Source metadata
      </div>

      <Meta meta={metadata} />
    </section>
  );
};
