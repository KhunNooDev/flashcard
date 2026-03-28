"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import DesktopHeader from "@/components/DesktopHeader";
import FlashcardItem from "@/components/FlashcardItem";
import { useAppData } from "@/context/app-data-context";

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const { ready, getDeck, addCard, updateCard, deleteCard } = useAppData();
  const deck = id ? getDeck(id) : undefined;

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [editingCard, setEditingCard] = useState(null);

  function handleAdd(e) {
    e.preventDefault();
    if (!deck || !front.trim()) return;
    addCard(deck.id, front, back);
    setFront("");
    setBack("");
  }

  function handleDeleteCard(cardId) {
    if (!deck) return;
    if (typeof window !== "undefined" && window.confirm("Delete this card?")) {
      deleteCard(deck.id, cardId);
    }
  }

  if (!ready) {
    return (
      <>
        <DesktopHeader />
        <div className="mx-auto max-w-3xl flex-1 px-4 py-10 md:px-6">
          <p className="text-zinc-500 dark:text-zinc-400">Loading…</p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!deck) {
    return (
      <>
        <DesktopHeader />
        <div className="mx-auto max-w-3xl flex-1 px-4 py-10 md:px-6">
          <p className="text-zinc-600 dark:text-zinc-300">Deck not found.</p>
          <Link
            href="/"
            className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 font-semibold text-white dark:bg-violet-500"
          >
            Back to decks
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <DesktopHeader />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            Back
          </button>
          <Link
            href={`/study/${deck.id}`}
            className="inline-flex min-h-11 items-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-md dark:bg-violet-500"
          >
            Study
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {deck.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {deck.cards.length} card{deck.cards.length === 1 ? "" : "s"} · created{" "}
          {deck.createdAt}
        </p>

        <form
          onSubmit={handleAdd}
          className="mt-8 flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-md dark:border-zinc-700 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            New card
          </h2>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Front
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={2}
              placeholder="Question or term"
              className="mt-1 min-h-12 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Back
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={2}
              placeholder="Answer or translation"
              className="mt-1 min-h-12 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </label>
          <button
            type="submit"
            disabled={!front.trim()}
            className="min-h-12 rounded-xl bg-violet-600 text-base font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500"
          >
            Add card
          </button>
        </form>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Cards
          </h2>
          {deck.cards.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No cards yet. Add your first card above.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {deck.cards.map((card) => (
                <li key={card.id}>
                  <FlashcardItem
                    card={card}
                    onEdit={(c) => setEditingCard(c)}
                    onDelete={handleDeleteCard}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {editingCard && (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-card-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2
              id="edit-card-title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Edit card
            </h2>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!deck) return;
                updateCard(deck.id, editingCard.id, editingCard.front, editingCard.back);
                setEditingCard(null);
              }}
            >
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Front
                <textarea
                  value={editingCard.front}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, front: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-base outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </label>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Back
                <textarea
                  value={editingCard.back}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, back: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-base outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
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
