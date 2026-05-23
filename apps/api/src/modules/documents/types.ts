export type DocumentStatus =
  | "uploaded"
  | "extracting"
  | "chunking"
  | "embedding"
  | "processed"
  | "failed";

export interface Document {
  id: number;
  workspace_id?: string;

  filename: string;
  original_name: string;
  mime_type: string;

  size_bytes?: number;

  checksum?: string;

  status: DocumentStatus;

  progress: number;

  chunk_count?: number;

  error_message?: string;

  source?: string;

  summary?: string;

  embedding_model?: string;
  embedding_dimension?: number;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

// old code

// export type DocumentStatus =
//   | "uploaded"
//   | "processing"
//   | "processed"
//   | "failed";

// export interface Document {
//   id: number;
//   workspace_id?: string;

//   filename: string;
//   original_name: string;
//   mime_type: string;

//   size_bytes?: number;

//   checksum?: string;

//   status: DocumentStatus;

//   source?: string;

//   summary?: string;

//   embedding_model?: string;
//   embedding_dimension?: number;

//   created_at: string;
//   updated_at?: string;
//   deleted_at?: string;
// }

// export interface CreateDocumentInput {
//   filename: string;
//   original_name: string;
//   mime_type: string;
//   size_bytes?: number;
//   source?: string;
// }
