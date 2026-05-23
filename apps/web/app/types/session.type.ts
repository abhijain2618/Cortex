// ─── Chat session ────────────────────────────────────────────────────────────

export interface ChatSession {
  id: string;
  title: string;
  preview?: string;
  createdAt: string;
  updatedAt: string;
  docIds: string[]; // which docs were active
}
