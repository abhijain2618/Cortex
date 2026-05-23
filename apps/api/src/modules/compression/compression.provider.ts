export interface CompressionProvider {
  compress(query: string, text: string): Promise<string>;
}
