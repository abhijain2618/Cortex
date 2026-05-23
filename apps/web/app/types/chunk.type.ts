import { DocType } from "./documents.type";

export interface RetrievedChunk {
  id:      string;
  rank:    number;
  text:    string;
  score:   number;    // 0–1 cosine similarity
  source:  string;
  page?:   number;
  section?: string;
  type:    DocType;
}
