import { normalizeDictionary } from './normalize';
import type { DictionaryModel } from './types';

export const DEFAULT_WORD_LENGTHS = [4, 5, 6, 7] as const;

export function buildBuckets(words: string[], allowedLengths: readonly number[]): Record<number, string[]> {
  const buckets: Record<number, string[]> = {};

  for (const allowedLength of allowedLengths) {
    buckets[allowedLength] = [];
  }

  for (const word of words) {
    const bucket = buckets[word.length];
    if (bucket) {
      bucket.push(word);
    }
  }

  return buckets;
}

export function buildBucketLookups(buckets: Record<number, string[]>): Record<number, Map<string, number>> {
  const lookups: Record<number, Map<string, number>> = {};

  for (const [lengthString, bucketWords] of Object.entries(buckets)) {
    const lookup = new Map<string, number>();
    bucketWords.forEach((word, rank) => {
      lookup.set(word, rank);
    });

    lookups[Number.parseInt(lengthString, 10)] = lookup;
  }

  return lookups;
}

export function createDictionaryModel(
  rawWords: string[],
  allowedLengths: readonly number[] = DEFAULT_WORD_LENGTHS
): DictionaryModel {
  const normalizedWords = normalizeDictionary(rawWords);
  const buckets = buildBuckets(normalizedWords, allowedLengths);
  const bucketLookups = buildBucketLookups(buckets);

  return {
    normalizedWords,
    buckets,
    bucketLookups
  };
}
