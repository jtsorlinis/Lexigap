import { FormEvent, useState } from "react";
import { bucketClassName } from "../game/feedback";
import type { Attempt } from "../game/types";

interface GuessInputProps {
  requiredLength: number;
  disabled: boolean;
  errorMessage: string | null;
  closestDownAttempt: Attempt | null;
  closestUpAttempt: Attempt | null;
  onSubmitGuess: (guess: string) => boolean;
}

interface HintRowProps {
  attempt: Attempt | null;
  directionSymbol: "↓" | "↑";
}

function HintRow({ attempt, directionSymbol }: HintRowProps): JSX.Element {
  return (
    <div className="attempt-row hint-row" aria-live="polite">
      <span className="attempt-direction hint-direction">
        {directionSymbol}
      </span>
      <span className={attempt ? "attempt-word" : "attempt-word placeholder"}>
        {attempt ? attempt.guess.toUpperCase() : "PLACEHOLDER"}
      </span>
      <span
        className={
          attempt
            ? `hint-distance ${bucketClassName(attempt.distance)}`
            : "hint-distance placeholder"
        }
      >
        {attempt ? `${attempt.distance} words away` : "000 words away"}
      </span>
    </div>
  );
}

function GuessInput({
  requiredLength,
  disabled,
  errorMessage,
  closestDownAttempt,
  closestUpAttempt,
  onSubmitGuess,
}: GuessInputProps): JSX.Element {
  const [guess, setGuess] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const accepted = onSubmitGuess(guess);
    if (accepted) {
      setGuess("");
    }
  }

  return (
    <section className="panel">
      <HintRow attempt={closestDownAttempt} directionSymbol="↓" />

      <form className="guess-form" onSubmit={onSubmit}>
        <div className="guess-input-wrap">
          <input
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={`Enter a ${requiredLength}-letter word`}
            value={guess}
            maxLength={requiredLength}
            onChange={(event) => setGuess(event.target.value)}
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={disabled}
            className="submit-icon-button"
            aria-label="Submit guess"
          >
            ➤
          </button>
        </div>
      </form>

      <HintRow attempt={closestUpAttempt} directionSymbol="↑" />

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </section>
  );
}

export default GuessInput;
