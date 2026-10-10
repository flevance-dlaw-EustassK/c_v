import { mockMovies } from "../data/mockMovies";
import { useCineVault } from "../app/CineVaultProvider";

export function useLibrary() {
  const { library, setLibraryStatus } = useCineVault();
  return {
    movies: mockMovies.filter((movie) => library[movie.id]),
    library,
    setLibraryStatus,
  };
}
