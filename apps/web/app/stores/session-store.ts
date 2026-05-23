"use client";

import { create } from "zustand";
import { ChatSession } from "../types";
import { mapSession } from "../lib/mappers/sessionMapper";

interface SessionStore {
  sessions: ChatSession[];
  activeSessionId: string | null;

  // core state actions
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (id: string) => void;

  // backend integration
  fetchSessions: () => Promise<void>;
  createSession: (title?: string) => Promise<ChatSession>;

  // grounding (RAG core)
  addDocToSession: (sessionId: string, docId: string) => void;
  removeDocFromSession: (sessionId: string, docId: string) => void;
  setSessionDocs: (sessionId: string, docIds: string[]) => void;

  // selectors
  getActiveSession: () => ChatSession | undefined;
  getSessionById: (id: string) => ChatSession | undefined;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  // -----------------------------
  // CORE STATE
  // -----------------------------

  setSessions: (sessions) => set({ sessions }),

  setActiveSession: (id) =>
    set({
      activeSessionId: id,
    }),

  // -----------------------------
  // BACKEND INTEGRATION
  // -----------------------------

  fetchSessions: async () => {
    try {
      const res = await fetch("http://localhost:3001/chat/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");

      const data = await res.json();

      console.log("raw response:", data);

      const mapped = data.map(mapSession);

      console.log("mapped sessions:", mapped);

      set({ sessions: mapped });

      const current = get().activeSessionId;

      if (!current && mapped.length > 0) {
        set({ activeSessionId: mapped[0].id });
      }
    } catch (err) {
      console.error("fetchSessions error:", err);
    }
  },

  createSession: async (title) => {
    try {
      const res = await fetch("http://localhost:3001/chat/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const raw = await res.json();

      const newSession = mapSession(raw);

      set((state) => ({
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
      }));

      return newSession;
    } catch (err) {
      console.error("createSession error:", err);
      throw err;
    }
  },

  // -----------------------------
  // GROUNDING LOGIC (RAG CORE)
  // -----------------------------

  setSessionDocs: (sessionId, docIds) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, docIds: Array.from(new Set(docIds)) } : s,
      ),
    })),

  addDocToSession: (sessionId, docId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              docIds: Array.from(new Set([...(s.docIds ?? []), docId])),
            }
          : s,
      ),
    })),

  removeDocFromSession: (sessionId, docId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              docIds: (s.docIds ?? []).filter((id) => id !== docId),
            }
          : s,
      ),
    })),

  // -----------------------------
  // SELECTORS
  // -----------------------------

  getActiveSession: () =>
    get().sessions.find((s) => s.id === get().activeSessionId),

  getSessionById: (id) => get().sessions.find((s) => s.id === id),
}));
