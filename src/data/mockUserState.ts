import type { CineVaultState } from "../types/user";

export const mockUserState: CineVaultState = {
  version: 1,
  movies: {
    "1": { status: "watching", isFavorite: true, userRating: 4 },
    "2": { status: "watched", isFavorite: true, userRating: 5 },
    "4": { status: "plan", isFavorite: false },
    "8": { status: "watched", isFavorite: false },
    "9": { status: "watched", isFavorite: true, userRating: 5 },
    "10": { status: "watched", isFavorite: false, userRating: 4 },
    "13": { status: "watched", isFavorite: false },
    "15": { status: "watched", isFavorite: false },
    "18": { status: "plan", isFavorite: false },
    "19": { isFavorite: true },
  },
  viewingHistory: [
    { id: "demo-viewing-2", movieId: "2", watchedAt: null },
    { id: "demo-viewing-9", movieId: "9", watchedAt: null },
    { id: "demo-viewing-10", movieId: "10", watchedAt: null },
    { id: "demo-viewing-13", movieId: "13", watchedAt: null },
    { id: "demo-viewing-15", movieId: "15", watchedAt: null },
  ],
};
