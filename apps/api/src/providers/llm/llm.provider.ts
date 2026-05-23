import { StreamTextResult } from "ai";

export interface LLMProvider {
  stream(prompt: string, model?: string): Promise<StreamTextResult<any, any>>;
}
