import type { Attempt } from "../game/types";
import AttemptRow from "./AttemptRow";

interface AttemptListProps {
  attempts: Attempt[];
}

function AttemptList({ attempts }: AttemptListProps): JSX.Element {
  const sortedAttempts = attempts
    .map((attempt, index) => ({ attempt, originalIndex: index }))
    .sort((left, right) => {
      const distanceDelta = left.attempt.distance - right.attempt.distance;
      if (distanceDelta !== 0) {
        return distanceDelta;
      }

      return left.originalIndex - right.originalIndex;
    });

  return (
    <section className="panel">
      <div className="list-header">
        <h2>Attempts</h2>
        <span>{attempts.length} guesses</span>
      </div>
      <div className="attempt-columns">
        <span>#</span>
        <span>Word</span>
        <span>Distance</span>
        <span>Direction</span>
      </div>
      {attempts.length === 0 ? (
        <p className="empty-text">No valid guesses yet.</p>
      ) : (
        <ol className="attempt-list">
          {sortedAttempts.map(({ attempt, originalIndex }) => (
            <AttemptRow
              key={`${attempt.guess}-${originalIndex}`}
              attempt={attempt}
              attemptNumber={originalIndex + 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

export default AttemptList;
