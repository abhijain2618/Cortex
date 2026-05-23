"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/app/types";

type ChatHistoryMap = Record<string, ChatMessage[]>;

interface ChatHistoryStore {
  history: ChatHistoryMap;

  // core
  setSessionHistory: (sessionId: string, messages: ChatMessage[]) => void;
  appendMessage: (sessionId: string, message: ChatMessage) => void;
  clearSessionHistory: (sessionId: string) => void;

  // sync helpers (important for SSE integration later)
  mergeMessages: (sessionId: string, messages: ChatMessage[]) => void;

  fetchSessionHistory: (sessionId: string) => Promise<void>;

  // selectors
  getSessionMessages: (sessionId: string) => ChatMessage[];
}

export const useChatHistoryStore = create<ChatHistoryStore>((set, get) => ({
  history: {},

  // -----------------------------
  // SET FULL SESSION HISTORY
  // -----------------------------
  setSessionHistory: (sessionId, messages) =>
    set((state) => ({
      history: {
        ...state.history,
        [sessionId]: messages,
      },
    })),

  // -----------------------------
  // APPEND SINGLE MESSAGE
  // -----------------------------
  appendMessage: (sessionId, message) =>
    set((state) => {
      const existing = state.history[sessionId] || [];

      return {
        history: {
          ...state.history,
          [sessionId]: [...existing, message],
        },
      };
    }),

  // -----------------------------
  // CLEAR SESSION
  // -----------------------------
  clearSessionHistory: (sessionId) =>
    set((state) => ({
      history: {
        ...state.history,
        [sessionId]: [],
      },
    })),

  // -----------------------------
  // MERGE (USEFUL FOR SSE FINALIZATION)
  // -----------------------------
  mergeMessages: (sessionId, messages) =>
    set((state) => {
      const existing = state.history[sessionId] || [];

      // simple dedupe by id (important for SSE replay safety)
      const map = new Map<string, ChatMessage>();

      [...existing, ...messages].forEach((m) => {
        map.set(m.id, m);
      });

      return {
        history: {
          ...state.history,
          [sessionId]: Array.from(map.values()),
        },
      };
    }),

  // -----------------------------
  // SELECTOR
  // -----------------------------
  getSessionMessages: (sessionId) => get().history[sessionId] || [],

  fetchSessionHistory: async (sessionId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/chat/sessions/${sessionId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch session history");
      }

      const data = await res.json();

      // assuming backend returns:
      // {
      //   id,
      //   messages: [...]
      // }

      set((state) => ({
        history: {
          ...state.history,
          [sessionId]: data.messages ?? [],
        },
      }));
    } catch (err) {
      console.error("fetchSessionHistory error:", err);
    }
  },
}));
