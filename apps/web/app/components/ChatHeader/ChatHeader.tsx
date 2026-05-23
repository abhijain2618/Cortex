"use client";
import { ModelSelector } from "./ModelSelector";
import { DebugToggle } from "../DebugPanel/DebugToggle";
import { ChatTitle } from "./ChatTitle";

interface ChatHeaderProps {
  title: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  debugOpen: boolean;
  onToggleDebug: () => void;
  documentCount: number;
  retrievedChunkCount: number;
}

export const ChatHeader = ({
  title,
  selectedModel,
  onModelChange,
  debugOpen,
  onToggleDebug,
  documentCount,
  retrievedChunkCount,
}: ChatHeaderProps) => {
  return (
    <div className="px-5 py-3 border-b border-border bg-surface flex items-center gap-3 flex-shrink-0">
      {/* Title + Stats */}{" "}
      <ChatTitle
        documentCount={documentCount}
        retrievedChunkCount={retrievedChunkCount}
        title={title}
      />
      {/* Spacer */}
      <div className="flex-1" />
      {/* Model Selector */}
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={onModelChange}
      />
      {/* Debug Toggle */}
      <DebugToggle debugOpen={debugOpen} onToggleDebug={onToggleDebug} />
    </div>
  );
};
