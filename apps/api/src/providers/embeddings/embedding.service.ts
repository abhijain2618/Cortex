import { EmbeddingProvider } from "./embedding.provider";

export class EmbeddingService {
  constructor(private provider: EmbeddingProvider) {}

  async embed(text: string): Promise<number[]> {
    return this.provider.embed(text);
  }
}
