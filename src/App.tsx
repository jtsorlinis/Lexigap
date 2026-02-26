import { useEffect, useMemo, useRef, useState } from "react";
import GuessInput from "./components/GuessInput";
import Header from "./components/Header";
import HelpModal from "./components/HelpModal";
import ResultModal from "./components/ResultModal";
import StatsModal from "./components/StatsModal";
import Toast from "./components/Toast";
import { createDictionaryModel } from "./game/buckets";
import { RAW_DICTIONARY } from "./game/dictionary";
import { buildEmojiRow, buildShareText } from "./game/share";
import { applyResultToStats, createEmptyStats } from "./game/stats";
import {
  getGameStorageKey,
  hasSeenHelpModal,
  loadGameSnapshot,
  loadStats,
  loadTheme,
  markHelpModalSeen,
  saveGameSnapshot,
  saveStats,
} from "./game/storage";
import {
  createInitialGameState,
  createPuzzleDefinition,
  submitGuess,
  MAX_GUESSES,
} from "./game/puzzle";
import type { Attempt, GameState, GameStatus } from "./game/types";

const RANDOM_MODE_ENABLED = import.meta.env.VITE_LEXIGAP_RANDOM_MODE === "true";
const RESULT_MODAL_DELAY_MS = 500;
const WIN_RESULT_MODAL_DELAY_MS = 1000;
const WIN_CELEBRATION_DURATION_MS = 480;

interface WinConfettiPiece {
  id: string;
  side: "left" | "right";
  left: string;
  bottom: string;
  width: string;
  height: string;
  delayMs: number;
  durationMs: number;
  color: string;
}

const WIN_CONFETTI_PIECES: WinConfettiPiece[] = [
  {
    id: "l1",
    side: "left",
    left: "11%",
    bottom: "16%",
    width: "8px",
    height: "14px",
    delayMs: 0,
    durationMs: 460,
    color: "#21a55a",
  },
  {
    id: "l2",
    side: "left",
    left: "13%",
    bottom: "15%",
    width: "7px",
    height: "12px",
    delayMs: 24,
    durationMs: 430,
    color: "#d5b319",
  },
  {
    id: "l3",
    side: "left",
    left: "10%",
    bottom: "18%",
    width: "6px",
    height: "10px",
    delayMs: 10,
    durationMs: 470,
    color: "#d78123",
  },
  {
    id: "l4",
    side: "left",
    left: "14%",
    bottom: "17%",
    width: "8px",
    height: "11px",
    delayMs: 36,
    durationMs: 450,
    color: "#c84343",
  },
  {
    id: "l5",
    side: "left",
    left: "12%",
    bottom: "16%",
    width: "5px",
    height: "10px",
    delayMs: 50,
    durationMs: 440,
    color: "#34b9ab",
  },
  {
    id: "l6",
    side: "left",
    left: "15%",
    bottom: "15%",
    width: "7px",
    height: "13px",
    delayMs: 16,
    durationMs: 455,
    color: "#ffffff",
  },
  {
    id: "r1",
    side: "right",
    left: "89%",
    bottom: "16%",
    width: "8px",
    height: "14px",
    delayMs: 0,
    durationMs: 460,
    color: "#21a55a",
  },
  {
    id: "r2",
    side: "right",
    left: "87%",
    bottom: "15%",
    width: "7px",
    height: "12px",
    delayMs: 22,
    durationMs: 435,
    color: "#d5b319",
  },
  {
    id: "r3",
    side: "right",
    left: "90%",
    bottom: "18%",
    width: "6px",
    height: "10px",
    delayMs: 12,
    durationMs: 468,
    color: "#d78123",
  },
  {
    id: "r4",
    side: "right",
    left: "86%",
    bottom: "17%",
    width: "8px",
    height: "11px",
    delayMs: 34,
    durationMs: 448,
    color: "#c84343",
  },
  {
    id: "r5",
    side: "right",
    left: "88%",
    bottom: "16%",
    width: "5px",
    height: "10px",
    delayMs: 48,
    durationMs: 442,
    color: "#34b9ab",
  },
  {
    id: "r6",
    side: "right",
    left: "85%",
    bottom: "15%",
    width: "7px",
    height: "13px",
    delayMs: 18,
    durationMs: 452,
    color: "#ffffff",
  },
];

function parsePracticeSeed(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = new URLSearchParams(window.location.search).get("practice");
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function generateRandomPracticeSeed(): string {
  const timestampToken = Date.now().toString(36);

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const randomBuffer = new Uint32Array(2);
    crypto.getRandomValues(randomBuffer);
    return `random-${timestampToken}-${randomBuffer[0].toString(36)}${randomBuffer[1].toString(36)}`;
  }

  return `random-${timestampToken}-${Math.floor(Math.random() * 1_000_000_000).toString(36)}`;
}

function shouldUseSnapshot(
  snapshot: ReturnType<typeof loadGameSnapshot>,
  puzzle: GameState["puzzle"],
): snapshot is NonNullable<ReturnType<typeof loadGameSnapshot>> {
  if (!snapshot) {
    return false;
  }

  return (
    snapshot.puzzleNumber === puzzle.puzzleNumber &&
    snapshot.melbourneDate === puzzle.melbourneDate &&
    snapshot.seedKey === puzzle.seedKey
  );
}

function App(): JSX.Element {
  const dictionaryModel = useMemo(
    () => createDictionaryModel(RAW_DICTIONARY),
    [],
  );
  const initialPracticeSeed = useMemo(() => {
    const urlPracticeSeed = parsePracticeSeed();

    if (RANDOM_MODE_ENABLED) {
      return urlPracticeSeed ?? generateRandomPracticeSeed();
    }

    return urlPracticeSeed;
  }, []);
  const [activePracticeSeed, setActivePracticeSeed] = useState<
    string | undefined
  >(initialPracticeSeed);

  const puzzle = useMemo(
    () =>
      createPuzzleDefinition({
        dictionary: dictionaryModel,
        practiceSeed: activePracticeSeed,
      }),
    [dictionaryModel, activePracticeSeed],
  );

  const storageKey = useMemo(() => getGameStorageKey(puzzle), [puzzle]);

  const [stats, setStats] = useState(() => loadStats() ?? createEmptyStats());
  const [theme] = useState<"light" | "dark">(() => loadTheme());
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [winCelebrationBurst, setWinCelebrationBurst] = useState(0);
  const resultRevealTimeoutRef = useRef<number | null>(null);
  const winCelebrationTimeoutRef = useRef<number | null>(null);

  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = createInitialGameState(puzzle, MAX_GUESSES);
    const snapshot = loadGameSnapshot(storageKey);

    if (!shouldUseSnapshot(snapshot, initial.puzzle)) {
      return initial;
    }

    return {
      puzzle: initial.puzzle,
      maxGuesses: Math.max(snapshot.maxGuesses, MAX_GUESSES),
      attempts: snapshot.attempts,
      status: snapshot.status,
    };
  });

  useEffect(() => {
    const initial = createInitialGameState(puzzle, MAX_GUESSES);
    const snapshot = loadGameSnapshot(storageKey);
    clearResultRevealTimeout();
    clearWinCelebrationTimeout();
    setShowWinCelebration(false);

    if (shouldUseSnapshot(snapshot, initial.puzzle)) {
      setGameState({
        puzzle: initial.puzzle,
        maxGuesses: Math.max(snapshot.maxGuesses, MAX_GUESSES),
        attempts: snapshot.attempts,
        status: snapshot.status,
      });
      setResultOpen(snapshot.status !== "playing");
      return;
    }

    setGameState(initial);
    setResultOpen(false);
  }, [puzzle, storageKey]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (hasSeenHelpModal()) {
      return;
    }

    setHelpOpen(true);
    markHelpModalSeen();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !RANDOM_MODE_ENABLED) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (activePracticeSeed) {
      params.set("practice", activePracticeSeed);
    } else {
      params.delete("practice");
    }

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [activePracticeSeed]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      clearResultRevealTimeout();
      clearWinCelebrationTimeout();
    };
  }, []);

  function clearResultRevealTimeout(): void {
    if (resultRevealTimeoutRef.current !== null) {
      window.clearTimeout(resultRevealTimeoutRef.current);
      resultRevealTimeoutRef.current = null;
    }
  }

  function clearWinCelebrationTimeout(): void {
    if (winCelebrationTimeoutRef.current !== null) {
      window.clearTimeout(winCelebrationTimeoutRef.current);
      winCelebrationTimeoutRef.current = null;
    }
  }

  function queueResultModalOpen(delayMs: number): void {
    clearResultRevealTimeout();
    resultRevealTimeoutRef.current = window.setTimeout(() => {
      setResultOpen(true);
      resultRevealTimeoutRef.current = null;
    }, delayMs);
  }

  function triggerWinCelebration(): void {
    clearWinCelebrationTimeout();
    setWinCelebrationBurst((current) => current + 1);
    setShowWinCelebration(true);
    winCelebrationTimeoutRef.current = window.setTimeout(() => {
      setShowWinCelebration(false);
      winCelebrationTimeoutRef.current = null;
    }, WIN_CELEBRATION_DURATION_MS);
  }

  function persist(nextState: GameState): void {
    saveGameSnapshot(storageKey, {
      puzzleNumber: nextState.puzzle.puzzleNumber,
      melbourneDate: nextState.puzzle.melbourneDate,
      requiredLength: nextState.puzzle.requiredLength,
      targetWord: nextState.puzzle.targetWord,
      seedKey: nextState.puzzle.seedKey,
      isPractice: nextState.puzzle.isPractice,
      practiceSeed: nextState.puzzle.practiceSeed,
      maxGuesses: nextState.maxGuesses,
      attempts: nextState.attempts,
      status: nextState.status,
    });
  }

  function recordStatsIfCompleted(
    previousStatus: GameStatus,
    nextState: GameState,
  ): void {
    if (
      nextState.puzzle.isPractice ||
      previousStatus !== "playing" ||
      nextState.status === "playing"
    ) {
      return;
    }

    const emojiRow = buildEmojiRow(nextState.attempts);

    setStats((current) => {
      const updated = applyResultToStats(current, {
        puzzleNumber: nextState.puzzle.puzzleNumber,
        date: nextState.puzzle.melbourneDate,
        won: nextState.status === "won",
        guessCount: nextState.attempts.length,
        emojiRow,
      });

      saveStats(updated);
      return updated;
    });
  }

  function onSubmitGuess(rawGuess: string): boolean {
    const result = submitGuess(gameState, rawGuess, dictionaryModel);

    if (!result.valid) {
      setErrorMessage(result.error ?? "Invalid guess.");
      return false;
    }

    const nextState = result.state;
    setErrorMessage(null);
    setGameState(nextState);
    persist(nextState);
    recordStatsIfCompleted(gameState.status, nextState);

    if (nextState.status !== "playing") {
      setResultOpen(false);
      if (nextState.status === "won") {
        triggerWinCelebration();
      }
      queueResultModalOpen(
        nextState.status === "won"
          ? WIN_RESULT_MODAL_DELAY_MS
          : RESULT_MODAL_DELAY_MS,
      );
    }

    return true;
  }

  async function shareResult(): Promise<void> {
    const shareText = buildShareText(
      gameState.puzzle.puzzleNumber,
      gameState.attempts,
    );

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `LexiGap #${gameState.puzzle.puzzleNumber}`,
          text: shareText,
        });
        return;
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setToastMessage("Share text copied");
    } catch {
      setToastMessage("Clipboard unavailable");
    }
  }

  function startNewPuzzle(): void {
    clearResultRevealTimeout();
    clearWinCelebrationTimeout();
    setShowWinCelebration(false);
    setResultOpen(false);
    setErrorMessage(null);
    setActivePracticeSeed(generateRandomPracticeSeed());
  }

  function focusGuessInputFromHint(): void {
    if (gameState.status !== "playing" || helpOpen || statsOpen || resultOpen) {
      return;
    }

    const input = document.querySelector<HTMLInputElement>(
      ".guess-input-native:not(:disabled)",
    );

    if (!input) {
      return;
    }

    input.focus();
    const caretIndex = input.value.length;
    input.setSelectionRange(caretIndex, caretIndex);
  }

  const shareText = useMemo(
    () => buildShareText(gameState.puzzle.puzzleNumber, gameState.attempts),
    [gameState.attempts, gameState.puzzle.puzzleNumber],
  );

  const closestDownAttempt = useMemo(() => {
    let best: Attempt | null = null;

    for (const attempt of gameState.attempts) {
      if (attempt.direction !== "Later") {
        continue;
      }

      if (!best || attempt.distance < best.distance) {
        best = attempt;
      }
    }

    return best;
  }, [gameState.attempts]);

  const closestUpAttempt = useMemo(() => {
    let best: Attempt | null = null;

    for (const attempt of gameState.attempts) {
      if (attempt.direction !== "Earlier") {
        continue;
      }

      if (!best || attempt.distance < best.distance) {
        best = attempt;
      }
    }

    return best;
  }, [gameState.attempts]);

  const guessesRemaining = gameState.maxGuesses - gameState.attempts.length;

  return (
    <main className="app-shell">
      <div className="main-content">
        <Header
          puzzleNumber={gameState.puzzle.puzzleNumber}
          isPractice={gameState.puzzle.isPractice}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenStats={() => setStatsOpen(true)}
        />

        <GuessInput
          requiredLength={gameState.puzzle.requiredLength}
          attempts={gameState.attempts}
          disabled={gameState.status !== "playing"}
          errorMessage={errorMessage}
          closestDownAttempt={closestDownAttempt}
          closestUpAttempt={closestUpAttempt}
          targetWord={gameState.puzzle.targetWord}
          onSubmitGuess={onSubmitGuess}
        />

        <p className="guesses-remaining-text">
          <strong>{guessesRemaining} attempts remaining</strong>
        </p>
      </div>

      <div
        className="mobile-keyboard-hint-region"
        role="button"
        tabIndex={0}
        aria-label="Focus guess input"
        onClick={focusGuessInputFromHint}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            focusGuessInputFromHint();
          }
        }}
      >
        <p className="mobile-keyboard-hint">
          tap anywhere to bring up the keyboard
        </p>
      </div>

      {showWinCelebration ? (
        <div
          key={winCelebrationBurst}
          className="win-party-overlay"
          aria-hidden="true"
        >
          <span className="win-party-popper win-party-popper-left">🎉</span>
          <span className="win-party-popper win-party-popper-right">🎉</span>
          {WIN_CONFETTI_PIECES.map((piece) => (
            <span
              key={piece.id}
              className={`win-confetti ${
                piece.side === "left" ? "from-left" : "from-right"
              }`}
              style={{
                left: piece.left,
                bottom: piece.bottom,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.color,
                animationDelay: `${piece.delayMs}ms`,
                animationDuration: `${piece.durationMs}ms`,
              }}
            />
          ))}
        </div>
      ) : null}

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <StatsModal
        isOpen={statsOpen}
        stats={stats}
        onClose={() => setStatsOpen(false)}
      />

      <ResultModal
        isOpen={resultOpen}
        status={gameState.status}
        targetWord={gameState.puzzle.targetWord}
        attemptsUsed={gameState.attempts.length}
        maxGuesses={gameState.maxGuesses}
        shareText={shareText}
        stats={stats}
        showNewPuzzleAction={RANDOM_MODE_ENABLED}
        onClose={() => setResultOpen(false)}
        onShare={shareResult}
        onStartNewPuzzle={startNewPuzzle}
      />

      <Toast message={toastMessage} />
    </main>
  );
}

export default App;
