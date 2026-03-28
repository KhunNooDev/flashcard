export type CardStatus = "new" | "learning" | "mastered";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  status: CardStatus;
};

export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  cards: Flashcard[];
};

export type AppData = {
  decks: Deck[];
};
