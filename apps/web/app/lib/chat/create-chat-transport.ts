import { DefaultChatTransport } from "ai";

interface CreateChatTransportOptions {
  api?: string;
}

export function createChatTransport({ api }: CreateChatTransportOptions = {}) {
  return new DefaultChatTransport({
    api:
      api ?? process.env.NEXT_PUBLIC_CHAT_API ?? "http://localhost:3001/chat",
  });
}
