import type { GameStatus, LexiGapStats } from '../game/types';

interface ResultModalProps {
  isOpen: boolean;
  status: GameStatus;
  targetWord: string;
  attemptsUsed: number;
  maxGuesses: number;
  shareText: string;
  stats: LexiGapStats;
  showNewPuzzleAction: boolean;
  onClose: () => void;
  onCopyShare: () => void;
  onStartNewPuzzle: () => void;
}

function ResultModal({
  isOpen,
  status,
  targetWord,
  attemptsUsed,
  maxGuesses,
  shareText,
  stats,
  showNewPuzzleAction,
  onClose,
  onCopyShare,
  onStartNewPuzzle
}: ResultModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  const title = status === 'won' ? 'Solved' : 'Out of guesses';

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        <p>
          Target word: <strong>{targetWord.toUpperCase()}</strong>
        </p>
        <p>
          Attempts: {attemptsUsed}/{maxGuesses}
        </p>
        <p>
          Wins: {stats.totalWins}/{stats.totalPlayed} | Streak: {stats.currentStreak} | Max streak: {stats.maxStreak}
        </p>

        <textarea className="share-preview" readOnly value={shareText} />

        <div className="modal-actions">
          <button type="button" onClick={onCopyShare}>
            Copy Share
          </button>
          {showNewPuzzleAction ? (
            <button type="button" className="ghost-button" onClick={onStartNewPuzzle}>
              New Puzzle
            </button>
          ) : (
            <button type="button" className="ghost-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
