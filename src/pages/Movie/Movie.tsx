import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCineVault } from "../../app/CineVaultProvider";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieMeta } from "../../components/movie/MovieMeta/MovieMeta";
import { MoviePoster } from "../../components/movie/MoviePoster/MoviePoster";
import { MovieRating } from "../../components/movie/MovieRating/MovieRating";
import { MovieRow } from "../../components/movie/MovieRow/MovieRow";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Icon } from "../../components/ui/Icon/Icon";
import { Modal } from "../../components/ui/Modal/Modal";
import { mockMovies } from "../../data/mockMovies";
import styles from "./Movie.module.css";

export function Movie() {
  const { id } = useParams();
  const movie = mockMovies.find((item) => item.id === id);
  const { isFavorite, toggleFavorite, ratings, setRating, watched, toggleWatched, setLibraryStatus } = useCineVault();
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) {
    return <PageContainer><div className={styles.missing}><h1>Этот фильм ещё не снят.</h1><Link to="/catalog">Вернуться в каталог →</Link></div></PageContainer>;
  }

  const similarMovies = mockMovies
    .filter((item) => item.id !== movie.id && item.genres.some((genre) => movie.genres.includes(genre)))
    .slice(0, 7);
  const isWatched = watched.includes(movie.id);
  const userRating = ratings[movie.id] ?? 0;

  return (
    <>
      <section className={styles.backdrop} style={{ "--movie-backdrop": `url("${movie.backdrop}")` } as React.CSSProperties}>
        <div className={styles.backdropInner}>
          <div className={styles.backdropLabel}><span className="eyebrow">КОЛЛЕКЦИЯ CINEVAULT &nbsp;·&nbsp; ФИЛЬМ {movie.id.padStart(3, "0")}</span></div>
          <div className={styles.feature}>
            <div className={styles.poster}><MoviePoster alt={`Постер фильма «${movie.title}»`} loading="eager" src={movie.poster} /><span className={styles.posterNote}>C&nbsp;·&nbsp;VAULT</span></div>
            <div className={styles.details}>
              <span className={styles.original}>{movie.originalTitle}&nbsp; · &nbsp;{movie.country ?? "Мировое кино"}</span>
              <h1>{movie.title}</h1>
              <MovieMeta movie={movie} />
              <div className={styles.ratings}><span><strong>★</strong> {movie.rating.toFixed(1)} <small>оценка CineVault</small></span><span className={styles.separator} /><span className={styles.year}>{movie.year}</span></div>
              <p className={styles.description}>{movie.description}</p>
              <div className={styles.credits}><span>РЕЖИССЁР</span><strong>{movie.director}</strong></div>
              <div className={styles.genres}>{movie.genres.map((genre) => <Badge key={genre}>{genre}</Badge>)}</div>
              <div className={styles.actions}>
                <Button onClick={() => { toggleWatched(movie.id); setLibraryStatus(movie.id, isWatched ? "plan" : "watched"); }} variant="primary" size="large"><Icon name={isWatched ? "check" : "play"} /> {isWatched ? "Уже смотрели" : "Смотрел"}</Button>
                <Button aria-pressed={isFavorite(movie.id)} onClick={() => toggleFavorite(movie.id)} size="large"><Icon name="heart" /> {isFavorite(movie.id) ? "В избранном" : "В избранное"}</Button>
                <Button onClick={() => setShowTrailer(true)} size="large"><Icon name="play" /> Трейлер</Button>
              </div>
            </div>
            <div className={styles.userRating}><span>ВАША ОЦЕНКА</span><strong>{userRating ? `${userRating} / 5` : "Ещё не оценено"}</strong><MovieRating onChange={(rating) => setRating(movie.id, rating)} rating={movie.rating} value={userRating} /></div>
          </div>
        </div>
      </section>
      <PageContainer>
        <div className={styles.lower}>
          <section className={styles.creditsSection}><span className="eyebrow">ЗА КАДРОМ</span><h2>История ближе,<br />чем кажется.</h2><div className={styles.creditGrid}><div><span>В ГЛАВНЫХ РОЛЯХ</span><strong>{(movie.cast ?? [movie.director]).join(" · ")}</strong></div><div><span>СОЗДАТЕЛИ</span><strong>{movie.director} · {movie.country ?? "мировой кинематограф"}</strong></div><div><span>ДЛИТЕЛЬНОСТЬ</span><strong>{Math.floor(movie.duration / 60)} ч {String(movie.duration % 60).padStart(2, "0")} мин</strong></div></div></section>
          <MovieRow movies={similarMovies} title="Если понравилось это" favorites />
        </div>
      </PageContainer>
      {showTrailer && <Modal onClose={() => setShowTrailer(false)} title={`Трейлер · ${movie.title}`}><div className={styles.trailer}><span className={styles.trailerIcon}><Icon name="play" /></span><strong>{movie.originalTitle}</strong><small>Трейлер скоро появится</small><p>Эта демоверсия содержит только локальные макетные данные.</p></div></Modal>}
    </>
  );
}
