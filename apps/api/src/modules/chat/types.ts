export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  topK?: number;
  model?: string;
}

export interface ChatResponseChunk {
  text: string;
}
