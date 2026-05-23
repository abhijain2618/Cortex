import { pool } from "../../infrastructure/db/pool";

export class ChatSessionRepository {
  async createSession(title: string) {
    const result = await pool.query(
      `
      INSERT INTO chat_sessions (title)
      VALUES ($1)
      RETURNING *
      `,
      [title],
    );

    return result.rows[0];
  }

  async getSessions() {
    const result = await pool.query(
      `
      SELECT *
      FROM chat_sessions
      ORDER BY updated_at DESC
      `,
    );

    return result.rows;
  }

  async getSessionById(id: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM chat_sessions
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0];
  }

  async updateSessionDocuments(sessionId: string, documentIds: string[]) {
    await pool.query(
      `
      UPDATE chat_sessions
      SET document_ids = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [JSON.stringify(documentIds), sessionId],
    );
  }

  async addMessage(sessionId: string, role: string, content: string) {
    const result = await pool.query(
      `
      INSERT INTO chat_messages (session_id, role, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [sessionId, role, content],
    );

    return result.rows[0];
  }

  async getMessages(sessionId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
      `,
      [sessionId],
    );

    return result.rows;
  }
}
