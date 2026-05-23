import axios from "axios";
import { OLLAMA_URL } from "./ollama.constants";

export class OllamaReranker {
  async rerank(query: string, chunks: any[], model = "phi3:mini") {
    const prompt = `
You are a reranking system for a search engine.

Given a user query and candidate passages,
score each passage from 0 to 1 based on relevance.

Return STRICT JSON only:

{
  "results": [
    { "id": "...", "score": 0.0 }
  ]
}

Query:
${query}

Passages:
${chunks
  .map(
    (c, i) => `
ID: ${c.chunk_id}
Content: ${c.content}
`,
  )
  .join("\n")}
`;

    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: model,
      prompt,
      stream: false,
    });

    let parsed;

    try {
      parsed = JSON.parse(res.data.response);
    } catch {
      // fallback → keep original order
      return chunks;
    }

    const scoreMap = new Map(parsed.results.map((r: any) => [r.id, r.score]));

    return chunks
      .map((c) => ({
        ...c,
        rerankScore: scoreMap.get(c.chunk_id) ?? 0,
      }))
      .sort((a, b) => b.rerankScore - a.rerankScore);
  }
}
