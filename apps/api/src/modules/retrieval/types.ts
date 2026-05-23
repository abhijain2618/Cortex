export interface RetrievalCitation {
  documentId: number;
  chunkId: number;
  chunkIndex: number;
  filename: string;
  content: string;
  similarity: number;
}

export interface RetrievalResponse {
  query: string;

  // raw chunks (debug + advanced use)
  chunks: any[];

  // structured citations (frontend + grounding)
  citations: RetrievalCitation[];

  // LLM-ready formatted context
  context: string;

  // debug info (optional)
  debug?: RetrievalDebug;
}

export interface BudgetedChunk {
  content: string;
  tokens: number;
  score: number;
  metadata?: any;
}

export interface RetrievalDebug {
  query: string;
  rewrittenQueries?: string[];

  vectorResults: any[];
  bm25Results: any[];

  mergedResults: any[];
  budgetedResults: any[];

  timings: {
    embeddingMs: number;
    vectorMs: number;
    bm25Ms: number;
    mergeMs: number;
    compressionMs?: number;
    totalMs: number;
  };

  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
}
