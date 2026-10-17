import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockUserState } from "../data/mockUserState";
import { loadCineVaultState, persistCineVaultState } from "../services/storage/localStorage";
import type {
  CineVaultState,
  LibraryStatus,
  UserCollection,
  UserPreferences,
  UserMovieState,
  ViewingHistoryEvent,
} from "../types/user";

interface CineVaultContextValue {
  state: CineVaultState;
  favorites: string[];
  watched: string[];
  ratings: Record<string, number>;
  library: Record<string, LibraryStatus>;
  viewingHistory: ViewingHistoryEvent[];
  collections: UserCollection[];
  preferences: UserPreferences;
  getMovieState: (movieId: string) => UserMovieState | undefined;
  isFavorite: (movieId: string) => boolean;
  addToLibrary: (movieId: string, status?: LibraryStatus) => void;
  setLibraryStatus: (
    movieId: string,
    status: LibraryStatus | null,
    watchedAt?: string | null,
  ) => void;
  removeFromLibrary: (movieId: string) => void;
  toggleFavorite: (movieId: string) => void;
  setRating: (movieId: string, rating: number | null) => void;
  registerViewing: (movieId: string, watchedAt?: string | null) => void;
  createCollection: (name: string) => void;
  deleteCollection: (collectionId: string) => void;
  addMovieToCollection: (collectionId: string, movieId: string) => void;
  removeMovieFromCollection: (collectionId: string, movieId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const CineVaultContext = createContext<CineVaultContextValue | null>(null);
const defaultPreferences: UserPreferences = {
  reduceMotion: false,
  showViewingHistory: true,
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function updateMovie(
  state: CineVaultState,
  movieId: string,
  update: (current: UserMovieState) => UserMovieState,
): CineVaultState {
  if (!movieId) return state;
  const current = state.movies[movieId] ?? { isFavorite: false };
  const nextMovie = update(current);
  const movies = { ...state.movies };

  if (
    !nextMovie.status &&
    !nextMovie.isFavorite &&
    nextMovie.userRating === undefined
  ) {
    delete movies[movieId];
  } else {
    movies[movieId] = nextMovie;
  }

  return { ...state, movies };
}

function createViewingEvent(movieId: string, watchedAt: string | null) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${movieId}-${Date.now()}-${performance.now()}`;

  return { id, movieId, watchedAt };
}

export function CineVaultProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => loadCineVaultState(mockUserState));
  const [state, setState] = useState(loaded.state);
  const collections = state.collections ?? [];
  const preferences = state.preferences ?? defaultPreferences;

  useEffect(() => {
    persistCineVaultState(state, loaded.legacyKeys);
  }, [loaded.legacyKeys, state]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
  }, [preferences.reduceMotion]);

  const getMovieState = useCallback(
    (movieId: string) => state.movies[movieId],
    [state.movies],
  );
  const isFavorite = useCallback(
    (movieId: string) => state.movies[movieId]?.isFavorite === true,
    [state.movies],
  );
  const setLibraryStatus = useCallback(
    (movieId: string, status: LibraryStatus | null, watchedAt?: string | null) => {
      const viewingEvent =
        status === "watched"
          ? createViewingEvent(
              movieId,
              watchedAt === undefined ? new Date().toISOString() : watchedAt,
            )
          : null;
      const addedAt = new Date().toISOString();
      setState((current) => {
        const previousStatus = current.movies[movieId]?.status;
        const nextState = updateMovie(current, movieId, (movie) => {
          const nextMovie = { ...movie };
          if (status) {
            nextMovie.status = status;
            nextMovie.addedAt ??= addedAt;
          } else {
            delete nextMovie.status;
            delete nextMovie.addedAt;
          }
          return nextMovie;
        });

        if (
          status !== "watched" ||
          previousStatus === "watched" ||
          !viewingEvent
        ) {
          return nextState;
        }
        return {
          ...nextState,
          viewingHistory: [...nextState.viewingHistory, viewingEvent],
        };
      });
    },
    [],
  );
  const addToLibrary = useCallback(
    (movieId: string, status: LibraryStatus = "plan") => {
      setLibraryStatus(movieId, status);
    },
    [setLibraryStatus],
  );
  const removeFromLibrary = useCallback(
    (movieId: string) => setLibraryStatus(movieId, null),
    [setLibraryStatus],
  );
  const toggleFavorite = useCallback((movieId: string) => {
    setState((current) =>
      updateMovie(current, movieId, (movie) => ({
        ...movie,
        isFavorite: !movie.isFavorite,
      })),
    );
  }, []);
  const setRating = useCallback((movieId: string, rating: number | null) => {
    if (
      rating !== null &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      console.error("Оценка фильма должна быть целым числом от 1 до 5.");
      return;
    }

    const ratedAt = rating === null ? null : new Date().toISOString();
    setState((current) =>
      updateMovie(current, movieId, (movie) => {
        const nextMovie = { ...movie };
        if (rating === null) {
          delete nextMovie.userRating;
          delete nextMovie.ratedAt;
        } else {
          nextMovie.userRating = rating;
          nextMovie.ratedAt = ratedAt ?? undefined;
        }
        return nextMovie;
      }),
    );
  }, []);
  const registerViewing = useCallback(
    (movieId: string, watchedAt: string | null = new Date().toISOString()) => {
      if (!movieId) return;
      const viewingEvent = createViewingEvent(movieId, watchedAt);
      const addedAt = new Date().toISOString();
      setState((current) => {
        const nextState = updateMovie(current, movieId, (movie) => ({
          ...movie,
          status: "watched",
          addedAt: movie.addedAt ?? addedAt,
        }));
        return {
          ...nextState,
          viewingHistory: [...nextState.viewingHistory, viewingEvent],
        };
      });
    },
    [],
  );
  const createCollection = useCallback((name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    const collection: UserCollection = {
      id: createId(),
      name: normalizedName.slice(0, 48),
      movieIds: [],
      createdAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      collections: [...(current.collections ?? []), collection],
    }));
  }, []);
  const deleteCollection = useCallback((collectionId: string) => {
    setState((current) => ({
      ...current,
      collections: (current.collections ?? []).filter(
        (collection) => collection.id !== collectionId,
      ),
    }));
  }, []);
  const addMovieToCollection = useCallback(
    (collectionId: string, movieId: string) => {
      if (!movieId) return;
      setState((current) => ({
        ...current,
        collections: (current.collections ?? []).map((collection) =>
          collection.id === collectionId &&
          !collection.movieIds.includes(movieId)
            ? { ...collection, movieIds: [...collection.movieIds, movieId] }
            : collection,
        ),
      }));
    },
    [],
  );
  const removeMovieFromCollection = useCallback(
    (collectionId: string, movieId: string) => {
      setState((current) => ({
        ...current,
        collections: (current.collections ?? []).map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                movieIds: collection.movieIds.filter((id) => id !== movieId),
              }
            : collection,
        ),
      }));
    },
    [],
  );
  const updatePreferences = useCallback(
    (nextPreferences: Partial<UserPreferences>) => {
      setState((current) => ({
        ...current,
        preferences: { ...(current.preferences ?? defaultPreferences), ...nextPreferences },
      }));
    },
    [],
  );
  const value = useMemo<CineVaultContextValue>(() => {
    const favorites: string[] = [];
    const watchedIds = new Set<string>();
    const ratings: Record<string, number> = {};
    const library: Record<string, LibraryStatus> = {};

    for (const [movieId, movie] of Object.entries(state.movies)) {
      if (movie.isFavorite) favorites.push(movieId);
      if (movie.userRating !== undefined) ratings[movieId] = movie.userRating;
      if (movie.status) library[movieId] = movie.status;
    }
    for (const event of state.viewingHistory) watchedIds.add(event.movieId);

    return {
      state,
      favorites,
      watched: [...watchedIds],
      ratings,
      library,
      viewingHistory: state.viewingHistory,
      collections,
      preferences,
      getMovieState,
      isFavorite,
      addToLibrary,
      setLibraryStatus,
      removeFromLibrary,
      toggleFavorite,
      setRating,
      registerViewing,
      createCollection,
      deleteCollection,
      addMovieToCollection,
      removeMovieFromCollection,
      updatePreferences,
    };
  }, [
    addToLibrary,
    addMovieToCollection,
    collections,
    createCollection,
    deleteCollection,
    getMovieState,
    isFavorite,
    registerViewing,
    removeMovieFromCollection,
    removeFromLibrary,
    setLibraryStatus,
    setRating,
    state,
    toggleFavorite,
    preferences,
    updatePreferences,
  ]);

  return (
    <CineVaultContext.Provider value={value}>
      {children}
    </CineVaultContext.Provider>
  );
}

export function useCineVault() {
  const context = useContext(CineVaultContext);
  if (!context) {
    throw new Error("useCineVault нужно использовать внутри CineVaultProvider.");
  }
  return context;
}
