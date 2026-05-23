import { OllamaReranker } from "../../infrastructure/ollama/ollama.reranker";

export class RerankerService {
  private provider = new OllamaReranker();

  async rerank(query: string, chunks: any[], model = "phi3:mini") {
    return this.provider.rerank(query, chunks, model);
  }
}
