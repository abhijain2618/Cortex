import type { ChatSession } from "@/app/types";

export function mapSession(dto: any): ChatSession {
  return {
    id: dto.id,
    title: dto.title,

    docIds: dto.document_ids ?? [],

    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
