export interface QueryRewriteResult {
  originalQuery: string;

  rewrittenQueries: string[];

  selectedPrimaryQuery: string;

  reasoning?: string;

  latencyMs?: number;
}

export interface QueryRewriteProvider {
  rewrite(query: string): Promise<QueryRewriteResult>;
}
