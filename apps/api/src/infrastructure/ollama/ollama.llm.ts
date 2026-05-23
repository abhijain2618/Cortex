import { streamText } from "ai";
import { ollama } from "ai-sdk-ollama";

export class OllamaLLMProvider {
  async stream(prompt: string, model: string = "phi3:mini") {
    const result = streamText({
      model: ollama(model),
      prompt,
    });

    return result;
  }
}
