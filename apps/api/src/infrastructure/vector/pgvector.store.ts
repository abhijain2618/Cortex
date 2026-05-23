import { pool } from "../db/pool";
import { VectorStore } from "../../modules/vector/vector.store";

export class PgVectorStore implements VectorStore {
  async searchVector(vector: number[], topK: number): Promise<any[]> {
    const vectorString = `[${vector.join(",")}]`;

    const result = await pool.query(
      `
      SELECT
        c.id AS chunk_id,
        c.document_id,
        c.content,
        c.chunk_index,
        c.metadata,
        c.embedding <-> $1 AS vector_score,

        d.filename,
        d.original_name

      FROM chunks c
      JOIN documents d ON d.id = c.document_id

      ORDER BY c.embedding <-> $1
      LIMIT $2
      `,
      [vectorString, topK],
    );

    return result.rows;
  }

  async searchBM25(query: string, topK: number): Promise<any[]> {
    const result = await pool.query(
      `
    SELECT
      c.id AS chunk_id,
      c.document_id,
      c.content,
      c.chunk_index,
      c.metadata,

      ts_rank(
        c.search_vector,
        plainto_tsquery('english', $1)
      ) AS bm25_score,

      d.filename,
      d.original_name

    FROM chunks c
    JOIN documents d
      ON d.id = c.document_id

    WHERE c.search_vector @@ plainto_tsquery('english', $1)

    ORDER BY bm25_score DESC

    LIMIT $2
    `,
      [query, topK],
    );

    return result.rows;
  }
}
