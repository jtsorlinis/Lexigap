export function normalizeWord(rawWord: string): string {
  return rawWord.toLowerCase().replace(/[^a-z]/g, '');
}

export function normalizeDictionary(rawWords: string[]): string[] {
  const uniqueWords = new Set<string>();

  for (const rawWord of rawWords) {
    const normalized = normalizeWord(rawWord);
    if (normalized.length > 0) {
      uniqueWords.add(normalized);
    }
  }

  return [...uniqueWords].sort((left, right) => left.localeCompare(right));
}
