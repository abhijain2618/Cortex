import { vectorStore } from "../vector";
import { compressionService } from "../compression";
import { BudgetAllocator } from "./budgetAllocator";
import { embeddingService } from "../../providers/embeddings";
import { queryRewriteService } from "../queryRewrite"; // FIXED IMPORT
import { RerankerService } from "../reranker/service";

export class RetrievalService {
  private allocator = new BudgetAllocator();
  private reranker = new RerankerService();

  private disableInLocal: boolean = true;

  async retrieve(query: string, topK = 5, debug = false, model = "phi3:mini") {
    const start = Date.now();

    const debugPayload: any = {
      query,
      vectorResults: [],
      bm25Results: [],
      mergedResults: [],
      budgetedResults: [],
      queryRewrite: null,
      timings: {
        rewriteMs: 0,
        embeddingMs: 0,
        vectorMs: 0,
        bm25Ms: 0,
        mergeMs: 0,
        compressionMs: 0,
        totalMs: 0,
      },
    };

    // 1. QUERY REWRITE
    const t0 = Date.now();

    const rewrite = await queryRewriteService.rewrite(query);

    const queries = rewrite.rewrittenQueries;
    const primaryQuery = rewrite.selectedPrimaryQuery;

    debugPayload.queryRewrite = rewrite;
    debugPayload.timings.rewriteMs = Date.now() - t0;

    // 2. EMBEDDING
    const t1 = Date.now();

    const embedding = await embeddingService.embed(primaryQuery);

    debugPayload.timings.embeddingMs = Date.now() - t1;

    // 3. RETRIEVAL (FIXED BM25 FLATTENING)
    const t2 = Date.now();

    const [vectorResults, bm25Nested] = await Promise.all([
      vectorStore.searchVector(embedding, topK * 3),
      Promise.all(queries.map((q: any) => vectorStore.searchBM25(q, topK * 2))),
    ]);

    const bm25Results = bm25Nested.flat(); // FIXED

    debugPayload.vectorResults = vectorResults;
    debugPayload.bm25Results = bm25Results;

    debugPayload.timings.vectorMs = Date.now() - t2;

    // 4. MERGE (FIXED INPUT)
    const t3 = Date.now();

    const merged = this.mergeResults(vectorResults, bm25Results);

    debugPayload.mergedResults = merged;
    debugPayload.timings.mergeMs = Date.now() - t3;

    // 5. CANDIDATES
    const candidateChunks = merged.slice(0, topK * 5);
    // 6. BUDGET
    const budgeted = this.allocator.allocate(candidateChunks, 2000);
    debugPayload.budgetedResults = budgeted;

    // 7. INITIAL SELECTION (wider pool for reranker)
    const preRerankChunks = budgeted.slice(0, topK * 5);
    // 8. RERANKING (NEW LAYER)
    let rerankedChunks: any[] = [];

    if (!this.disableInLocal) {
      rerankedChunks = await this.reranker.rerank(
        primaryQuery,
        preRerankChunks,
        model
      );

      debugPayload.rerank = rerankedChunks.map((c) => ({
        chunkId: c.chunk_id,
        score: c.rerankScore,
      }));
    }

    // final selection after rerank
    const chunks = preRerankChunks.slice(0, topK);
    // 8. COMPRESSION (FIXED QUERY)
    const t4 = Date.now();

    let compressedChunks: any[] = [];
    if (this.disableInLocal) {
      compressedChunks = chunks;
    } else {
      compressedChunks = await Promise.all(
        chunks.map(async (c) => {
          const compressed = await compressionService.compress(
            primaryQuery, // FIXED
            c.content
          );

          return {
            ...c,
            content: compressed,
          };
        })
      );
    }

    debugPayload.timings.compressionMs = Date.now() - t4;

    debugPayload.timings.totalMs = Date.now() - start;

    // 9. CITATIONS
    const citations = compressedChunks.map((c: any) => ({
      documentId: c.document_id,
      chunkId: c.chunk_id,
      chunkIndex: c.chunk_index,
      filename: c.filename || c.original_name,
      content: c.content,
      score: c.score,
    }));
    const context = this.buildContext(citations);

    return {
      query,
      chunks: compressedChunks,
      citations,
      context,
      debug: debug ? debugPayload : undefined,
    };
  }

  // unchanged (correct logic)
  private mergeResults(vector: any[], bm25: any[]) {
    const map = new Map<string, any>();

    vector.forEach((v, i) => {
      map.set(v.chunk_id, {
        ...v,
        score: 0.6 * (1 / (i + 1)),
      });
    });

    bm25.forEach((b, i) => {
      const existing = map.get(b.chunk_id);

      if (existing) {
        existing.score += 0.4 * (1 / (i + 1));
      } else {
        map.set(b.chunk_id, {
          ...b,
          score: 0.4 * (1 / (i + 1)),
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    );
  }

  private buildContext(citations: any[]) {
    return citations
      .map((c, i) =>
        `
[Source ${i + 1}]
Document: ${c.filename}
Chunk: ${c.chunkIndex}
Score: ${c.score ?? 0}

${c.content}
        `.trim()
      )
      .join("\n\n");
  }
}
