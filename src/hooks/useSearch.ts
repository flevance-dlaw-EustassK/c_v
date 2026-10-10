import { useMemo, useState } from "react";
import { mockMovies } from "../data/mockMovies";

export function useSearch() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  const results = useMemo(
    () =>
      mockMovies.filter((movie) =>
        `${movie.title} ${movie.originalTitle} ${movie.genres.join(" ")}`
          .toLocaleLowerCase("ru")
          .includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  return { query, setQuery, results };
}
