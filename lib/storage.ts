import type { AppData } from "./types";

const STORAGE_KEY = "flashcard-app-data";

export function loadData(): AppData {
  if (typeof window === "undefined") return { decks: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { decks: [] };
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed?.decks || !Array.isArray(parsed.decks)) return { decks: [] };
    return parsed;
  } catch {
    return { decks: [] };
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode
  }
}
