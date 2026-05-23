"use client";

import { ChatHeader } from "../ChatHeader/ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import { useRagChat } from "@/app/hooks/useRagChat";

import { useSessionStore } from "@/app/stores/session-store";
import { useDocumentStore } from "@/app/stores/document-store";

interface ChatWindowProps {
  debugOpen: boolean;
  onToggleDebug: () => void;
  onOpenUpload: () => void;
}

export default function ChatWindow({
  debugOpen,
  onToggleDebug,
  onOpenUpload,
}: ChatWindowProps) {
  // --------------------------------------------------
  // SESSION
  // --------------------------------------------------
  const activeSessionId = useSessionStore((s) => s.activeSessionId);

  const sessions = useSessionStore((s) => s.sessions);

  const removeDocFromSession = useSessionStore((s) => s.removeDocFromSession);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // --------------------------------------------------
  // ACTIVE DOC IDS (SOURCE OF TRUTH)
  // --------------------------------------------------
  const activeDocIds = activeSession?.docIds ?? [];

  // --------------------------------------------------
  // DOCUMENT MAP
  // --------------------------------------------------
  const documentsMap = useDocumentStore((s) => s.documents);

  // --------------------------------------------------
  // HYDRATED DOCS FOR UI ONLY
  // --------------------------------------------------
  const activeDocs = activeDocIds
    .map((id) => documentsMap[id])
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  // --------------------------------------------------
  // CHAT ENGINE
  // --------------------------------------------------
  const chat = useRagChat({
    activeDocIds,
    sessionId: activeSessionId ?? "",
    topK: 5,
  });

  const {
    input,
    setInput,
    messages,
    isLoading,
    error,
    handleSubmit,
    activeChatTitle,
    debug,
  } = chat;

  // --------------------------------------------------
  // REMOVE DOCUMENT
  // --------------------------------------------------
  const handleRemoveDoc = (docId: string) => {
    if (!activeSessionId) return;

    removeDocFromSession(activeSessionId, docId);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-base">
      {/* HEADER */}
      <ChatHeader
        title={activeChatTitle}
        selectedModel="phi3:mini"
        onModelChange={() => {}}
        debugOpen={debugOpen}
        onToggleDebug={onToggleDebug}
        documentCount={activeDocs.length}
        retrievedChunkCount={debug.chunks.length}
      />

      {/* MESSAGES */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        citations={debug.citations}
      />

      {/* INPUT */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        activeDocs={activeDocs}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onRemoveDoc={handleRemoveDoc}
        onAttach={onOpenUpload}
      />
    </main>
  );
}
