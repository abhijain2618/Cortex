import { LLMProvider } from "./llm.provider";

export class LLMService {
  constructor(private provider: LLMProvider) {}

  stream(prompt: string, model?: string) {
    return this.provider.stream(prompt, model);
  }
}
