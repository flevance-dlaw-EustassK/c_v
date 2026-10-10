import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface CineVaultContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setRating: (id: string, rating: number) => void;
  ratings: Record<string, number>;
  watched: string[];
  toggleWatched: (id: string) => void;
  library: Record<string, "watching" | "watched" | "plan">;
  setLibraryStatus: (
    id: string,
    status: "watching" | "watched" | "plan",
  ) => void;
}

const CineVaultContext = createContext<CineVaultContextValue | null>(null);

function useSavedState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch (error) {
      console.error(`Не удалось прочитать сохранённые данные CineVault «${key}».`, error);
      return initial;
    }
  });
  const saveValue = useCallback((update: SetStateAction<T>) => setValue(update), []);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Не удалось сохранить данные CineVault «${key}».`, error);
    }
  }, [key, value]);

  return [value, saveValue];
}

export function CineVaultProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useSavedState<string[]>("cinevault:favorites", [
    "1",
    "2",
    "9",
    "19",
  ]);
  const [watched, setWatched] = useSavedState<string[]>("cinevault:watched", [
    "2",
    "9",
    "10",
    "13",
    "15",
  ]);
  const [ratings, setRatings] = useSavedState<Record<string, number>>(
    "cinevault:ratings",
    { "1": 4, "2": 5, "9": 5, "10": 4 },
  );
  const [library, setLibrary] = useSavedState<
    Record<string, "watching" | "watched" | "plan">
  >("cinevault:library-status", {
    "1": "watching",
    "2": "watched",
    "4": "plan",
    "8": "watched",
    "9": "watched",
    "10": "watched",
    "13": "watched",
    "15": "watched",
    "18": "plan",
  });
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const value = useMemo<CineVaultContextValue>(
    () => ({
      favorites,
      toggleFavorite: (id) =>
        setFavorites((items) =>
          items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
        ),
      isFavorite,
      setRating: (id, rating) => setRatings((items) => ({ ...items, [id]: rating })),
      ratings,
      watched,
      toggleWatched: (id) =>
        setWatched((items) =>
          items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
        ),
      library,
      setLibraryStatus: (id, status) =>
        setLibrary((items) => ({ ...items, [id]: status })),
    }),
    [favorites, isFavorite, library, ratings, setFavorites, setLibrary, setRatings, setWatched, watched],
  );

  return (
    <CineVaultContext.Provider value={value}>
      {children}
    </CineVaultContext.Provider>
  );
}

export function useCineVault() {
  const context = useContext(CineVaultContext);
  if (!context) throw new Error("useCineVault нужно использовать внутри CineVaultProvider.");
  return context;
}
