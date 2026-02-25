import { createEmptyStats } from './stats';
import type { GameSnapshot, LexiGapStats, PuzzleDefinition } from './types';

const NAMESPACE = 'lexigap:v1';
const STATS_KEY = `${NAMESPACE}:stats`;
const THEME_KEY = `${NAMESPACE}:theme`;

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson<T>(key: string): T | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

export function getGameStorageKey(puzzle: PuzzleDefinition): string {
  if (puzzle.isPractice) {
    return `${NAMESPACE}:game:practice:${puzzle.practiceSeed ?? 'default'}`;
  }

  return `${NAMESPACE}:game:daily:${puzzle.melbourneDate}`;
}

export function loadGameSnapshot(storageKey: string): GameSnapshot | null {
  return readJson<GameSnapshot>(storageKey);
}

export function saveGameSnapshot(storageKey: string, snapshot: GameSnapshot): void {
  writeJson(storageKey, snapshot);
}

export function loadStats(): LexiGapStats {
  return readJson<LexiGapStats>(STATS_KEY) ?? createEmptyStats();
}

export function saveStats(stats: LexiGapStats): void {
  writeJson(STATS_KEY, stats);
}

export function loadTheme(): 'light' | 'dark' {
  const storedTheme = readJson<'light' | 'dark'>(THEME_KEY);
  return storedTheme === 'dark' ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  writeJson(THEME_KEY, theme);
}
