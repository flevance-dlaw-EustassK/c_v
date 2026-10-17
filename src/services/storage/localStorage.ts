import type {
  CineVaultState,
  LibraryStatus,
  UserCollection,
  UserPreferences,
  UserMovieState,
  ViewingHistoryEvent,
} from "../../types/user";

export const CINEVAULT_STATE_KEY = "cinevault:user-state:v1";

const legacyKeys = [
  "cinevault:favorites",
  "cinevault:watched",
  "cinevault:ratings",
  "cinevault:library-status",
  "cinevault.library",
];
const validStatuses = new Set<LibraryStatus>(["watching", "plan", "watched"]);

function isLibraryStatus(value: unknown): value is LibraryStatus {
  return typeof value === "string" && validStatuses.has(value as LibraryStatus);
}

export interface LoadedCineVaultState {
  state: CineVaultState;
  legacyKeys: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function validateMovieState(value: unknown): value is UserMovieState {
  if (!isRecord(value) || typeof value.isFavorite !== "boolean") return false;
  return (
    (value.status === undefined || isLibraryStatus(value.status)) &&
    (value.userRating === undefined ||
      (typeof value.userRating === "number" &&
        Number.isInteger(value.userRating) &&
        value.userRating >= 1 &&
        value.userRating <= 5)) &&
    (value.addedAt === undefined || isValidDate(value.addedAt)) &&
    (value.ratedAt === undefined || isValidDate(value.ratedAt))
  );
}

function validateHistoryEvent(value: unknown): value is ViewingHistoryEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.movieId === "string" &&
    value.movieId.length > 0 &&
    (value.watchedAt === null || isValidDate(value.watchedAt))
  );
}

function validateCollection(value: unknown): value is UserCollection {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    Array.isArray(value.movieIds) &&
    value.movieIds.every((id) => typeof id === "string") &&
    isValidDate(value.createdAt)
  );
}

function validatePreferences(value: unknown): value is UserPreferences {
  return (
    isRecord(value) &&
    typeof value.reduceMotion === "boolean" &&
    typeof value.showViewingHistory === "boolean"
  );
}

export function validateCineVaultState(value: unknown): value is CineVaultState {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isRecord(value.movies) ||
    !Array.isArray(value.viewingHistory)
  ) {
    return false;
  }

  return (
    Object.entries(value.movies).every(
      ([movieId, movie]) => movieId.length > 0 && validateMovieState(movie),
    ) &&
    value.viewingHistory.every(validateHistoryEvent) &&
    (value.collections === undefined ||
      (Array.isArray(value.collections) && value.collections.every(validateCollection))) &&
    (value.preferences === undefined || validatePreferences(value.preferences))
  );
}

function createLegacyMovieState(
  movies: Record<string, UserMovieState>,
  movieId: string,
): UserMovieState {
  return (movies[movieId] ??= { isFavorite: false });
}

function parseLegacyValue(key: string): unknown {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return null;
    return JSON.parse(storedValue) as unknown;
  } catch (error) {
    console.error(`Не удалось прочитать старые данные CineVault «${key}».`, error);
    return null;
  }
}

function migrateLegacyState(): CineVaultState | null {
  const movies: Record<string, UserMovieState> = {};
  const watchedMovieIds = new Set<string>();
  const legacyLibraryMovieIds = new Set<string>();
  let foundLegacyData = false;

  const legacyCollection = parseLegacyValue("cinevault.library");
  if (Array.isArray(legacyCollection)) {
    foundLegacyData = true;
    for (const movie of legacyCollection) {
      if (!isRecord(movie) || typeof movie.id !== "string" || !movie.id) continue;
      const movieState = createLegacyMovieState(movies, movie.id);
      legacyLibraryMovieIds.add(movie.id);
      if (isLibraryStatus(movie.status)) {
        movieState.status = movie.status;
      }
      if (isValidDate(movie.addedAt)) movieState.addedAt = movie.addedAt;
    }
  }

  const legacyLibrary = parseLegacyValue("cinevault:library-status");
  if (isRecord(legacyLibrary)) {
    foundLegacyData = true;
    for (const [movieId, status] of Object.entries(legacyLibrary)) {
      if (!isLibraryStatus(status)) continue;
      createLegacyMovieState(movies, movieId).status = status;
    }
  }

  const legacyFavorites = parseLegacyValue("cinevault:favorites");
  if (Array.isArray(legacyFavorites)) {
    foundLegacyData = true;
    for (const movieId of legacyFavorites) {
      if (typeof movieId !== "string" || !movieId) continue;
      createLegacyMovieState(movies, movieId).isFavorite = true;
    }
  }

  const legacyRatings = parseLegacyValue("cinevault:ratings");
  if (isRecord(legacyRatings)) {
    foundLegacyData = true;
    for (const [movieId, rating] of Object.entries(legacyRatings)) {
      if (
        typeof rating !== "number" ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        continue;
      }
      createLegacyMovieState(movies, movieId).userRating = rating;
    }
  }

  const legacyWatched = parseLegacyValue("cinevault:watched");
  if (Array.isArray(legacyWatched)) {
    foundLegacyData = true;
    for (const movieId of legacyWatched) {
      if (typeof movieId !== "string" || !movieId) continue;
      watchedMovieIds.add(movieId);
      const movieState = createLegacyMovieState(movies, movieId);
      if (!movieState.status) movieState.status = "watched";
    }
  }

  for (const [movieId, movieState] of Object.entries(movies)) {
    if (movieState.status === "watched") watchedMovieIds.add(movieId);
  }
  for (const movieId of legacyLibraryMovieIds) {
    const movieState = movies[movieId];
    if (movieState && !movieState.status) movieState.status = "plan";
  }

  if (!foundLegacyData) return null;

  return {
    version: 1,
    movies,
    viewingHistory: [...watchedMovieIds].map((movieId) => ({
      id: `migrated-watched-${movieId}`,
      movieId,
      watchedAt: null,
    })),
  };
}

function hasKey(key: string): boolean {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Не удалось проверить сохранённые данные CineVault «${key}».`, error);
    return false;
  }
}

export function loadCineVaultState(fallback: CineVaultState): LoadedCineVaultState {
  try {
    const currentValue = window.localStorage.getItem(CINEVAULT_STATE_KEY);
    if (currentValue !== null) {
      try {
        const parsedValue: unknown = JSON.parse(currentValue);
        if (validateCineVaultState(parsedValue)) {
          return { state: parsedValue, legacyKeys: legacyKeys.filter(hasKey) };
        }
        console.error("Сохранённое состояние CineVault не соответствует версии схемы 1.");
      } catch (error) {
        console.error("Не удалось разобрать сохранённое состояние CineVault.", error);
      }
    }

    const migratedState = migrateLegacyState();
    return {
      state: migratedState ?? fallback,
      legacyKeys: migratedState ? legacyKeys.filter(hasKey) : [],
    };
  } catch (error) {
    console.error("Не удалось загрузить CineVault из локального хранилища.", error);
    return { state: fallback, legacyKeys: [] };
  }
}

export function persistCineVaultState(
  state: CineVaultState,
  oldKeysToRemove: string[] = [],
): boolean {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(CINEVAULT_STATE_KEY, serializedState);
    const verifiedState: unknown = JSON.parse(
      window.localStorage.getItem(CINEVAULT_STATE_KEY) ?? "null",
    );

    if (
      !validateCineVaultState(verifiedState) ||
      JSON.stringify(verifiedState) !== serializedState
    ) {
      console.error("Не удалось проверить сохранённое состояние CineVault.");
      return false;
    }

    for (const key of oldKeysToRemove) window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Не удалось сохранить состояние CineVault в локальном хранилище.", error);
    return false;
  }
}
