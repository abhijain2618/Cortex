import { cn, docColorClasses, formatBytes } from "@/app/lib/utils";
import { DocType, RAGDocument } from "@/app/types";
import { CloudUpload, FileCode2, FileText, Hash } from "lucide-react";

// ─── Doc icon ────────────────────────────────────────────────────────────────
function DocIcon({ type }: { type: DocType }) {
  const { bg, text } = docColorClasses(type);
  const Icon =
    type === "pdf"
      ? FileText
      : type === "md"
        ? Hash
        : type === "csv"
          ? FileCode2
          : FileText;

  return (
    <span
      className={cn(
        "w-7 h-7 rounded-[5px] flex items-center justify-center flex-shrink-0 text-sm",
        bg,
        text,
      )}
    >
      <Icon size={14} />
    </span>
  );
}

// ─── Status dot ─────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: RAGDocument["status"] }) {
  return (
    <span
      title={status}
      className={cn(
        "w-1.5 h-1.5 rounded-full flex-shrink-0",
        status === "done" && "bg-green",
        status === "processing" && "bg-amber animate-pulse2",
        status === "uploading" && "bg-accent animate-pulse2",
        status === "error" && "bg-red",
      )}
    />
  );
}

// ─── Single document row ──────────────────────────────────────────────────────
function DocItem({
  doc,
  active,
  onClick,
}: {
  doc: RAGDocument;
  active: boolean;
  onClick: () => void;
}) {
  const selectable = doc.status === "done";

  return (
    <div
      onClick={selectable ? onClick : undefined}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors border",
        active
          ? "bg-accent/15 border-accent/30"
          : "border-transparent hover:bg-hover",
        !selectable && "opacity-50 cursor-not-allowed",
      )}
    >
      <DocIcon type={doc.type} />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary truncate">
          {doc.name}
        </p>

        <p className="text-[10px] text-text-muted font-mono">
          {formatBytes(doc.size)}
        </p>

        {(doc.status === "uploading" || doc.status === "processing") && (
          <div className="h-0.5 bg-hover rounded mt-0.5 overflow-hidden">
            <div
              className={cn(
                "h-full rounded bg-accent",
                doc.progress == null ? "animate-progress" : "",
              )}
              style={
                doc.progress != null ? { width: `${doc.progress}%` } : undefined
              }
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <StatusDot status={doc.status} />

        <div
          className={cn(
            "w-2 h-2 rounded-full",
            active ? "bg-accent" : "bg-border",
          )}
        />
      </div>
    </div>
  );
}

interface DocumentsProps {
  docs: RAGDocument[];
  activeDocIds: string[];
  onUploadClick: () => void;
  onToggleDoc: (docId: string) => void;
}
export const Documents = ({
  docs,
  activeDocIds,
  onUploadClick,
  onToggleDoc,
}: DocumentsProps) => {
  return (
    <>
      {/* Upload button */}
      <button
        onClick={onUploadClick}
        className="mx-3 my-3 px-3.5 py-2 flex items-center gap-2 text-accent bg-accent/10 border border-accent/20 rounded hover:bg-accent/20 transition-colors"
      >
        Upload document
      </button>

      {/* Header */}
      <div className="px-4 py-1.5 flex items-center justify-between">
        <span className="text-[10px] uppercase text-text-muted">Documents</span>
        <span className="text-[10px] text-text-secondary bg-hover rounded-full px-1.5 py-px">
          {docs.length}
        </span>
      </div>

      {/* List */}
      <div className="px-2 max-h-48 overflow-y-auto flex-shrink-0">
        {docs.map((doc) => (
          <DocItem
            key={doc.id}
            doc={doc}
            active={activeDocIds.includes(doc.id)}
            onClick={() => onToggleDoc(doc.id)}
          />
        ))}
      </div>
    </>
  );
};
