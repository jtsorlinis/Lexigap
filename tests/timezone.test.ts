import { describe, expect, it } from 'vitest';
import { daysBetweenIsoDates, getMelbourneIsoDate } from '../src/game/timezone';

describe('timezone', () => {
  it('derives the same Melbourne date for equivalent instants', () => {
    const melbourneInstant = new Date('2026-02-25T00:30:00+11:00');
    const utcEquivalent = new Date('2026-02-24T13:30:00Z');

    expect(getMelbourneIsoDate(melbourneInstant)).toBe('2026-02-25');
    expect(getMelbourneIsoDate(utcEquivalent)).toBe('2026-02-25');
  });

  it('computes day differences by ISO date boundaries', () => {
    expect(daysBetweenIsoDates('2026-01-01', '2026-01-01')).toBe(0);
    expect(daysBetweenIsoDates('2026-01-01', '2026-01-05')).toBe(4);
  });
});
