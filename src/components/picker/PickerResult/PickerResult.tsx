import type { Movie } from "../../../types/movie";
import { Link } from "react-router-dom";
import { MoviePoster } from "../../movie/MoviePoster/MoviePoster";
import { MovieRating } from "../../movie/MovieRating/MovieRating";
import { Icon } from "../../ui/Icon/Icon";
import { Button } from "../../ui/Button/Button";
import styles from "./PickerResult.module.css";

interface PickerResultProps {
  movie: Movie | null;
  onRefresh: () => void;
  relaxed?: boolean;
}

export function PickerResult({ movie, onRefresh, relaxed = false }: PickerResultProps) {
  return movie ? (
    <section aria-label="Рекомендация для просмотра" className={styles.result}>
      <div className={styles.poster}><MoviePoster alt={`Постер фильма «${movie.title}»`} loading="eager" src={movie.poster} /></div>
      <div className={styles.details}>
        <span className="eyebrow">КАЖЕТСЯ, МЫ НАШЛИ ВАШ ФИЛЬМ</span>
        <h2>{movie.title}</h2>
        <span className={styles.original}>{movie.originalTitle} · {movie.year} · {movie.duration} мин.</span>
        <span className={styles.rating}><MovieRating rating={movie.rating} /> <span>CINEVAULT</span></span>
        <span className={styles.genres}>{movie.genres.join(" · ")}</span>
        <p>{movie.description}</p>
        {relaxed && <small className={styles.relaxed}>Точное совпадение не нашлось — выбрали фильм с подходящим настроением.</small>}
        <div className={styles.actions}>
          <Button to={`/movie/${movie.id}`} variant="primary" size="large"><Icon name="play" /> Посмотреть</Button>
          <Button onClick={onRefresh} size="large"><Icon name="arrow" /> Другой вариант</Button>
        </div>
      </div>
      <Link aria-label={`О фильме «${movie.title}»`} className={styles.posterLink} to={`/movie/${movie.id}`} />
    </section>
  ) : null;
}
