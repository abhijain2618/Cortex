import { estimateTokens } from "../../shared/utils/token";

export class BudgetAllocator {
  allocate(chunks: any[], maxTokens = 2000) {
    const enriched = chunks.map((c) => ({
      ...c,
      tokens: estimateTokens(c.content),
    }));

    // sort by score (already computed in hybrid + rerank)
    enriched.sort((a, b) => b.score - a.score);

    const selected = [];
    let used = 0;

    for (const chunk of enriched) {
      if (used + chunk.tokens > maxTokens) continue;

      selected.push(chunk);
      used += chunk.tokens;
    }

    return selected;
  }
}
