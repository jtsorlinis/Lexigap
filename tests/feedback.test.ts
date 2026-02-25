import { describe, expect, it } from 'vitest';
import { getDirection, getDistanceBucket } from '../src/game/feedback';

describe('feedback', () => {
  it('returns correct direction text', () => {
    expect(getDirection(12, 4)).toBe('Earlier');
    expect(getDirection(4, 12)).toBe('Later');
    expect(getDirection(8, 8)).toBe('Correct');
  });

  it('maps distances to share buckets', () => {
    expect(getDistanceBucket(0).emoji).toBe('🟩');
    expect(getDistanceBucket(1).emoji).toBe('🟨');
    expect(getDistanceBucket(5).emoji).toBe('🟨');
    expect(getDistanceBucket(6).emoji).toBe('🟧');
    expect(getDistanceBucket(20).emoji).toBe('🟧');
    expect(getDistanceBucket(21).emoji).toBe('🟥');
    expect(getDistanceBucket(100).emoji).toBe('🟥');
    expect(getDistanceBucket(101).emoji).toBe('⬛');
  });
});
