import { pool } from "../../infrastructure/db/pool";


export class DocumentRepository {
  async create(input: any) {
    const result = await pool.query(
      `
      INSERT INTO documents (
        filename,
        original_name,
        mime_type,
        size_bytes,
        source,
        status,
        progress
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        input.filename,
        input.original_name,
        input.mime_type,
        input.size_bytes || null,
        input.source || "upload",
        "uploaded",
        0,
      ]
    );

    return result.rows[0];
  }

  async updateStatus(id: number, status: string, progress?: number) {
    return pool.query(
      `
      UPDATE documents
      SET status = $1,
          progress = COALESCE($2, progress),
          updated_at = NOW()
      WHERE id = $3
      `,
      [status, progress ?? null, id]
    );
  }

  async updateProgress(id: number, progress: number) {
    return pool.query(
      `
      UPDATE documents
      SET progress = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [progress, id]
    );
  }

  async updateEmbedding(id: number, embedding: string) {
    return pool.query(
      `
      UPDATE documents
      SET embedding = $1
      WHERE id = $2
      `,
      [embedding, id]
    );
  }

  async updateFailure(id: number, error: string) {
    return pool.query(
      `
      UPDATE documents
      SET status = 'failed',
          error_message = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [error, id]
    );
  }

  async list() {
    const result = await pool.query(`
      SELECT * FROM documents
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    return result.rows;
  }
}

// import { pool } from "@/src/infrastructure/db/pool";

// export class DocumentRepository {
//   async create(input: any) {
//     const result = await pool.query(
//       `
//       INSERT INTO documents (
//         filename,
//         original_name,
//         mime_type,
//         size_bytes,
//         source,
//         status,
//         progress
//       )
//       VALUES ($1,$2,$3,$4,$5,$6,$7)
//       RETURNING *
//       `,
//       [
//         input.filename,
//         input.original_name,
//         input.mime_type,
//         input.size_bytes || null,
//         input.source || "upload",
//         "uploaded",
//         0,
//       ]
//     );

//     return result.rows[0];
//   }

//   async updateStatus(
//     id: number,
//     status: string,
//     progress?: number
//   ) {
//     const result = await pool.query(
//       `
//       UPDATE documents
//       SET
//         status = $1,
//         progress = COALESCE($2, progress),
//         updated_at = NOW()
//       WHERE id = $3
//       RETURNING *
//       `,
//       [status, progress ?? null, id]
//     );

//     return result.rows[0];
//   }

//   async updateProgress(id: number, progress: number) {
//     const result = await pool.query(
//       `
//       UPDATE documents
//       SET
//         progress = $1,
//         updated_at = NOW()
//       WHERE id = $2
//       RETURNING *
//       `,
//       [progress, id]
//     );

//     return result.rows[0];
//   }

//   async updateEmbedding(id: number, embedding: string) {
//     const result = await pool.query(
//       `
//       UPDATE documents
//       SET embedding = $1
//       WHERE id = $2
//       RETURNING *
//       `,
//       [embedding, id]
//     );

//     return result.rows[0];
//   }

//   async updateFailure(id: number, error: string) {
//     await pool.query(
//       `
//       UPDATE documents
//       SET
//         status = 'failed',
//         error_message = $1,
//         updated_at = NOW()
//       WHERE id = $2
//       `,
//       [error, id]
//     );
//   }

//   async list() {
//     const result = await pool.query(`
//       SELECT *
//       FROM documents
//       WHERE deleted_at IS NULL
//       ORDER BY created_at DESC
//     `);

//     return result.rows;
//   }

//   async findById(id: number) {
//     const result = await pool.query(
//       `SELECT * FROM documents WHERE id = $1`,
//       [id]
//     );

//     return result.rows[0];
//   }
// }
