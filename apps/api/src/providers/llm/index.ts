import { LLMService } from "./llm.service";
import { OllamaLLMProvider } from "../../infrastructure/ollama/ollama.llm";

const provider = new OllamaLLMProvider();

export const llmService = new LLMService(provider);
