import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../../../types/movie";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { MovieCard } from "../MovieCard/MovieCard";
import styles from "./MovieRow.module.css";

interface MovieRowProps {
  movies: Movie[];
  title: string;
  favorites?: boolean;
  linkTo?: string;
}

export function MovieRow({ movies, title, favorites = false, linkTo }: MovieRowProps) {
  const row = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => row.current?.scrollBy({ left: direction * 460, behavior: "smooth" });
  return (
    <section aria-label={title} className={styles.section}>
      <div className={styles.heading}>
        <h2>{title}</h2>
        {linkTo ? <Link className={styles.seeAll} to={linkTo}>Смотреть всё ↗</Link> : (
          <div className={styles.controls}>
            <IconButton label="Прокрутить фильмы влево" onClick={() => scroll(-1)}><Icon name="back" /></IconButton>
            <IconButton label="Прокрутить фильмы вправо" onClick={() => scroll(1)}><Icon name="chevron" /></IconButton>
          </div>
        )}
      </div>
      <div ref={row} className={styles.rail}>
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} showFavorite={favorites} />)}
      </div>
    </section>
  );
}
