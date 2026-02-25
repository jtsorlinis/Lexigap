import { bucketClassName } from '../game/feedback';
import type { Attempt } from '../game/types';

interface AttemptRowProps {
  attempt: Attempt;
  attemptNumber: number;
}

function getDirectionSymbol(direction: Attempt['direction']): string {
  switch (direction) {
    case 'Earlier':
      return '↑';
    case 'Later':
      return '↓';
    case 'Correct':
      return '✓';
    default:
      return '';
  }
}

function AttemptRow({ attempt, attemptNumber }: AttemptRowProps): JSX.Element {
  const directionSymbol = getDirectionSymbol(attempt.direction);

  return (
    <li className="attempt-row">
      <span className="attempt-number">{attemptNumber}</span>
      <span className="attempt-word">{attempt.guess.toUpperCase()}</span>
      <span className={`attempt-distance ${bucketClassName(attempt.distance)}`}>{attempt.distance}</span>
      <span className="attempt-direction" title={attempt.direction} aria-label={attempt.direction}>
        {directionSymbol}
      </span>
    </li>
  );
}

export default AttemptRow;
