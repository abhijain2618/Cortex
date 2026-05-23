import { ChatService } from "./service";

const service = new ChatService();

export class ChatController {
  async ask(req: any, reply: any) {
    try {
      const { sessionId, messages, model, topK } = req.body;

      if (!sessionId) {
        return reply.status(400).send({
          error: "sessionId required",
        });
      }

      if (!messages?.length) {
        return reply.status(400).send({
          error: "messages required",
        });
      }

      // extract last user message (safer)
      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === "user");

      const query =
        lastUserMessage?.parts
          ?.filter((p: any) => p.type === "text")
          ?.map((p: any) => p.text)
          ?.join(" ") || "";

      if (!query.trim()) {
        return reply.status(400).send({
          error: "empty query",
        });
      }

      return await service.streamAnswer(sessionId, query, reply, model, topK);
    } catch (err: any) {
      console.error(err);

      if (!reply.raw.headersSent) {
        return reply.status(500).send({
          error: "chat failed",
        });
      }

      reply.raw.end();
    }
  }
}
