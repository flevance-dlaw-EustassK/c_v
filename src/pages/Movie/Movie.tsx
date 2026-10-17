import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCineVault } from "../../app/CineVaultProvider";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieMeta } from "../../components/movie/MovieMeta/MovieMeta";
import { MoviePoster } from "../../components/movie/MoviePoster/MoviePoster";
import { MovieRating } from "../../components/movie/MovieRating/MovieRating";
import { MovieRow } from "../../components/movie/MovieRow/MovieRow";
import { MovieCreditCard } from "../../components/movie/MovieCreditCard/MovieCreditCard";
import { Badge } from "../../components/ui/Badge/Badge";
import { Button } from "../../components/ui/Button/Button";
import { Icon } from "../../components/ui/Icon/Icon";
import { Modal } from "../../components/ui/Modal/Modal";
import { mockMovies } from "../../data/mockMovies";
import { getCrewByJob, getMovieAwards, getMovieCast, getMovieCrew, getMovieDirectorNames, getMovieStudios } from "../../data/movieCredits";
import styles from "./Movie.module.css";

export function Movie() {
  const { id } = useParams();
  const movie = mockMovies.find((item) => item.id === id);
  const {
    getMovieState,
    isFavorite,
    toggleFavorite,
    setRating,
    setLibraryStatus,
    collections,
    addMovieToCollection,
  } = useCineVault();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionFeedback, setCollectionFeedback] = useState("");

  if (!movie) {
    return <PageContainer><div className={styles.missing}><h1>Этот фильм ещё не снят.</h1><Link to="/catalog">Вернуться в каталог →</Link></div></PageContainer>;
  }

  const similarMovies = mockMovies
    .filter((item) => item.id !== movie.id && item.genres.some((genre) => movie.genres.includes(genre)))
    .slice(0, 7);
  const userMovieState = getMovieState(movie.id);
  const isWatched = userMovieState?.status === "watched";
  const userRating = userMovieState?.userRating ?? 0;
  const cast = getMovieCast(movie.id);
  const crew = getMovieCrew(movie.id);
  const directors = getMovieDirectorNames(movie.id);
  const directorCredits = crew.filter(({ job }) => job === "Режиссёр");
  const crewGroups = getCrewByJob(crew).filter(({ job }) => job !== "Режиссёр");
  const studios = getMovieStudios(movie.id);
  const awards = getMovieAwards(movie.id);

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
              <div className={styles.credits}><span>РЕЖИССЁР</span><strong>{directorCredits.length ? directorCredits.map(({ person }, index) => <span key={person.id}><Link to={`/person/${person.id}`}>{person.name}</Link>{index < directorCredits.length - 1 ? " · " : ""}</span>) : directors.join(" · ") || "Данные пока не указаны"}</strong></div>
              <div className={styles.genres}>{movie.genres.map((genre) => <Badge key={genre}>{genre}</Badge>)}</div>
              <div className={styles.actions}>
                <Button onClick={() => setLibraryStatus(movie.id, isWatched ? "plan" : "watched")} variant="primary" size="large"><Icon name={isWatched ? "check" : "play"} /> {isWatched ? "В планах" : "Смотрел"}</Button>
                <Button aria-pressed={isFavorite(movie.id)} onClick={() => toggleFavorite(movie.id)} size="large"><Icon name="heart" /> {isFavorite(movie.id) ? "В избранном" : "В избранное"}</Button>
                <Button onClick={() => setShowTrailer(true)} size="large"><Icon name="play" /> Трейлер</Button>
              </div>
              <div className={styles.collectionAction}>
                {collections.length ? <>
                  <label className="visually-hidden" htmlFor="add-to-collection">Добавить фильм в подборку</label>
                  <select id="add-to-collection" onChange={(event) => { setSelectedCollection(event.target.value); setCollectionFeedback(""); }} value={selectedCollection}>
                    <option value="">Ваша подборка…</option>
                    {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
                  </select>
                  <button disabled={!selectedCollection || collections.find((collection) => collection.id === selectedCollection)?.movieIds.includes(movie.id)} onClick={() => { addMovieToCollection(selectedCollection, movie.id); setCollectionFeedback("Фильм добавлен в подборку."); }} type="button">
                    {collections.find((collection) => collection.id === selectedCollection)?.movieIds.includes(movie.id) ? "Уже добавлен" : "Сохранить"}
                  </button>
                  {collectionFeedback && <small role="status">{collectionFeedback}</small>}
                </> : <Link to="/profile#collections">Создать подборку в профиле ↗</Link>}
              </div>
            </div>
            <div className={styles.userRating}><span>ВАША ОЦЕНКА</span><strong>{userRating ? `${userRating} / 5` : "Ещё не оценено"}</strong><MovieRating onChange={(rating) => setRating(movie.id, rating)} rating={movie.rating} value={userRating} /></div>
          </div>
        </div>
      </section>
      <PageContainer>
        <div className={styles.lower}>
          <section aria-labelledby="credits-title" className={styles.creditsSection}>
            <span className="eyebrow">ЗА КАДРОМ</span>
            <h2 id="credits-title">История ближе,<br />чем кажется.</h2>
            <div className={styles.creditGrid}>
              <div className={styles.peopleSection}>
                <span>В ГЛАВНЫХ РОЛЯХ</span>
                {cast.length ? <div className={styles.castRail}>{cast.map(({ person, character }) => <MovieCreditCard character={character} key={person.id} person={person} />)}</div> : <strong>Данные о составе пока не указаны.</strong>}
              </div>
              <div className={styles.peopleSection}>
                <span>СЪЁМОЧНАЯ ГРУППА</span>
                {crewGroups.length ? crewGroups.map(({ job, people }) => <div className={styles.creditRow} key={job}><span>{job}</span><strong>{people.map(({ person }, index) => <span key={person.id}><Link to={`/person/${person.id}`}>{person.name}</Link>{index < people.length - 1 ? " · " : ""}</span>)}</strong></div>) : <strong>Данные пока не указаны.</strong>}
              </div>
              <div><span>ДЛИТЕЛЬНОСТЬ</span><strong>{Math.floor(movie.duration / 60)} ч {String(movie.duration % 60).padStart(2, "0")} мин</strong></div>
              <div><span>СТРАНА</span><strong>{movie.country ?? "Данные пока не указаны"}</strong></div>
              <div className={styles.peopleSection}><span>КИНОСТУДИИ</span>{studios.length ? <div className={styles.relatedLinks}>{studios.map((studio) => <Link key={studio.id} to={`/studio/${studio.id}`}>{studio.name} <span>↗</span></Link>)}</div> : <strong>Данные о студии пока не указаны.</strong>}</div>
            </div>
          </section>
          <section aria-labelledby="awards-title" className={styles.relatedSection}>
            <div className={styles.relatedHeading}><div><span className="eyebrow">ФЕСТИВАЛИ И ПРЕМИИ</span><h2 id="awards-title">Признание и контекст.</h2></div><Link to="/festivals">Исследовать архив ↗</Link></div>
            {awards.length ? <div className={styles.awardGrid}>{awards.map(({ event, edition, category, won }) => <Link className={styles.award} key={`${event.id}-${edition.year}-${category.id}`} to={`/festivals/${event.id}?year=${edition.year}`}><span>{event.kind === "festival" ? "ФЕСТИВАЛЬ" : "ПРЕМИЯ"} · {edition.year} · {won ? "ПОБЕДИТЕЛЬ" : "НОМИНАЦИЯ"}</span><strong>{category.name}</strong><small>{event.name} ↗</small></Link>)}</div> : <p className={styles.noAwards}>В локальном архиве пока нет подтверждённых записей об участии этого фильма. <Link to="/festivals">Открыть архив кинонаград →</Link></p>}
          </section>
          <section aria-label={`Кадры из фильма «${movie.title}»`} className={styles.gallery}>
            <div><span className="eyebrow">ВИЗУАЛЬНЫЙ АРХИВ</span><h2>В мире фильма.</h2></div>
            <div className={styles.galleryGrid}>{(movie.gallery?.length ? movie.gallery : [movie.backdrop]).map((image, index) => <figure key={image}><img alt={`Кадр ${index + 1} фильма «${movie.title}»`} loading="lazy" src={image} /><figcaption>ИЗОБРАЖЕНИЕ · {String(index + 1).padStart(2, "0")}</figcaption></figure>)}</div>
          </section>
          <MovieRow movies={similarMovies} title="Если понравилось это" favorites />
        </div>
      </PageContainer>
      {showTrailer && <Modal onClose={() => setShowTrailer(false)} title={`Трейлер · ${movie.title}`}><div className={styles.trailer}><span className={styles.trailerIcon}><Icon name="play" /></span><strong>{movie.originalTitle}</strong><small>Трейлер скоро появится</small><p>Эта демоверсия содержит только локальные макетные данные.</p></div></Modal>}
    </>
  );
}
