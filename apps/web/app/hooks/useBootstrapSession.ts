"use client";

import { useEffect, useRef } from "react";

import { useSessionStore } from "@/app/stores/session-store";

export function useBootstrapSession() {
  const initialized = useRef(false);

  const activeSessionId = useSessionStore((s) => s.activeSessionId);

  const createSession = useSessionStore((s) => s.createSession);

  const fetchSessions = useSessionStore((s) => s.fetchSessions);

  useEffect(() => {
    // Prevent React StrictMode double-run
    if (initialized.current) return;

    // Already have active session
    if (activeSessionId) return;

    initialized.current = true;

    async function bootstrap() {
      try {
        await fetchSessions();
        console.log("Fetched All Sessions");
        await createSession();
      } catch (err) {
        console.error("Failed to bootstrap session:", err);
      }
    }

    bootstrap();
  }, [activeSessionId, createSession]);
}
