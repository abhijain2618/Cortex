import axios from "axios";
import { OLLAMA_URL } from "./ollama.constants";
import { EmbeddingProvider } from "../../providers/embeddings/embedding.provider";

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  async embed(text: string): Promise<number[]> {
    const res = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
      model: "nomic-embed-text",
      prompt: text,
    });

    return res.data.embedding;
  }
}
