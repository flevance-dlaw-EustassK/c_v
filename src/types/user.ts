export interface User {
  id: string;
  name: string;
  email: string;
}

export type LibraryStatus = "watching" | "plan" | "watched";

export interface UserMovieState {
  status?: LibraryStatus;
  isFavorite: boolean;
  userRating?: number;
  addedAt?: string;
  ratedAt?: string;
}

export interface ViewingHistoryEvent {
  id: string;
  movieId: string;
  watchedAt: string | null;
}

export interface UserCollection {
  id: string;
  name: string;
  movieIds: string[];
  createdAt: string;
}

export interface UserPreferences {
  reduceMotion: boolean;
  showViewingHistory: boolean;
}

export interface CineVaultState {
  version: 1;
  movies: Record<string, UserMovieState>;
  viewingHistory: ViewingHistoryEvent[];
  collections?: UserCollection[];
  preferences?: UserPreferences;
}
