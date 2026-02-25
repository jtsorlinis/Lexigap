import { describe, expect, it } from 'vitest';
import { getRank, rankDistance } from '../src/game/ranking';

describe('ranking', () => {
  it('calculates absolute rank distance', () => {
    expect(rankDistance(3, 8)).toBe(5);
    expect(rankDistance(8, 3)).toBe(5);
    expect(rankDistance(4, 4)).toBe(0);
  });

  it('reads rank from lookup map', () => {
    const lookup = new Map<string, number>([
      ['apple', 0],
      ['berry', 1]
    ]);

    expect(getRank(lookup, 'apple')).toBe(0);
    expect(getRank(lookup, 'missing')).toBeUndefined();
  });
});
