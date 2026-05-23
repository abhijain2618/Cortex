import { QueryRewriteProvider } from "./queryRewrite.provider";

export class QueryRewriteService {
  constructor(private provider: QueryRewriteProvider) {}

  async rewrite(query: string): Promise<{
    originalQuery: string;

    rewrittenQueries: string[];

    selectedPrimaryQuery: string;

    reasoning?: string;

    latencyMs?: number;
  }> {
    return this.provider.rewrite(query);
  }
}
