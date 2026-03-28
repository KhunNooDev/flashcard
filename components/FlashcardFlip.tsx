"use client";

import { useCallback } from "react";

export default function FlashcardFlip({
  front,
  back,
  flipped,
  onToggle,
  className = "",
  hint = "Tap to flip",
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`flashcard-scene cursor-pointer select-none rounded-xl shadow-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-violet-500 dark:ring-offset-zinc-900 ${className}`}
      aria-pressed={flipped}
    >
      <div
        className={`flashcard-inner min-h-44 w-full rounded-xl ${flipped ? "is-flipped" : ""}`}
      >
        <div className="flashcard-face flashcard-front bg-white p-6 text-center text-lg font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          <span className="line-clamp-6 whitespace-pre-wrap">{front}</span>
        </div>
        <div className="flashcard-face flashcard-back bg-violet-50 p-6 text-center text-lg font-medium text-zinc-900 dark:bg-violet-950/50 dark:text-violet-100">
          <span className="line-clamp-6 whitespace-pre-wrap">{back}</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {hint}
      </p>
    </div>
  );
}
