import { ollama } from "ai-sdk-ollama";
import { generateText } from "ai";

export class Reranker {
  async rerank(query: string, chunks: any[]) {
    if (!chunks.length) return [];

    const prompt = `
You are a search reranking system.

Task:
Given a query and multiple documents, rank them by relevance.

Return ONLY a JSON array of indexes in order of best to worst.

Query:
${query}

Documents:
${chunks
  .map(
    (c, i) => `
[${i}]
${c.content}
`,
  )
  .join("\n")}

Return format:
[3,1,0,2,...]
`;

    const result = await generateText({
      model: ollama("phi3:mini"),
      prompt,
    });

    try {
      const order = JSON.parse(result.text.trim());

      return order.map((i: number) => chunks[i]).filter(Boolean);
    } catch (e) {
      // fallback → no reranking
      return chunks;
    }
  }
}
