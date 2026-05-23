// import { ChevronDown } from "lucide-react";

// interface ModelSelectorProps {
//   selectedModel: string;
//   setSelectedModel: (model: string) => void;
// }

// export const ModelSelector = ({
//   selectedModel,
//   setSelectedModel,
// }: ModelSelectorProps) => {
//   return (
//     <>
//       <button
//         onClick={() => setSelectedModel("phi3:mini")}
//         className="ml-auto flex items-center gap-1.5 bg-raised border border-border rounded px-2.5 py-1 text-[11px] font-mono text-text-secondary hover:bg-hover transition-colors"
//       >
//         <span
//           className={`w-1.5 h-1.5 rounded-full ${selectedModel === "phi3:mini" ? " bg-green" : ""}`}
//         />
//         phi3:mini
//         <ChevronDown size={12} />
//       </button>

//       <button
//         onClick={() => setSelectedModel("gpt-3.5-turbo")}
//         className="ml-auto flex items-center gap-1.5 bg-raised border border-border rounded px-2.5 py-1 text-[11px] font-mono text-text-secondary hover:bg-hover transition-colors"
//       >
//         <span
//           className={`w-1.5 h-1.5 rounded-full ${selectedModel === "gpt-3.5-turbo" ? " bg-green" : ""}`}
//         />
//         gpt-3.5-turbo
//         <ChevronDown size={12} />
//       </button>
//     </>
//   );
// };

import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const ModelSelector = ({
  selectedModel,
  setSelectedModel,
}: ModelSelectorProps) => {
  return (
    <div className="ml-auto relative max-w-xs">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full appearance-none bg-raised border border-border rounded px-2.5 py-1 text-[11px] font-mono text-text-secondary hover:bg-hover transition-colors pr-8"
      >
        <option value="phi3:mini">phi3:mini</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <ChevronDown size={12} />
      </span>
    </div>
  );
};
