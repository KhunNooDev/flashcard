"use client";

import Link from "next/link";

export default function DeckCard({ deck, onEdit, onDelete }) {
  const count = deck.cards.length;

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-md transition hover:border-violet-200 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-800">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/deck/${deck.id}`}
          className="min-h-11 min-w-0 flex-1 rounded-lg py-2 text-left text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <span className="line-clamp-2">{deck.name}</span>
        </Link>
        <div className="relative z-20 flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(deck)}
            className="min-h-11 min-w-11 rounded-lg bg-zinc-100 px-3 text-sm font-medium text-zinc-700 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:active:bg-zinc-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(deck.id)}
            className="min-h-11 min-w-11 rounded-lg bg-red-50 px-3 text-sm font-medium text-red-700 active:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:active:bg-red-950/60"
          >
            Del
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          {count} card{count === 1 ? "" : "s"}
        </span>
        <span className="text-xs">{deck.createdAt}</span>
      </div>
      <Link
        href={`/study/${deck.id}`}
        className="relative z-20 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-4 text-base font-semibold text-white shadow-sm transition active:bg-violet-700 dark:bg-violet-500 dark:active:bg-violet-600"
      >
        Study
      </Link>
    </div>
  );
}
