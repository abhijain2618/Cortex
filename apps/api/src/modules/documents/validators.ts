import { z } from "zod";

export const createDocumentSchema = z.object({
  filename: z.string(),
  original_name: z.string(),
  mime_type: z.string(),
  size_bytes: z.number().optional(),
  source: z.string().optional(),
});
