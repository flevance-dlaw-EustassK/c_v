import { mockMovies } from "../data/mockMovies";
import { useCineVault } from "../app/CineVaultProvider";

export function useMovies() {
  const { library } = useCineVault();
  return {
    movies: mockMovies,
    libraryMovies: mockMovies.filter((movie) => library[movie.id]),
  };
}
