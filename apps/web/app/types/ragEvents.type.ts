export type RagEventType =
  | "retrieval_started"
  | "chunks_received"
  | "citations_ready"
  | "llm_streaming"
  | "done";

export interface RagEvent {
  type: RagEventType;
  time: number;
  meta?: Record<string, any>;
}