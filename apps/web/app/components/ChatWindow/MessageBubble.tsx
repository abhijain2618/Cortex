import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UIMessage } from "ai";
import type { Citation } from "@/app/types";
import CitationChip from "./CitationChip";
import { cn } from "@/app/lib/utils";

// ─── Typing indicator ─────────────────────────────────────────────────────────
export function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-text-secondary dot-1" />
      <span className="w-1.5 h-1.5 rounded-full bg-text-secondary dot-2" />
      <span className="w-1.5 h-1.5 rounded-full bg-text-secondary dot-3" />
    </div>
  );
}

// ─── Individual message ───────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: UIMessage;
  isLoading?: boolean;
  citations?: Citation[];
}

export default function MessageBubble({
  message,
  isLoading,
  citations,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-[30px] h-[30px] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-semibold",
          isUser
            ? "bg-gradient-to-br from-accent to-purple-400 text-white text-[11px]"
            : "bg-accent/10 border border-accent/25 text-accent",
        )}
      >
        {isUser ? "JD" : "R"}
      </div>

      {/* Body */}
      <div
        className={cn("flex flex-col gap-1 max-w-[72%]", isUser && "items-end")}
      >
        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-2.5 rounded-xl text-[13.5px] leading-relaxed",
            isUser
              ? "bg-accent text-white rounded-br-[3px]"
              : "bg-raised border border-border text-text-primary rounded-tl-[3px]",
          )}
        >
          {isLoading && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="chat-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {isLoading && <TypingIndicator />}
            </div>
          )}
        </div>

        {/* Citations */}
        {!isUser && citations && citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {citations.map((c) => (
              <CitationChip key={c.id} citation={c} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-text-muted font-mono px-1">
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "now"}
        </span>
      </div>
    </div>
  );
}
