export function toDocumentDTO(doc: any) {
  return {
    id: String(doc.id),

    name: doc.original_name,
    type: getType(doc.original_name),

    size: doc.size_bytes ?? 0,

    status: mapStatus(doc.status),
    progress: doc.progress ?? 0,

    uploadedAt: doc.created_at,
    updatedAt: doc.updated_at,

    chunkCount: doc.chunk_count ?? 0,
    error: doc.error_message,
  };
}

function mapStatus(status: string) {
  switch (status) {
    case "uploaded":
    case "extracting":
    case "chunking":
    case "embedding":
      return "processing";

    case "processed":
      return "done";

    case "failed":
      return "error";

    default:
      return "processing";
  }
}

function getType(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "txt";
}
