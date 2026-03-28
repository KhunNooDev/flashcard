"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const deckId = typeof params?.id === "string" ? params.id : undefined;

  const isHome = pathname === "/";
  const isDeck = pathname?.startsWith("/deck/");
  const isStudy = pathname?.startsWith("/study/");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/90 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-center gap-3">
        <Link
          href="/"
          className={`flex min-h-14 min-w-[44px] flex-1 items-center justify-center rounded-xl text-base font-semibold transition ${
            isHome
              ? "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100"
              : "bg-zinc-100 text-zinc-700 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:active:bg-zinc-700"
          }`}
        >
          Decks
        </Link>
        {deckId && !isStudy && (
          <Link
            href={`/study/${deckId}`}
            className={`flex min-h-14 min-w-[44px] flex-1 items-center justify-center rounded-xl text-base font-semibold transition ${
              isDeck
                ? "bg-violet-600 text-white shadow-md dark:bg-violet-500"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            Study
          </Link>
        )}
        {deckId && isStudy && (
          <Link
            href={`/deck/${deckId}`}
            className="flex min-h-14 min-w-[44px] flex-1 items-center justify-center rounded-xl bg-zinc-100 text-base font-semibold text-zinc-700 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:active:bg-zinc-700"
          >
            Cards
          </Link>
        )}
      </div>
    </nav>
  );
}
