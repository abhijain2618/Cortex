export const SideBarTitle = () => {
  return (
    <div className="px-4 py-4 border-b border-border flex items-center gap-2.5">
      <span className="w-7 h-7 bg-accent rounded-[6px] flex items-center justify-center text-white font-mono text-xs font-semibold flex-shrink-0">
        R
      </span>
      <span className="text-[13px] font-semibold tracking-wide">
        RAG Studio
      </span>
      <span className="ml-auto text-[9px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">
        v2.1
      </span>
    </div>
  );
};
