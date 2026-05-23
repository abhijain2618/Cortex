import { Cpu } from "lucide-react";

export const PanelTitle = () => {
  return (
    <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-shrink-0">
      <Cpu size={15} className="text-text-secondary" />

      <span className="text-[12px] font-semibold text-text-secondary tracking-widest uppercase">
        Retrieval Debug(T)
      </span>

      <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-green">
        <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
        Live-
      </div>
    </div>
  );
};
