// ─── Document types ───────────────────────────────────────────────────────────

export type DocStatus = "uploading" | "processing" | "done" | "error";
export type DocType = "pdf" | "txt" | "md" | "docx" | "csv" | "html";

export interface RAGDocument {
  id: string;
  name: string;
  size: number; // bytes
  type: DocType;
  status: DocStatus;
  progress?: number; // 0–100, only while uploading/processing
  uploadedAt: string; // ISO date string
}
