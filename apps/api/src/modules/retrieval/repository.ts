import { pool } from "../../infrastructure/db/pool";

export class RetrievalRepository {
  async searchSimilar(queryVector: string, topK: number) {
    const result = await pool.query(
      `
      SELECT
        c.id AS chunk_id,
        c.document_id,
        c.content,
        c.chunk_index,
        c.metadata,
        c.embedding <-> $1 AS similarity,

        d.filename,
        d.original_name

      FROM chunks c
      JOIN documents d ON d.id = c.document_id

      ORDER BY c.embedding <-> $1
      LIMIT $2
      `,
      [queryVector, topK],
    );

    return result.rows;
  }
}
