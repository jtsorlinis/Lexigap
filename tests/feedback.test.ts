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
    expect(getDistanceBucket(9).emoji).toBe('🟨');
    expect(getDistanceBucket(10).emoji).toBe('🟧');
    expect(getDistanceBucket(49).emoji).toBe('🟧');
    expect(getDistanceBucket(50).emoji).toBe('🟥');
    expect(getDistanceBucket(249).emoji).toBe('🟥');
    expect(getDistanceBucket(250).emoji).toBe('⬛');
  });
});
