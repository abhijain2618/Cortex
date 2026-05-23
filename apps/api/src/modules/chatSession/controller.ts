import { ChatSessionService } from "./service";
import { ChatSessionRepository } from "./repository";

const service = new ChatSessionService(new ChatSessionRepository());

export class ChatSessionController {
  async create(req: any, reply: any) {
    const { title } = req.body;

    const session = await service.createSession(title || "New Chat");

    return reply.send(session);
  }

  async list(req: any, reply: any) {
    const sessions = await service.listSessions();
    return reply.send(sessions);
  }

  async get(req: any, reply: any) {
    const { id } = req.params;

    const data = await service.getSession(id);
    return reply.send(data);
  }
}
