import { CompressionService } from "./compression.service";
import { OllamaCompressionProvider } from "../../infrastructure/ollama/ollama.compression";

const provider = new OllamaCompressionProvider();

export const compressionService = new CompressionService(provider);
