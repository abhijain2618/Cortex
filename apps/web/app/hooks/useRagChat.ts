"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import type { ChatMessage, RetrievedChunk } from "@/app/types";
import { createChatTransport } from "@/app/lib/chat/create-chat-transport";
import { normalizeMessages } from "@/app/lib/chat/normalize-messages";
import { parseStreamParts } from "@/app/lib/chat/parse-stream-parts";
import { useChatStore } from "@/app/stores/chat-store";
import { RagEventType } from "../types/ragEvents.type";
import { useChatHistoryStore } from "@/app/stores/chat-history-store";

interface UseRagChatOptions {
  activeDocIds: string[];
  sessionId: string;
  topK?: number;
}

/* ───────────────────────────────────────────── */
/* chunk merge helper */
/* ───────────────────────────────────────────── */

function mergeChunks(
  prev: RetrievedChunk[],
  next: RetrievedChunk[],
): RetrievedChunk[] {
  const map = new Map<string, RetrievedChunk>();

  for (const c of prev) map.set(c.id, c);
  for (const c of next) map.set(c.id, c);

  return Array.from(map.values());
}

/* ───────────────────────────────────────────── */
/* Hook */
/* ───────────────────────────────────────────── */

export function useRagChat({
  activeDocIds,
  sessionId,
  topK = 5,
}: UseRagChatOptions) {
  /* ──────────────────────────────────────────── */
  /* local input */
  /* ──────────────────────────────────────────── */
  const [input, setInput] = useState("");

  /* ──────────────────────────────────────────── */
  /* store */
  /* ──────────────────────────────────────────── */
  const {
    selectedModel,
    setMessages,
    setChunks,
    setCitations,
    setMetadata,
    addNotification,
    addEvent,
    chunks,
    citations,
    metadata,
    notifications,
  } = useChatStore();

  /* ──────────────────────────────────────────── */
  /* event dedupe guard */
  /* ──────────────────────────────────────────── */
  //   const firedEvents = useRef<Set<string>>(new Set());

  const requestIdRef = useRef<string | null>(null);
  const firedEvents = useRef(new Set<string>());

  function emitEvent(type: RagEventType, meta?: any) {
    if (firedEvents.current.has(type)) return;

    firedEvents.current.add(type);

    addEvent({
      type,
      time: Date.now(),
      meta,
    });
  }

  /* ──────────────────────────────────────────── */
  /* AI SDK chat */
  /* ──────────────────────────────────────────── */
  const chat = useChat({
    transport: createChatTransport(),

    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi! I'm RAG Studio. Upload documents and ask me anything about them.",
          },
        ],
      },
    ],
  });

  const { messages: rawMessages, sendMessage, status, error } = chat;

  /* ──────────────────────────────────────────── */
  /* normalize messages */
  /* ──────────────────────────────────────────── */
  const normalizedMessages = useMemo(() => {
    return normalizeMessages(rawMessages);
  }, [rawMessages]);

  /* ──────────────────────────────────────────── */
  /* parse stream parts */
  /* ──────────────────────────────────────────── */
  const parsedStreamData = useMemo(() => {
    return parseStreamParts(rawMessages);
  }, [rawMessages]);

  /* ──────────────────────────────────────────── */
  /* sync messages */
  /* ──────────────────────────────────────────── */
  useEffect(() => {
    setMessages(normalizedMessages);
  }, [normalizedMessages, setMessages]);

  /* ──────────────────────────────────────────── */
  /* RAG timeline: START */
  /* ──────────────────────────────────────────── */
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!input.trim()) return;

    // 🔥 NEW REQUEST SESSION
    const requestId = crypto.randomUUID();
    requestIdRef.current = requestId;
    const inputProvided = input;

    firedEvents.current.clear();

    emitEvent("retrieval_started", { requestId });
    setInput("");
    await sendMessage(
      { text: inputProvided },
      {
        body: {
          sessionId,
          model: selectedModel,
          docIds: activeDocIds,
          topK,
        },
      },
    );
  }

  /* ──────────────────────────────────────────── */
  /* RAG timeline: STREAM EVENTS */
  /* ──────────────────────────────────────────── */
  useEffect(() => {
    if (parsedStreamData.chunks?.length) {
      setChunks(parsedStreamData.chunks);

      emitEvent("chunks_received", {
        count: parsedStreamData.chunks.length,
      });
    }

    if (parsedStreamData.citations?.length) {
      setCitations(parsedStreamData.citations);

      emitEvent("citations_ready", {
        count: parsedStreamData.citations.length,
      });
    }

    if (parsedStreamData.metadata) {
      setMetadata(parsedStreamData.metadata);
    }

    if (parsedStreamData.notification) {
      addNotification(parsedStreamData.notification);
    }
  }, [parsedStreamData]);

  /* ──────────────────────────────────────────── */
  /* LLM streaming state */
  /* ──────────────────────────────────────────── */
  useEffect(() => {
    if (status === "streaming" && requestIdRef.current) {
      emitEvent("llm_streaming", {
        requestId: requestIdRef.current,
      });
    }
  }, [status]);

  /* ──────────────────────────────────────────── */
  /* completion */
  /* ──────────────────────────────────────────── */
  const prevStatus = useRef(status);

  useEffect(() => {
    const wasStreaming = prevStatus.current === "streaming";
    const isReady = status === "ready";

    if (wasStreaming && isReady && requestIdRef.current) {
      emitEvent("done", {
        requestId: requestIdRef.current,
      });
    }

    prevStatus.current = status;
  }, [status]);

  /* ──────────────────────────────────────────── */
  /* derived state */
  /* ──────────────────────────────────────────── */
  const isLoading = status === "submitted" || status === "streaming";

  const activeChatTitle =
    normalizedMessages.length > 1
      ? (
          normalizedMessages.find((m: any) => m.role === "user")?.content ??
          "New conversation"
        ).slice(0, 40) + "…"
      : "New conversation";

  /* ──────────────────────────────────────────── */
  /* public API */
  /* ──────────────────────────────────────────── */
  return {
    input,
    setInput,
    messages: normalizedMessages,
    status,
    isLoading,
    error,
    handleSubmit,
    activeChatTitle,
    debug: {
      chunks,
      citations,
      metadata,
      notifications,
    },
  };
}
