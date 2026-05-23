import fs from "fs";
import path from "path";

import { DocumentRepository } from "./repository";


import { getEmbedding } from "../../providers/embeddings/ollamaEmbedding";
import { pool } from "../../infrastructure/db/pool";
import { extractText } from "../../providers/extraction/pdfExtractor";
import { chunkText } from "../../providers/chunking/chunkService";

export class DocumentService {
  constructor(private repo: DocumentRepository) {}

  async upload(file: any) {
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const safeFileName = `${Date.now()}-${file.filename}`;
    const filePath = path.join(uploadDir, safeFileName);
    const buffer = await file.toBuffer();

    await fs.promises.writeFile(filePath, buffer);

    const doc = await this.repo.create({
      filename: safeFileName,
      original_name: file.filename,
      mime_type: file.mimetype,
      size_bytes: buffer.length,
      source: "upload",
    });

    // async processing
    setImmediate(() => {
      this.processDocument(doc.id, filePath, safeFileName, file.mimetype).catch(
        console.error
      );
    });

    return doc;
  }

  async processDocument(
    docId: number,
    filePath: string,
    fileName: string,
    mimeType: string
  ) {
    try {
      await this.repo.updateStatus(docId, "extracting", 10);
      const text = await extractText(filePath, mimeType);

      if (!text?.trim()) throw new Error("No text extracted");
      await this.repo.updateStatus(docId, "chunking", 30);

      const chunks = chunkText(text);

      if (!chunks.length) throw new Error("No chunks generated");

      // chunk count update
      await pool.query(`UPDATE documents SET chunk_count = $1 WHERE id = $2`, [
        chunks.length,
        docId,
      ]);

      await this.repo.updateStatus(docId, "embedding", 50);

      const embeddings: number[][] = [];

      let insertedCount = 0;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]?.trim();
        if (!chunk) continue;

        const embedding = await getEmbedding(chunk);
        embeddings.push(embedding);

        const vector = `[${embedding.join(",")}]`;

        await pool.query(
          `
          INSERT INTO chunks (
            document_id,
            chunk_index,
            content,
            embedding,
            metadata
          )
          VALUES ($1,$2,$3,$4,$5)
          `,
          [docId, insertedCount, chunk, vector, { file: fileName }]
        );

        insertedCount++;

        const progress = 50 + Math.floor((insertedCount / chunks.length) * 45);

        await this.repo.updateProgress(docId, progress);
      }

      // document embedding (average)
      const dim = embeddings[0].length;
      const avg = new Array(dim).fill(0);

      for (const e of embeddings) {
        for (let i = 0; i < dim; i++) {
          avg[i] += e[i];
        }
      }

      for (let i = 0; i < dim; i++) {
        avg[i] /= embeddings.length;
      }

      await this.repo.updateEmbedding(docId, `[${avg.join(",")}]`);

      await this.repo.updateStatus(docId, "processed", 100);
    } catch (err: any) {
      await this.repo.updateFailure(docId, err.message);
    } finally {
      try {
        await fs.promises.unlink(filePath);
      } catch {}
    }
  }

  async listDocuments() {
    return this.repo.list();
  }
}
