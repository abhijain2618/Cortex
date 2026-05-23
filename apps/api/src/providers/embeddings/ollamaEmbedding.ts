import { OLLAMA_URL } from "../../infrastructure/ollama/ollama.constants";
import axios from "axios";

export async function getEmbedding(text: string) {
  const res = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
    model: "nomic-embed-text",
    prompt: text,
  });

  return res.data.embedding;
}
