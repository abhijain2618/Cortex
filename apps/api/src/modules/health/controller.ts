import axios from "axios";
import { pool } from "../../infrastructure/db/pool";
import { OLLAMA_URL } from "../../infrastructure/ollama/ollama.constants";

export class HealthController {
  async checkServer(req: any, reply: any) {
    return reply.send({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  }

  async checkDB(req: any, reply: any) {
    try {
      const result = await pool.query("SELECT NOW()");
      return {
        dbTime: result.rows[0],
      };
    } catch (error) {
      console.error("DB connection error:", error);
      return {
        error: "Failed to connect to the database",
      };
    }
  }

  async checkOllama(req: any, reply: any) {
    try {
      const res = await axios.get(`${OLLAMA_URL}/api/tags`);
      return res.data;
    } catch (error) {
      console.error("Ollama LLM connection error:", error);
      return {
        error: "Failed to connect to the LLM Ollama",
      };
    }
  }
}
