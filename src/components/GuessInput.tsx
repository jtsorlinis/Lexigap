import { FormEvent, useEffect, useRef, useState } from "react";
import { bucketClassName } from "../game/feedback";
import type { Attempt } from "../game/types";

interface GuessInputProps {
  requiredLength: number;
  disabled: boolean;
  errorMessage: string | null;
  closestDownAttempt: Attempt | null;
  closestUpAttempt: Attempt | null;
  targetWord: string;
  onSubmitGuess: (guess: string) => boolean;
}

interface HintRowProps {
  attempt: Attempt | null;
  directionSymbol: "↓" | "↑";
  targetWord: string;
}

function getLeadingMatchLength(word: string, targetWord: string): number {
  const maxLength = Math.min(word.length, targetWord.length);
  let index = 0;

  while (index < maxLength && word[index] === targetWord[index]) {
    index += 1;
  }

  return index;
}

function renderHintWord(word: string, targetWord: string): JSX.Element[] {
  const uppercaseWord = word.toUpperCase();
  const leadingMatchLength = getLeadingMatchLength(word, targetWord);

  return uppercaseWord.split("").map((letter, index) => (
    <span
      key={`${word}-${index}`}
      className={index < leadingMatchLength ? "hint-letter-match" : "hint-letter"}
    >
      {letter}
    </span>
  ));
}

function HintRow({ attempt, directionSymbol, targetWord }: HintRowProps): JSX.Element {
  const transitionKey = attempt
    ? `${attempt.guess}:${attempt.distance}:${attempt.direction}`
    : "empty";
  const previousKeyRef = useRef<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (previousKeyRef.current === null) {
      previousKeyRef.current = transitionKey;
      return;
    }

    if (previousKeyRef.current !== transitionKey) {
      setIsAnimating(true);
      const timeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, 220);

      previousKeyRef.current = transitionKey;
      return () => {
        window.clearTimeout(timeout);
      };
    }

    return undefined;
  }, [transitionKey]);

  return (
    <div className="attempt-row hint-row" aria-live="polite">
      <span className="attempt-direction hint-direction">
        {directionSymbol}
      </span>
      <span
        className={
          attempt
            ? `attempt-word hint-word${isAnimating ? " hint-changing" : ""}`
            : "attempt-word hint-word placeholder"
        }
      >
        {attempt ? renderHintWord(attempt.guess, targetWord) : "PLACEHOLDER"}
      </span>
      <span
        className={
          attempt
            ? `hint-distance ${bucketClassName(attempt.distance)}${
                isAnimating ? " hint-changing" : ""
              }`
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
  targetWord,
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
      <HintRow
        attempt={closestDownAttempt}
        directionSymbol="↓"
        targetWord={targetWord}
      />

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

      <HintRow
        attempt={closestUpAttempt}
        directionSymbol="↑"
        targetWord={targetWord}
      />

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </section>
  );
}

export default GuessInput;
