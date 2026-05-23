"use client";

import { Settings, ChevronRight } from "lucide-react";
import { SideBarTitle } from "./SideBarTitle";
import { Documents } from "./Documents/Documents";
import { ChatHistory } from "./ChatHistory/ChatHistory";
import { useDocumentStore } from "@/app/stores/document-store";
import { useSessionStore } from "@/app/stores/session-store";
import { useUIStore } from "@/app/stores/ui-store";
import { useChatHistoryStore } from "@/app/stores/chat-history-store";

export default function Sidebar() {
  // -----------------------------
  // DOCUMENTS (global RAG assets)
  // -----------------------------
  const documentsMap = useDocumentStore((s) => s.documents);
  const documents = Object.values(documentsMap);

  // -----------------------------
  // SESSIONS (chat + grounding)
  // -----------------------------
  const sessions = useSessionStore((s) => s.sessions);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const setActiveSession = useSessionStore((s) => s.setActiveSession);

  const fetchSessionHistory = useChatHistoryStore((s) => s.fetchSessionHistory);

  const handleChatSelect = async (id: string) => {
    setActiveSession(id);

    await fetchSessionHistory(id);
  };

  // -----------------------------
  // UI STATE
  // -----------------------------
  const setUploadOpen = useUIStore((s) => s.setUploadOpen);

  const sessionStore = useSessionStore();
  const activeSession = sessionStore.getActiveSession();

  const activeDocIds = activeSession?.docIds ?? [];
  const toggleDoc = (docId: string) => {
    if (!activeSessionId) return;

    const isActive = activeDocIds.includes(docId);

    if (isActive) {
      sessionStore.removeDocFromSession(activeSessionId, docId);
    } else {
      sessionStore.addDocToSession(activeSessionId, docId);
    }
  };

  return (
    <aside className="w-60 min-w-[240px] bg-surface border-r border-border flex flex-col h-screen overflow-hidden">
      {/* Logo */}
      <SideBarTitle />

      {/* Documents section (RAG ingestion layer) */}
      <Documents
        docs={documents}
        activeDocIds={activeDocIds}
        onUploadClick={() => setUploadOpen(true)}
        onToggleDoc={toggleDoc}
      />

      <div className="my-2 h-px bg-border" />

      {/* Chat history (sessions + grounding context) */}
      <ChatHistory
        sessions={sessions}
        activeChatId={activeSessionId ?? ""}
        onChatSelect={handleChatSelect}
      />

      {/* Footer */}
      <div className="border-t border-border p-2">
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-[12px] font-medium text-text-secondary hover:bg-hover hover:text-text-primary transition-colors">
          <Settings size={15} />
          Settings
        </button>

        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-[12px] font-medium text-text-secondary hover:bg-hover hover:text-text-primary transition-colors">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
            JD
          </span>
          John Doe
          <ChevronRight size={13} className="ml-auto opacity-50" />
        </button>
      </div>
    </aside>
  );
}
