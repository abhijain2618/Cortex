import { useChatStore } from "@/app/stores/chat-store";
import { Cpu } from "lucide-react";

export const RAGTimeline = () => {
  const events = useChatStore((s) => s.events);
  const startTime = events[0]?.time ?? Date.now();

  return (
    <section>
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-text-muted mb-2">
        <Cpu size={13} />
        RAG Timeline--
      </div>

      <div className="flex flex-col gap-2">
        {events.length === 0 ? (
          <div className="text-[11px] text-text-muted">Waiting for events…</div>
        ) : (
          events.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] bg-raised border border-border rounded px-2 py-1"
            >
              <span className="font-mono text-text-secondary">{e.type}</span>

              <span className="text-[10px] text-text-muted">
                +{e.time - startTime}ms
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
