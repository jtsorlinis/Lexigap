import { getDistanceBucket } from './feedback';
import type { Attempt } from './types';

export const GAME_NAME = 'LexiGap';
const WIN_EMOJI = '🟩';

export function buildEmojiRow(attempts: Attempt[], maxGuesses?: number): string {
  const baseRow = attempts.map((attempt) => getDistanceBucket(attempt.distance).emoji);
  const hasCorrectGuess = attempts.some((attempt) => attempt.distance === 0);

  if (!hasCorrectGuess || !maxGuesses || attempts.length >= maxGuesses) {
    return baseRow.join('');
  }

  const paddingCount = maxGuesses - attempts.length;
  const paddedRow = [...baseRow, ...Array.from({ length: paddingCount }, () => WIN_EMOJI)];
  return paddedRow.join('');
}

export function buildShareText(puzzleNumber: number, attempts: Attempt[], maxGuesses?: number): string {
  const emojiRow = buildEmojiRow(attempts, maxGuesses);
  return `${GAME_NAME} #${puzzleNumber}\n${emojiRow}`;
}
