import { groupByDate } from "@/app/lib/utils";
import { ChatSession } from "@/app/types";
import { ChatItem } from "./ChatItem";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeChatId: string;
  onChatSelect: (id: string) => void;
}

export const ChatHistory = ({
  sessions,
  activeChatId,
  onChatSelect,
}: ChatHistoryProps) => {
  const groups = groupByDate(sessions);

  return (
    <>
      <div className="px-4 py-1.5 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-medium tracking-widest text-text-muted uppercase">
          History
        </span>
        <span className="text-[10px] text-text-secondary bg-hover rounded-full px-1.5 py-px">
          {sessions.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {Object.entries(groups).map(([label, indices]) => (
          <div key={label}>
            <p className="px-2 py-1 text-[10px] text-text-muted tracking-widest uppercase">
              {label}
            </p>
            {indices.map(
              (i) =>
                sessions[i] && (
                  <ChatItem
                    key={sessions[i].id}
                    session={sessions[i]}
                    active={sessions[i].id === activeChatId}
                    onClick={() => onChatSelect(sessions[i].id)}
                  />
                ),
            )}
          </div>
        ))}
      </div>
    </>
  );
};
