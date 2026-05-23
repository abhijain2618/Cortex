"use client";

import { useEffect, useRef } from "react";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import { ChatMessage, Citation } from "@/app/types";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: Error | null;
  citations?: Citation[];
}

export default function MessageList({
  messages,
  isLoading,
  error,
  citations,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages / loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const lastIndex = messages.length - 1;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
      {/* Messages */}
      {messages.map((msg, i) => {
        const isLastAssistant = msg.role === "assistant" && i === lastIndex;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLoading={isLoading && isLastAssistant}
            citations={citations}
          />
        );
      })}

      {/* Typing indicator */}
      {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
        <div className="flex gap-3">
          <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 bg-accent/10 border border-accent/25 text-accent flex items-center justify-center text-xs font-semibold">
            R
          </div>

          <div className="bg-raised border border-border rounded-xl rounded-tl-[3px] px-4 py-2.5">
            <TypingIndicator />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 px-2">{error.message}</div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
