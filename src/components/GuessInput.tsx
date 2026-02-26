import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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

function renderGuessSlots(guess: string, requiredLength: number): JSX.Element[] {
  const letters = guess.toUpperCase().slice(0, requiredLength).split("");

  return Array.from({ length: requiredLength }, (_, index) => {
    const letter = letters[index] ?? "";

    return (
      <span
        key={`guess-slot-${index}`}
        className={letter ? "guess-slot filled" : "guess-slot"}
      >
        {letter}
      </span>
    );
  });
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
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

  const submitGuess = useCallback((): void => {
    const accepted = onSubmitGuess(guess);
    if (accepted) {
      setGuess("");
    }
  }, [guess, onSubmitGuess]);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    submitGuess();
  }

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (isEditableElement(event.target)) {
        return;
      }

      if (document.querySelector(".modal-backdrop")) {
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        setGuess((current) => current.slice(0, -1));
        return;
      }

      if (event.key === "Enter") {
        if (guess.length === 0) {
          return;
        }

        event.preventDefault();
        submitGuess();
        return;
      }

      if (!/^[a-zA-Z]$/.test(event.key)) {
        return;
      }

      event.preventDefault();
      setGuess((current) => {
        if (current.length >= requiredLength) {
          return current;
        }

        return `${current}${event.key.toLowerCase()}`;
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [disabled, guess.length, requiredLength, submitGuess]);

  return (
    <section className="panel">
      <HintRow
        attempt={closestDownAttempt}
        directionSymbol="↓"
        targetWord={targetWord}
      />

      <form className="guess-form" onSubmit={onSubmit}>
        <div className={disabled ? "guess-input-wrap disabled" : "guess-input-wrap"}>
          <div
            className="guess-slot-grid"
            style={{ gridTemplateColumns: `repeat(${requiredLength}, minmax(32px, 52px))` }}
            aria-hidden="true"
          >
            {renderGuessSlots(guess, requiredLength)}
          </div>
          <input
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="guess-input-native"
            value={guess}
            maxLength={requiredLength}
            onChange={(event) => setGuess(event.target.value)}
            disabled={disabled}
            aria-label={`Enter a ${requiredLength}-letter word`}
          />
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
