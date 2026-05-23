import axios from "axios";
import { CompressionProvider } from "../../modules/compression/compression.provider";
import { OLLAMA_URL } from "./ollama.constants";

export class OllamaCompressionProvider implements CompressionProvider {
  async compress(query: string, text: string): Promise<string> {
    const prompt = `
You are a text compression system.

Task:
Extract ONLY the parts of the text relevant to answering the question.

Rules:
- Keep factual information only
- Remove filler, repetition, irrelevant sentences
- Do NOT add new information
- Keep it concise

Question:
${query}

Text:
${text}

Return:
Compressed text only
`;

    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: "phi3:mini",
      prompt,
      stream: false,
    });

    return res.data.response;
  }
}
