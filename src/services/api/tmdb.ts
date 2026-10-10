import type { Movie } from "../../types/movie";
import type { ApiClient } from "./client";

export function createTmdbService(_client: ApiClient) {
  return {
    async getMovie(_id: string): Promise<Movie> {
      throw new Error("Интеграция TMDB пока не настроена.");
    },
  };
}
