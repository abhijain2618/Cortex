import type { UIMessage } from "ai";

import type {
Citation,
ParsedStreamData,
RetrievedChunk,
SourceMetadata,
StreamNotification,
} from "./types";

export function parseStreamParts(
messages: UIMessage[]
): ParsedStreamData {
const parsed: ParsedStreamData = {
chunks: [],
citations: [],
};

for (const message of messages) {
if (!message.parts?.length) {
continue;
}

for (const part of message.parts) {
  switch (part.type) {
    // ─────────────────────────────────────────────
    // Retrieval Chunks
    // ─────────────────────────────────────────────
    case "data-chunks": {
  if ("data" in part && Array.isArray(part.data)) {
    parsed.chunks = part.data.map((c: any) => ({
      id: c.chunk_id,
      rank: c.chunk_index ?? 0,
      score: c.score ?? c.vector_score ?? 0,

      text: c.content,

      source: c.filename ?? c.original_name ?? "unknown",

      page: c.page,
      section: c.section,
      type: "pdf",
    }));
  }
  break;
}

    // ─────────────────────────────────────────────
    // Citations
    // ─────────────────────────────────────────────
    case "data-citations": {
  if ("data" in part && Array.isArray(part.data)) {
    parsed.citations = part.data.map((c: any) => ({
      id: Number(c.chunkId ?? c.chunk_id ?? 0),
      source: c.filename ?? "unknown",
      page: c.page,
      section: c.section,
      type: "pdf",
    }));
  }
  break;
}

    // ─────────────────────────────────────────────
    // Notifications
    // ─────────────────────────────────────────────
    case "data-notification": {
      if ("data" in part) {
        parsed.notification =
          part.data as StreamNotification;
      }

      break;
    }

    // ─────────────────────────────────────────────
    // Source Metadata
    // ─────────────────────────────────────────────
    case "data-metadata": {
      if ("data" in part) {
        parsed.metadata =
          part.data as SourceMetadata;
      }

      break;
    }

    default:
      break;
  }
}

}

return parsed;
}
