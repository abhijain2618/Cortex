export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  documentIds: string[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
