"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import DeckCard from "@/components/DeckCard";
import BottomNav from "@/components/BottomNav";
import DesktopHeader from "@/components/DesktopHeader";
import { useAppData } from "@/context/app-data-context";
import type { Deck } from "@/lib/types";

export default function HomePage() {
  const { ready, decks, addDeck, updateDeck, deleteDeck } = useAppData();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Deck | null>(null);

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addDeck(trimmed);
    setName("");
  }

  function handleDelete(id: string) {
    if (typeof window !== "undefined" && window.confirm("Delete this deck?")) {
      deleteDeck(id);
    }
  }

  return (
    <>
      <DesktopHeader />
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your decks
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Create decks and study offline — saved on this device.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="new-deck"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              New deck
            </label>
            <input
              id="new-deck"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="e.g. English Vocabulary"
              className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 shadow-sm outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="min-h-12 shrink-0 rounded-xl bg-violet-600 px-6 text-base font-semibold text-white shadow-md transition active:scale-[0.98] active:bg-violet-700 dark:bg-violet-500 dark:active:bg-violet-600"
          >
            Create
          </button>
        </form>

        {!ready ? (
          <p className="text-zinc-500 dark:text-zinc-400">Loading…</p>
        ) : decks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
              No decks yet
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Add a name above and tap Create to get started.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <li key={deck.id}>
                <DeckCard
                  deck={deck}
                  onEdit={(d: Deck) => setEditing(d)}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-deck-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2
              id="edit-deck-title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Rename deck
            </h2>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                updateDeck(editing.id, editing.name);
                setEditing(null);
              }}
            >
              <input
                autoFocus
                value={editing.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="min-h-11 rounded-xl px-4 font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-11 rounded-xl bg-violet-600 px-5 font-semibold text-white dark:bg-violet-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
