export class PromptBuilder {
  build(query: string, context: string) {
    return `
You are a RAG assistant with citation tracking.

RULES:
- Use ONLY the provided sources
- Every answer must be grounded in context
- If unsure, say: "I don't know based on the provided documents"
- Do NOT hallucinate

IMPORTANT:
When possible, refer to sources like:
(Source 1), (Source 2), etc.

CONTEXT WITH SOURCES:
${context}

QUESTION:
${query}

ANSWER:
`;
  }
}
