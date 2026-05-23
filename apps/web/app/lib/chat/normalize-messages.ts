import type { UIMessage } from "ai";

import type { ChatMessage, ChatRole } from "./types";

export function normalizeMessages(
messages: UIMessage[]
): ChatMessage[] {
return messages.map((message) => ({
id: message.id,

role: message.role as ChatRole,

content: extractTextContent(message),

}));
}

function extractTextContent(message: UIMessage): string {
if (!message.parts?.length) {
return "";
}

return message.parts
.filter((part) => part.type === "text")
.map((part) => {
if ("text" in part) {
return part.text;
}

  return "";
})
.join("");

}
