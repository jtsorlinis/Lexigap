import type { Direction, DistanceBucket } from './types';

export const DISTANCE_BUCKETS: readonly DistanceBucket[] = [
  { id: 'exact', emoji: '🟩', label: 'Correct', min: 0, max: 0 },
  { id: 'veryClose', emoji: '🟨', label: '1-5 away', min: 1, max: 5 },
  { id: 'close', emoji: '🟧', label: '6-20 away', min: 6, max: 20 },
  { id: 'far', emoji: '🟥', label: '21-100 away', min: 21, max: 100 },
  { id: 'veryFar', emoji: '⬛', label: '101+ away', min: 101, max: Number.POSITIVE_INFINITY }
];

export function getDirection(guessRank: number, targetRank: number): Direction {
  if (guessRank === targetRank) {
    return 'Correct';
  }

  return targetRank < guessRank ? 'Earlier' : 'Later';
}

export function getDistanceBucket(distance: number): DistanceBucket {
  for (const bucket of DISTANCE_BUCKETS) {
    if (distance >= bucket.min && distance <= bucket.max) {
      return bucket;
    }
  }

  return DISTANCE_BUCKETS[DISTANCE_BUCKETS.length - 1];
}

export function bucketClassName(distance: number): string {
  const bucket = getDistanceBucket(distance);

  switch (bucket.id) {
    case 'exact':
      return 'bucket-exact';
    case 'veryClose':
      return 'bucket-very-close';
    case 'close':
      return 'bucket-close';
    case 'far':
      return 'bucket-far';
    case 'veryFar':
      return 'bucket-very-far';
    default:
      return 'bucket-very-far';
  }
}
