import { cn, formatTime } from "@/app/lib/utils";
import { ChatSession } from "@/app/types";
import { MessageSquare } from "lucide-react";

interface ChatItemProps {
  session: ChatSession;
  active: boolean;
  onClick: () => void;
}
export const ChatItem = ({ session, active, onClick }: ChatItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-2 px-2 py-2 rounded text-left border transition-colors",
        active
          ? "bg-active border-border-mid"
          : "border-transparent hover:bg-hover",
      )}
    >
      <MessageSquare
        size={14}
        className="text-text-secondary mt-0.5 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{session.title}</p>
        <p className="text-[11px] text-text-secondary truncate mt-0.5">
          {session.preview}
        </p>
      </div>
      <span className="text-[10px] text-text-muted font-mono flex-shrink-0 mt-0.5">
        {formatTime(session.createdAt)}
      </span>
    </button>
  );
};
