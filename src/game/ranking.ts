export function rankDistance(guessRank: number, targetRank: number): number {
  return Math.abs(guessRank - targetRank);
}

export function getRank(lookup: Map<string, number>, word: string): number | undefined {
  return lookup.get(word);
}
