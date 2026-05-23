import axios from "axios";
import { OLLAMA_URL } from "./ollama.constants";

export class OllamaQueryRewriteProvider {
  async rewrite(query: string) {
    const start = Date.now();

    const prompt = `
You are a query rewriting system for a RAG search engine.

Convert the user query into 3 search-optimized queries:

1. Semantic version (natural language)
2. Keyword version (for BM25)
3. Expanded version (broader context)

Return STRICT JSON only:

{
  "queries": ["...", "...", "..."],
  "primary": "...",
  "reason": "short explanation"
}

User Query:
${query}
`;

    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: "phi3:mini",
      prompt,
      stream: false,
    });

    let parsed;

    try {
      parsed = JSON.parse(res.data.response);
    } catch {
      parsed = {
        queries: [query],
        primary: query,
        reason: "fallback parse failure",
      };
    }

    return {
      originalQuery: query,
      rewrittenQueries: parsed.queries,
      selectedPrimaryQuery: parsed.primary,
      reasoning: parsed.reason,
      latencyMs: Date.now() - start,
    };
  }
}
