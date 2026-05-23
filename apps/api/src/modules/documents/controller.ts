import { DocumentService } from "./service";
import { DocumentRepository } from "./repository";
import { toDocumentDTO } from "./mapper";

const service = new DocumentService(new DocumentRepository());

export class DocumentController {
  async upload(req: any, reply: any) {
    try {
      const file = await req.file();

      if (!file) {
        return reply.status(400).send({ error: "No file uploaded" });
      }

      const doc = await service.upload(file);

      // Call session service for adding document id
      // refer to chat service for implemenation
      // await service.updateDocuments(sessionId, documentIds);

      return reply.send({
        success: true,
        document: toDocumentDTO(doc),
      });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  async list(req: any, reply: any) {
    const docs = await service.listDocuments();

    return reply.send({
      documents: docs.map(toDocumentDTO),
    });
  }
}
