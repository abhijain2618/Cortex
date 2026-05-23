import { CompressionProvider } from "./compression.provider";

export class CompressionService {
  constructor(private provider: CompressionProvider) {}

  async compress(query: string, text: string) {
    return this.provider.compress(query, text);
  }
}
