import { UIMessage } from "ai";
import { RetrievedChunk } from "./chunk.type";
import { SourceMetadata } from "./debug.type";
import { DocType } from "./documents.type";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface Citation {
  id: number;
  source: string; // filename
  page?: number;
  section?: string; // e.g. "§3.2"
  type: DocType;
}

export interface ParsedStreamData {
  chunks?: RetrievedChunk[];
  citations?: Citation[];
  notification?: StreamNotification;
  metadata?: SourceMetadata;
}

export interface StreamNotification {
  message: string;
  level: "info" | "warning" | "error";
}
