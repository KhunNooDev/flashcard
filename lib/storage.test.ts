import { beforeEach, describe, expect, it } from "vitest";
import { loadData, saveData } from "@/lib/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loadData returns empty decks when nothing is stored", () => {
    expect(loadData()).toEqual({ decks: [] });
  });

  it("saveData and loadData round-trip valid data", () => {
    const data = {
      decks: [
        {
          id: "deck-1",
          name: "Test",
          createdAt: "2026-01-01",
          cards: [
            {
              id: "card-1",
              front: "a",
              back: "b",
              status: "new" as const,
            },
          ],
        },
      ],
    };
    saveData(data);
    expect(loadData()).toEqual(data);
  });

  it("loadData returns empty decks for invalid JSON", () => {
    localStorage.setItem("flashcard-app-data", "not-json");
    expect(loadData()).toEqual({ decks: [] });
  });

  it("loadData returns empty decks when decks is not an array", () => {
    localStorage.setItem("flashcard-app-data", JSON.stringify({ decks: {} }));
    expect(loadData()).toEqual({ decks: [] });
  });
});
