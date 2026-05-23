export interface VectorStore {
  searchVector(vector: number[], topK: number): Promise<any[]>;
  searchBM25(query: string, topK: number): Promise<any[]>;
}
