"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function DesktopHeader() {
  const pathname = usePathname();
  const params = useParams();
  const deckId = typeof params?.id === "string" ? params.id : undefined;
  const isHome = pathname === "/";
  const isDeck = pathname?.startsWith("/deck/");
  const isStudy = pathname?.startsWith("/study/");

  return (
    <header className="sticky top-0 z-40 hidden border-b border-zinc-200/90 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 md:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-violet-700 dark:text-violet-400"
        >
          Flashcards
        </Link>
        <nav className="flex items-center gap-2" aria-label="Desktop">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              isHome
                ? "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            Decks
          </Link>
          {deckId && !isStudy && (
            <Link
              href={`/study/${deckId}`}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                isDeck
                  ? "bg-violet-600 text-white dark:bg-violet-500"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Study
            </Link>
          )}
          {deckId && isStudy && (
            <Link
              href={`/deck/${deckId}`}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cards
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
