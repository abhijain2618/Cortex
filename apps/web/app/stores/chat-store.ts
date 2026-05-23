"use client";

import { create } from "zustand";

import type {
  ChatMessage,
  Citation,
  RetrievedChunk,
  SourceMetadata,
  StreamNotification,
  RagEvent,
} from "@/app/types";

interface ChatStore {
  // -----------------------------
  // CHAT
  // -----------------------------
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // -----------------------------
  // MODEL
  // -----------------------------
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // -----------------------------
  // STREAMING
  // -----------------------------
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;

  // -----------------------------
  // RAG DATA
  // -----------------------------
  chunks: RetrievedChunk[];
  setChunks: (chunks: RetrievedChunk[]) => void;
  addChunks: (chunks: RetrievedChunk[]) => void;
  clearChunks: () => void;

  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
  clearCitations: () => void;

  metadata?: SourceMetadata;
  setMetadata: (metadata?: SourceMetadata) => void;

  // -----------------------------
  // EVENTS / NOTIFICATIONS
  // -----------------------------
  notifications: StreamNotification[];
  addNotification: (notification: StreamNotification) => void;
  clearNotifications: () => void;

  events: RagEvent[];
  addEvent: (event: RagEvent) => void;
  clearEvents: () => void;

  // -----------------------------
  // RESET
  // -----------------------------
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // -----------------------------
  // CHAT
  // -----------------------------
  messages: [],

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),

  // -----------------------------
  // MODEL
  // -----------------------------
  selectedModel: "phi3:mini",

  setSelectedModel: (model) =>
    set({
      selectedModel: model,
    }),

  // -----------------------------
  // STREAMING
  // -----------------------------
  isStreaming: false,

  setIsStreaming: (value) =>
    set({
      isStreaming: value,
    }),

  // -----------------------------
  // CHUNKS
  // -----------------------------
  chunks: [],

  setChunks: (chunks) =>
    set({
      chunks,
    }),

  addChunks: (chunks) =>
    set((state) => ({
      chunks: [...state.chunks, ...chunks],
    })),

  clearChunks: () =>
    set({
      chunks: [],
    }),

  // -----------------------------
  // CITATIONS
  // -----------------------------
  citations: [],

  setCitations: (citations) =>
    set({
      citations,
    }),

  clearCitations: () =>
    set({
      citations: [],
    }),

  // -----------------------------
  // METADATA
  // -----------------------------
  metadata: undefined,

  setMetadata: (metadata) =>
    set({
      metadata,
    }),

  // -----------------------------
  // NOTIFICATIONS
  // -----------------------------
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),

  // -----------------------------
  // EVENTS
  // -----------------------------
  events: [],

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  clearEvents: () =>
    set({
      events: [],
    }),

  // -----------------------------
  // RESET
  // -----------------------------
  resetChat: () =>
    set({
      messages: [],
      chunks: [],
      citations: [],
      metadata: undefined,
      notifications: [],
      events: [],
      isStreaming: false,
    }),
}));
