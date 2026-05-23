// import { useChatStore } from "@/app/store/chatStore";
// import { useChatHistoryStore } from "@/app/store/chatHistoryStore";

import { useChatHistoryStore } from "@/app/stores/chat-history-store";
import { useChatStore } from "@/app/stores/chat-store";

export async function sendChatMessage({
  sessionId,
  content,
  docIds,
}: {
  sessionId: string;
  content: string;
  docIds: string[];
}) {
  const store = useChatStore.getState();

  store.setIsStreaming(true);

  // -----------------------------
  // USER MESSAGE
  // -----------------------------
  const userMessage = {
    id: crypto.randomUUID(),
    role: "user" as const,
    content,
    createdAt: new Date().toISOString(),
  };

  store.addMessage(userMessage);

  // -----------------------------
  // ASSISTANT PLACEHOLDER
  // -----------------------------
  const assistantId = crypto.randomUUID();

  store.addMessage({
    id: assistantId,
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
  });

  // -----------------------------
  // SSE CALL
  // -----------------------------
  const res = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message: content,
      docIds,
    }),
  });

  if (!res.body) throw new Error("No stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }

      // TOKEN STREAM
      if (event.type === "token") {
        const state = useChatStore.getState();

        state.setMessages(
          state.messages.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + event.data }
              : m,
          ),
        );
      }

      // CHUNKS
      if (event.type === "chunk") {
        store.addChunks([event.data]);
      }

      // CITATIONS
      if (event.type === "citation") {
        store.setCitations(event.data);
      }

      // EVENTS
      if (event.type === "event") {
        store.addEvent(event.data);
      }
    }
  }

  // -----------------------------
  // FINALIZE
  // -----------------------------
  const finalMessage = useChatStore
    .getState()
    .messages.find((m) => m.id === assistantId);

  if (finalMessage) {
    useChatHistoryStore.getState().appendMessage(sessionId, finalMessage);
  }

  store.setIsStreaming(false);
  store.clearChunks();
  store.clearCitations();
}
