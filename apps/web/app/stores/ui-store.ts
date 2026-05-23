"use client";

import { create } from "zustand";

interface UIStore {
  // -----------------------------
  // UPLOAD MODAL
  // -----------------------------
  uploadOpen: boolean;
  setUploadOpen: (value: boolean) => void;

  // -----------------------------
  // DEBUG PANEL
  // -----------------------------
  debugOpen: boolean;
  toggleDebug: () => void;
  setDebugOpen: (value: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // -----------------------------
  // UPLOAD
  // -----------------------------
  uploadOpen: false,

  setUploadOpen: (value) =>
    set({
      uploadOpen: value,
    }),

  // -----------------------------
  // DEBUG
  // -----------------------------
  debugOpen: true,

  toggleDebug: () =>
    set((state) => ({
      debugOpen: !state.debugOpen,
    })),

  setDebugOpen: (value) =>
    set({
      debugOpen: value,
    }),
}));
