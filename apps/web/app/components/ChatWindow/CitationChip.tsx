import { FileText, Hash, FileCode2 } from "lucide-react";
import type { Citation } from "@/app/types";

function DocIcon({ type }: { type: Citation["type"] }) {
  if (type === "md")  return <Hash size={11} />;
  if (type === "csv") return <FileCode2 size={11} />;
  return <FileText size={11} />;
}

export default function CitationChip({ citation }: { citation: Citation }) {
  const loc = citation.page
    ? `p.${citation.page}`
    : citation.section
    ? citation.section
    : "";

  return (
    <button className="flex items-center gap-1.5 bg-raised border border-border rounded px-2 py-1 text-[11px] font-mono text-text-secondary hover:border-accent hover:text-accent transition-colors">
      <span className="w-4 h-4 rounded-full bg-accent/10 text-accent text-[9px] font-semibold flex items-center justify-center flex-shrink-0">
        {citation.id}
      </span>
      <DocIcon type={citation.type} />
      <span className="truncate max-w-[120px]">{citation.source}</span>
      {loc && <span className="text-text-muted">· {loc}</span>}
    </button>
  );
}
