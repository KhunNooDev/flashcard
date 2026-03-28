"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppData, CardStatus, Deck, Flashcard } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";

type AppDataContextValue = {
  ready: boolean;
  data: AppData;
  decks: Deck[];
  getDeck: (id: string) => Deck | undefined;
  addDeck: (name: string) => string;
  updateDeck: (id: string, name: string) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, front: string, back: string) => void;
  updateCard: (
    deckId: string,
    cardId: string,
    front: string,
    back: string,
  ) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  setCardStatus: (
    deckId: string,
    cardId: string,
    status: CardStatus,
  ) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>({ decks: [] });

  useEffect(() => {
    const id = window.setTimeout(() => {
      setData(loadData());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveData(data);
  }, [data, ready]);

  const getDeck = useCallback(
    (id: string) => data.decks.find((d) => d.id === id),
    [data.decks],
  );

  const addDeck = useCallback((name: string) => {
    const id = newId("deck");
    const deck: Deck = {
      id,
      name: name.trim() || "Untitled deck",
      createdAt: todayISO(),
      cards: [],
    };
    setData((prev) => ({ decks: [...prev.decks, deck] }));
    return id;
  }, []);

  const updateDeck = useCallback((id: string, name: string) => {
    setData((prev) => ({
      decks: prev.decks.map((d) =>
        d.id === id ? { ...d, name: name.trim() || "Untitled deck" } : d,
      ),
    }));
  }, []);

  const deleteDeck = useCallback((id: string) => {
    setData((prev) => ({
      decks: prev.decks.filter((d) => d.id !== id),
    }));
  }, []);

  const addCard = useCallback((deckId: string, front: string, back: string) => {
    const card: Flashcard = {
      id: newId("card"),
      front: front.trim(),
      back: back.trim(),
      status: "new",
    };
    setData((prev) => ({
      decks: prev.decks.map((d) =>
        d.id === deckId ? { ...d, cards: [...d.cards, card] } : d,
      ),
    }));
  }, []);

  const updateCard = useCallback(
    (
      deckId: string,
      cardId: string,
      front: string,
      back: string,
    ) => {
      setData((prev) => ({
        decks: prev.decks.map((d) => {
          if (d.id !== deckId) return d;
          return {
            ...d,
            cards: d.cards.map((c) =>
              c.id === cardId
                ? { ...c, front: front.trim(), back: back.trim() }
                : c,
            ),
          };
        }),
      }));
    },
    [],
  );

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setData((prev) => ({
      decks: prev.decks.map((d) => {
        if (d.id !== deckId) return d;
        return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
      }),
    }));
  }, []);

  const setCardStatus = useCallback(
    (deckId: string, cardId: string, status: CardStatus) => {
      setData((prev) => ({
        decks: prev.decks.map((d) => {
          if (d.id !== deckId) return d;
          return {
            ...d,
            cards: d.cards.map((c) =>
              c.id === cardId ? { ...c, status } : c,
            ),
          };
        }),
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      data,
      decks: data.decks,
      getDeck,
      addDeck,
      updateDeck,
      deleteDeck,
      addCard,
      updateCard,
      deleteCard,
      setCardStatus,
    }),
    [
      ready,
      data,
      getDeck,
      addDeck,
      updateDeck,
      deleteDeck,
      addCard,
      updateCard,
      deleteCard,
      setCardStatus,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
