import { QueryRewriteService } from "./queryRewrite.service";
import { OllamaQueryRewriteProvider } from "../../infrastructure/ollama/ollama.queryRewrite";

const provider = new OllamaQueryRewriteProvider();

export const queryRewriteService = new QueryRewriteService(provider);
