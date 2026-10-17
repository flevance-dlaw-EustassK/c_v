import { Link } from "react-router-dom";
import { MoviePoster } from "../../movie/MoviePoster/MoviePoster";
import { getMoviePickerReasons } from "../../../data/moviePicker";
import type { Movie } from "../../../types/movie";
import type { MoviePickerCriteria } from "../../../types/picker";
import styles from "./PickerResult.module.css";

interface PickerResultProps {
  movies: Movie[];
  criteria: MoviePickerCriteria;
}

export function PickerResult({ movies, criteria }: PickerResultProps) {
  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <article className={styles.movie} key={movie.id}>
          <Link aria-label={`Открыть фильм «${movie.title}»`} className={styles.poster} to={`/movie/${movie.id}`}>
            <MoviePoster alt={`Постер фильма «${movie.title}»`} src={movie.poster} />
          </Link>
          <div className={styles.info}>
            <div className={styles.meta}>
              <span>{movie.year}</span><span>{movie.duration} мин</span><span>★ {movie.rating.toFixed(1)}</span>
            </div>
            <h3><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h3>
            <p className={styles.genres}>{movie.genres.join(" · ")}</p>
            <p className={styles.reason}>{getMoviePickerReasons(movie, criteria).join(" · ") || "Близко к настроению, которое вы выбрали."}</p>
            <Link className={styles.detailsLink} to={`/movie/${movie.id}`}>О фильме <span>↗</span></Link>
          </div>
        </article>
      ))}
    </div>
  );
}
