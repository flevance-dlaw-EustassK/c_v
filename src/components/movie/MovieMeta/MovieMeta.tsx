import type { Movie } from "../../../types/movie";

interface MovieMetaProps {
  movie: Pick<Movie, "year" | "duration" | "genres">;
  compact?: boolean;
}

export function MovieMeta({ movie, compact = false }: MovieMetaProps) {
  return (
    <p className="movie-meta">
      {movie.year} {!compact && `· ${movie.duration} мин.`} · {movie.genres.slice(0, compact ? 1 : 2).join(", ")}
    </p>
  );
}
