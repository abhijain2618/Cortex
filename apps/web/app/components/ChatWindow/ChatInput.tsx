"use client";

import { useRef, useCallback } from "react";
import { Paperclip, Mic, ArrowUp, X, FileText } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { RAGDocument } from "@/app/types";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  activeDocs: RAGDocument[];
  onInputChange?: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRemoveDoc: (id: string) => void;
  onAttach: () => void;
}

export default function ChatInput({
  input,
  isLoading,
  activeDocs,
  onInputChange,
  onSubmit,
  onRemoveDoc,
  onAttach,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isLoading && input.trim()) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [isLoading, input, onSubmit],
  );

  return (
    <div className="px-5 py-4 border-t border-border bg-surface flex-shrink-0">
      {/* Active doc chips */}
      {activeDocs?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-1.5 bg-raised border border-border rounded-full pl-2 pr-2.5 py-0.5 text-[11px] text-text-secondary"
            >
              <FileText size={11} className="text-red flex-shrink-0" />
              <span className="truncate max-w-[140px]">{doc.name}</span>
              <button
                onClick={() => onRemoveDoc(doc.id)}
                className="ml-0.5 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="flex items-end gap-2.5 bg-raised border border-border-mid rounded-lg px-3 py-2.5 focus-within:border-accent transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          disabled={isLoading}
          placeholder="Ask anything about your documents…"
          className="flex-1 bg-transparent border-none outline-none resize-none text-text-primary placeholder-text-muted text-[13.5px] leading-relaxed min-h-[44px] max-h-[120px] font-display"
          onChange={(e) => {
            onInputChange?.(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onAttach}
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-hover hover:text-text-primary hover:border-border-mid transition-colors"
            title="Attach document"
          >
            <Paperclip size={15} />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-hover hover:text-text-primary hover:border-border-mid transition-colors"
            title="Voice input"
          >
            <Mic size={15} />
          </button>
          <button
            type="button"
            disabled={isLoading || !input.trim()}
            onClick={(e) => onSubmit(e)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded bg-accent text-white transition-all",
              isLoading || !input.trim()
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-85 active:scale-95",
            )}
            title="Send"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex items-center gap-2.5 mt-2 text-[11px] text-text-muted">
        <kbd className="bg-raised border border-border rounded px-1.5 py-px font-mono text-[10px]">
          Enter
        </kbd>
        <span>to send</span>
        <kbd className="bg-raised border border-border rounded px-1.5 py-px font-mono text-[10px]">
          Shift+Enter
        </kbd>
        <span>for new line</span>
        <span className="ml-auto flex items-center gap-1 text-green">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          Grounded · {activeDocs?.length} doc
          {activeDocs?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
