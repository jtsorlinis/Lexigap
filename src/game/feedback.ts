import type { Direction, DistanceBucket } from './types';

export const DISTANCE_BUCKETS: readonly DistanceBucket[] = [
  { id: 'exact', emoji: '🟩', label: 'Correct', min: 0, max: 0 },
  { id: 'veryClose', emoji: '🟨', label: '1-9 away', min: 1, max: 9 },
  { id: 'close', emoji: '🟧', label: '10-49 away', min: 10, max: 49 },
  { id: 'far', emoji: '🟥', label: '50-249 away', min: 50, max: 249 },
  { id: 'veryFar', emoji: '⬛', label: '250+ away', min: 250, max: Number.POSITIVE_INFINITY }
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
