
// ─── Debug info attached to each AI response ─────────────────────────────────

import { Citation, StreamNotification } from "./chat.types";
import { RetrievedChunk } from "./chunk.type";

export interface SourceMetadata {
  source:    string;
  page?:     string;
  chunkId:   string;
  tokens:    string;
  model:     string;
  indexedAt: string;
}

export interface DebugInfo {
  chunks:    RetrievedChunk[];
  metadata?: SourceMetadata;
}

export interface DebugState {
chunks: RetrievedChunk[];
citations: Citation[];
notifications: StreamNotification[];

metadata?: SourceMetadata;
}