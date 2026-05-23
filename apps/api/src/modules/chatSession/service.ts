import { ChatSessionRepository } from "./repository";

export class ChatSessionService {
  constructor(private repo: ChatSessionRepository) {}

  async createSession(title: string) {
    return this.repo.createSession(title);
  }

  async listSessions() {
    return this.repo.getSessions();
  }

  async getSession(id: string) {
    const session = await this.repo.getSessionById(id);
    const messages = await this.repo.getMessages(id);

    return {
      session,
      messages,
    };
  }

  async addMessage(sessionId: string, role: string, content: string) {
    return this.repo.addMessage(sessionId, role, content);
  }

  async updateDocuments(sessionId: string, documentIds: string[]) {
    return this.repo.updateSessionDocuments(sessionId, documentIds);
  }
}
