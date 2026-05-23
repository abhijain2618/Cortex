"use client";

import Sidebar from "./components/SideBar/Sidebar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import DebugPanel from "./components/DebugPanel/DebugPanel";
import UploadModal from "./components/UploadModal";
import { useUIStore } from "./stores/ui-store";
import { useBootstrapSession } from "./hooks/useBootstrapSession";
import { useSessionStore } from "./stores/session-store";
import { useEffect } from "react";
import { useDocumentStore } from "./stores/document-store";

export default function Home() {
  useBootstrapSession();
  const uploadOpen = useUIStore((s) => s.uploadOpen);
  const setUploadOpen = useUIStore((s) => s.setUploadOpen);

  const debugOpen = useUIStore((s) => s.debugOpen);
  const toggleDebug = useUIStore((s) => s.toggleDebug);

  const activeSessionId = useSessionStore((s) => s.activeSessionId);

  const sessionsLoaded = useSessionStore((s) => s.sessions.length > 0);

  useEffect(() => {
    const store = useDocumentStore.getState();
    store.startPolling();

    return () => store.stopPolling();
  }, []);

  if (!activeSessionId || !sessionsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CHAT */}
      <ChatWindow
        debugOpen={debugOpen}
        onToggleDebug={toggleDebug}
        onOpenUpload={() => setUploadOpen(true)}
      />

      {/* DEBUG PANEL */}
      {debugOpen && <DebugPanel />}

      {/* UPLOAD MODAL */}
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
