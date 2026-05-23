import type { RAGDocument, ChatSession, RetrievedChunk, SourceMetadata } from "@/app/types";

export const MOCK_DOCS: RAGDocument[] = [
  {
    id: "doc-1",
    name: "technical-spec.pdf",
    size: 2_400_000,
    type: "pdf",
    status: "done",
    uploadedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-2",
    name: "release-notes.txt",
    size: 142_000,
    type: "txt",
    status: "done",
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-3",
    name: "architecture.md",
    size: 38_000,
    type: "md",
    status: "processing",
    progress: 60,
    uploadedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-4",
    name: "onboarding-guide.pdf",
    size: 8_100_000,
    type: "pdf",
    status: "uploading",
    progress: 30,
    uploadedAt: new Date().toISOString(),
  },
];

export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "chat-1",
    title: "Architecture deep-dive",
    preview: "What are the main components of...",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    docIds: ["doc-1", "doc-3"],
  },
  {
    id: "chat-2",
    title: "Release 2.1 changes",
    preview: "Summarize the breaking changes...",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    docIds: ["doc-2"],
  },
  {
    id: "chat-3",
    title: "API integration guide",
    preview: "How do I authenticate with...",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    docIds: ["doc-1"],
  },
  {
    id: "chat-4",
    title: "Deployment requirements",
    preview: "What infra is needed for prod...",
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    docIds: ["doc-1", "doc-2"],
  },
  {
    id: "chat-5",
    title: "Onboarding checklist",
    preview: "Generate a step-by-step guide...",
    createdAt: new Date(Date.now() - 33 * 60 * 60 * 1000).toISOString(),
    docIds: ["doc-4"],
  },
];

export const MOCK_CHUNKS: RetrievedChunk[] = [
  {
    id: "chunk-1",
    rank: 1,
    text: "The retrieval pipeline uses an ANN search over a Pinecone index with cosine similarity. Query vectors are normalized before lookup. The top-k is configurable (default 8).",
    score: 0.94,
    source: "technical-spec.pdf",
    page: 9,
    type: "pdf",
  },
  {
    id: "chunk-2",
    rank: 2,
    text: "Embeddings are generated using text-embedding-3-small with 1536 dimensions. Both document chunks and queries share the same embedding model.",
    score: 0.88,
    source: "architecture.md",
    section: "§3",
    type: "md",
  },
  {
    id: "chunk-3",
    rank: 3,
    text: "Re-ranking is applied after ANN lookup using a cross-encoder model (ms-marco-MiniLM) to improve precision. Final top-4 are passed to the generation step.",
    score: 0.79,
    source: "technical-spec.pdf",
    page: 11,
    type: "pdf",
  },
  {
    id: "chunk-4",
    rank: 4,
    text: "The ingestion pipeline uses a RecursiveCharacterTextSplitter with chunk size 512 and overlap 64. Each chunk is stored with document-level metadata in the vector store.",
    score: 0.65,
    source: "technical-spec.pdf",
    page: 4,
    type: "pdf",
  },
];

export const MOCK_METADATA: SourceMetadata = {
  source:    "technical-spec.pdf",
  page:      "9 / 24",
  chunkId:   "c_7f3a1b9e",
  tokens:    "487 / 512",
  model:     "text-emb-3-small",
  indexedAt: "2026-05-17 09:14",
};
