"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import DesktopHeader from "@/components/DesktopHeader";
import FlashcardFlip from "@/components/FlashcardFlip";
import { useAppData } from "@/context/app-data-context";
import type { CardStatus } from "@/lib/types";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const { ready, getDeck, setCardStatus } = useAppData();
  const deck = id ? getDeck(id) : undefined;

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const swipeLock = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const cards = deck?.cards ?? [];
  const total = cards.length;
  const current = total > 0 && index < total ? cards[index] : null;
  const progressPct =
    total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [id, deck?.id]);

  useEffect(() => {
    if (total > 0 && index >= total) setIndex(total - 1);
  }, [total, index]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => i + 1);
  }, []);

  const markAndNext = useCallback(
    (status: CardStatus) => {
      if (!deck || !current) return;
      setCardStatus(deck.id, current.id, status);
      if (index >= total - 1) {
        router.push(`/deck/${deck.id}`);
        return;
      }
      goNext();
    },
    [deck, current, index, total, goNext, router, setCardStatus],
  );

  const onRemembered = useCallback(() => {
    swipeLock.current = Date.now();
    markAndNext("mastered");
  }, [markAndNext]);

  const onNotRemembered = useCallback(() => {
    swipeLock.current = Date.now();
    markAndNext("learning");
  }, [markAndNext]);

  const onToggleFlip = useCallback(() => {
    if (Date.now() - swipeLock.current < 380) return;
    if (didSwipe.current) return;
    setFlipped((f) => !f);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    didSwipe.current = false;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy)) return;
    didSwipe.current = true;
    swipeLock.current = Date.now();
    if (dx > 0) onRemembered();
    else onNotRemembered();
    window.setTimeout(() => {
      didSwipe.current = false;
    }, 400);
  }

  if (!ready) {
    return (
      <>
        <DesktopHeader />
        <div className="mx-auto max-w-lg flex-1 px-4 py-10 md:px-6">
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
        <div className="mx-auto max-w-lg flex-1 px-4 py-10 md:px-6">
          <p className="text-zinc-600 dark:text-zinc-300">Deck not found.</p>
          <Link
            href="/"
            className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-violet-600 px-5 font-semibold text-white dark:bg-violet-500"
          >
            Home
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  if (total === 0) {
    return (
      <>
        <DesktopHeader />
        <div className="mx-auto max-w-lg flex-1 px-4 pb-28 pt-8 md:px-6 md:pb-10">
          <p className="text-center text-lg text-zinc-600 dark:text-zinc-300">
            Add cards to this deck before studying.
          </p>
          <Link
            href={`/deck/${deck.id}`}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-violet-600 text-base font-semibold text-white dark:bg-violet-500"
          >
            Go to deck
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <DesktopHeader />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-8">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => router.push(`/deck/${deck.id}`)}
            className="min-h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            Exit
          </button>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {deck.name}
          </span>
        </div>

        {current && (
          <>
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span>
                  Card {index + 1} / {total}
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-[width] duration-300 dark:bg-violet-400"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div
              className="flex flex-1 flex-col"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <FlashcardFlip
                front={current.front || "—"}
                back={current.back || "—"}
                flipped={flipped}
                onToggle={onToggleFlip}
                hint="Tap to flip · Swipe right: remembered · Swipe left: review again"
                className="w-full"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onNotRemembered}
                className="min-h-14 rounded-xl border-2 border-amber-200 bg-amber-50 text-base font-semibold text-amber-950 active:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100 dark:active:bg-amber-950/60"
              >
                Still learning
              </button>
              <button
                type="button"
                onClick={onRemembered}
                className="min-h-14 rounded-xl bg-emerald-600 text-base font-semibold text-white shadow-md active:bg-emerald-700 dark:bg-emerald-500 dark:active:bg-emerald-600"
              >
                Remembered
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Swipe left = still learning · Swipe right = remembered
            </p>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}
