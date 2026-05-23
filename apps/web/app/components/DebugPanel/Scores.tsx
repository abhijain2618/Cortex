/* ──────────────────────────────────────────────────────────────── */
/* Scores */
/* ──────────────────────────────────────────────────────────────── */

import { RetrievedChunk } from "@/app/types";
import { cn, scoreBgColor, scoreColor, scoreToWidth } from "@/app/lib/utils";
import { BarChart2 } from "lucide-react";

interface ScoresProps {
  sortedChunks: RetrievedChunk[];
}
export const Scores = ({ sortedChunks }: ScoresProps) => {
  return (
    <section>
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-text-muted mb-2">
        <BarChart2 size={13} />
        Similarity scores
      </div>

      <div className="flex flex-col gap-2">
        {sortedChunks.map((chunk) => {
          const score = chunk.score ?? 0;
          return (
            <div key={chunk.id} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted w-16 flex-shrink-0">
                {`chunk ${chunk.rank ?? "-"}`}
              </span>

              <div className="flex-1 h-1 bg-base rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", scoreBgColor(score))}
                  style={{ width: scoreToWidth(score) }}
                />
              </div>

              <span
                className={cn(
                  "text-[10px] font-mono font-medium w-10 text-right",
                  scoreColor(score),
                )}
              >
                {score.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
