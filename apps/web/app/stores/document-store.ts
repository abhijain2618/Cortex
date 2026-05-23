"use client";

import { create } from "zustand";
import { RAGDocument, DocType } from "../types";

type DocumentMap = Record<string, RAGDocument>;

interface DocumentStore {
  documents: DocumentMap;

  setDocuments: (docs: RAGDocument[]) => void;
  addDocument: (doc: RAGDocument) => void;
  updateDocument: (id: string, patch: Partial<RAGDocument>) => void;
  removeDocument: (id: string) => void;

  getAllDocuments: () => RAGDocument[];

  startPolling: () => void;
  stopPolling: () => void;
}

let interval: NodeJS.Timeout | null = null;

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: {},

  setDocuments: (docs) =>
    set({
      documents: Object.fromEntries(docs.map((d) => [d.id, d])),
    }),

  addDocument: (doc) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [doc.id]: doc,
      },
    })),

  updateDocument: (id, patch) =>
    set((state) => {
      const existing = state.documents[id];
      if (!existing) return state;

      return {
        documents: {
          ...state.documents,
          [id]: { ...existing, ...patch },
        },
      };
    }),

  removeDocument: (id) =>
    set((state) => {
      const next = { ...state.documents };
      delete next[id];
      return { documents: next };
    }),

  getAllDocuments: () => Object.values(get().documents),

  // -----------------------------
  // POLLING (CRITICAL FOR RAG)
  // -----------------------------
  startPolling: () => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("http://localhost:3001/documents");
        const json = await res.json();

        const docs: RAGDocument[] = json.documents;

        set((state) => {
          const next = { ...state.documents };

          for (const doc of docs) {
            next[doc.id] = {
              ...state.documents[doc.id],
              ...doc,
            };
          }

          return { documents: next };
        });
      } catch (e) {
        console.error("Polling failed", e);
      }
    };

    fetchDocs();

    if (interval) return;

    interval = setInterval(fetchDocs, 3000);
  },

  stopPolling: () => {
    if (interval) clearInterval(interval);
    interval = null;
  },
}));
