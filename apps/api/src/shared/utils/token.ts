export function estimateTokens(text: string): number {
  // simple approximation: 1 token ≈ 4 chars
  return Math.ceil(text.length / 4);
}
