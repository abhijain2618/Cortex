import { EmbeddingService } from "./embedding.service";
import { OllamaEmbeddingProvider } from "../../infrastructure/ollama/ollama.embedding";

const provider = new OllamaEmbeddingProvider();

export const embeddingService = new EmbeddingService(provider);
