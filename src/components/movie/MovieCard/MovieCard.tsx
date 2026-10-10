import { Link } from "react-router-dom";
import { useCineVault } from "../../../app/CineVaultProvider";
import type { Movie } from "../../../types/movie";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { MovieMeta } from "../MovieMeta/MovieMeta";
import { MoviePoster } from "../MoviePoster/MoviePoster";
import { MovieRating } from "../MovieRating/MovieRating";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  showFavorite?: boolean;
}

export function MovieCard({ movie, showFavorite = false }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useCineVault();
  return (
    <article className={styles.card}>
      <div className={styles.artwork}>
        <Link aria-label={`Подробнее о фильме «${movie.title}»`} to={`/movie/${movie.id}`}>
          <MoviePoster alt={`Постер фильма «${movie.title}»`} src={movie.poster} />
        </Link>
        {showFavorite && (
          <IconButton
            aria-pressed={isFavorite(movie.id)}
            className={`${styles.favorite} ${isFavorite(movie.id) ? styles.isFavorite : ""}`}
            label={isFavorite(movie.id) ? "Убрать из избранного" : "В избранное"}
            onClick={() => toggleFavorite(movie.id)}
            type="button"
          >
            <Icon name="heart" />
          </IconButton>
        )}
        <div className={styles.hover}>
          <Link className={styles.details} to={`/movie/${movie.id}`}>
            <Icon name="play" /> Подробнее
          </Link>
          <p>{movie.description}</p>
        </div>
      </div>
      <div className={styles.information}>
        <div className={styles.nameLine}>
          <Link className={styles.title} to={`/movie/${movie.id}`}>{movie.title}</Link>
          <MovieRating rating={movie.rating} />
        </div>
        <MovieMeta compact movie={movie} />
      </div>
    </article>
  );
}
