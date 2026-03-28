"use client";

import { useState } from "react";
import FlashcardFlip from "./FlashcardFlip";

const statusStyles = {
  new: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  learning:
    "bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
  mastered:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
};

export default function FlashcardItem({ card, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[card.status]}`}
        >
          {card.status}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(card)}
            className="min-h-10 min-w-10 rounded-lg bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm active:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:active:bg-zinc-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            className="min-h-10 min-w-10 rounded-lg bg-red-50 px-3 text-sm font-medium text-red-700 active:bg-red-100 dark:bg-red-950/40 dark:text-red-300"
          >
            Del
          </button>
        </div>
      </div>
      <FlashcardFlip
        front={card.front || "—"}
        back={card.back || "—"}
        flipped={flipped}
        onToggle={() => setFlipped((v) => !v)}
      />
    </div>
  );
}
