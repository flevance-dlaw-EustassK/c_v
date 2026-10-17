import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCineVault } from "../../app/CineVaultProvider";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MoviePoster } from "../../components/movie/MoviePoster/MoviePoster";
import { getMovieDirectorNames } from "../../data/movieCredits";
import { mockMovies } from "../../data/mockMovies";
import styles from "./Profile.module.css";

const movieById = new Map(mockMovies.map((movie) => [movie.id, movie]));

function formatDate(value: string | null | undefined) {
  if (!value) return "Дата неизвестна";
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getTopItems(counts: Map<string, number>, fallback: string) {
  const items = [...counts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([name]) => name);
  return items.length ? items.join(" · ") : fallback;
}

export function Profile() {
  const {
    state,
    favorites,
    library,
    viewingHistory,
    collections,
    preferences,
    createCollection,
    deleteCollection,
    removeMovieFromCollection,
    updatePreferences,
  } = useCineVault();
  const [collectionName, setCollectionName] = useState("");
  const submitCollection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!collectionName.trim()) return;
    createCollection(collectionName);
    setCollectionName("");
  };
  const ratedMovies = useMemo(
    () =>
      Object.entries(state.movies)
        .flatMap(([movieId, userMovie]) => {
          const movie = movieById.get(movieId);
          return movie && userMovie.userRating !== undefined
            ? [{ movie, rating: userMovie.userRating, ratedAt: userMovie.ratedAt }]
            : [];
        })
        .sort((first, second) => {
          if (!first.ratedAt) return second.ratedAt ? 1 : 0;
          if (!second.ratedAt) return -1;
          return Date.parse(second.ratedAt) - Date.parse(first.ratedAt);
        }),
    [state.movies],
  );
  const history = useMemo(
    () =>
      viewingHistory
        .flatMap((event) => {
          const movie = movieById.get(event.movieId);
          return movie ? [{ ...event, movie }] : [];
        })
        .sort((first, second) => {
          if (!first.watchedAt) return second.watchedAt ? 1 : 0;
          if (!second.watchedAt) return -1;
          return Date.parse(second.watchedAt) - Date.parse(first.watchedAt);
        }),
    [viewingHistory],
  );
  const average = ratedMovies.length
    ? (
        ratedMovies.reduce((sum, item) => sum + item.rating, 0) /
        ratedMovies.length
      ).toFixed(1)
    : "—";
  const watchedMovies = new Set(history.map((event) => event.movie.id));
  const favoriteMovies = mockMovies.filter((movie) => favorites.includes(movie.id));
  const genres = new Map<string, number>();
  const directors = new Map<string, number>();

  for (const { movie } of ratedMovies) {
    for (const genre of movie.genres) genres.set(genre, (genres.get(genre) ?? 0) + 1);
    for (const director of getMovieDirectorNames(movie.id)) {
      directors.set(director, (directors.get(director) ?? 0) + 1);
    }
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <span className="eyebrow">ВАША КИНОИСТОРИЯ</span>
        <section className={styles.identity}>
          <div aria-label="Аватар Андрея" className={styles.avatar}>А</div>
          <div className={styles.name}><span>ПОСМОТРИТЕ, СКОЛЬКО МЫ УЖЕ ВИДЕЛИ</span><h1>Андрей<span>.</span></h1><p>Личный профиль CineVault</p></div>
          <span className={styles.member}>ВАША КОЛЛЕКЦИЯ<br /><strong>{movieById.size} ФИЛЬМОВ В КАТАЛОГЕ</strong></span>
        </section>

        <div className={styles.stats}>
          {[{ amount: watchedMovies.size, label: "ФИЛЬМОВ ПРОСМОТРЕНО" }, { amount: mockMovies.filter((movie) => library[movie.id]).length, label: "В ЛИЧНОЙ КОЛЛЕКЦИИ" }, { amount: average, label: "СРЕДНЯЯ ОЦЕНКА" }].map(({ amount, label }, index) => (
            <article className={styles.stat} key={label}><span>0{index + 1} <i>—</i> {label}</span><strong>{amount}<small>{index === 2 ? (average === "—" ? "" : " / 5") : " фильм."}</small></strong><div /></article>
          ))}
        </div>

        <section aria-labelledby="genres-title" className={styles.taste}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ЧТО ОСТАЁТСЯ С ВАМИ</span><h2 id="genres-title">Ваш вкус. Ваши истории.</h2></div><p>Ваши отметки и оценки<br />помогают собрать эту картину.</p></div>
          <div className={styles.tasteGrid}>
            <article><span>01 &nbsp;ЛЮБИМЫЕ ЖАНРЫ</span><strong>{getTopItems(genres, "Оцените фильм, чтобы увидеть жанры")}</strong></article>
            <article><span>02 &nbsp;ЛЮБИМЫЕ РЕЖИССЁРЫ</span><strong>{getTopItems(directors, "Пока недостаточно оценок")}</strong></article>
            <article><span>03 &nbsp;СОХРАНИЛИ ДЛЯ СЕБЯ</span><strong>{favoriteMovies.length} <small>фильмов</small></strong></article>
          </div>
        </section>

        {preferences.showViewingHistory && <section aria-labelledby="history-title" className={styles.history}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ПОСЛЕДНИЕ ПРОСМОТРЫ</span><h2 id="history-title">Кино осталось с вами.</h2></div><span className={styles.note}>События хранятся только в этом браузере.</span></div>
          {history.length ? (
            <div className={styles.ratings}>
              {history.map((event) => (
                <article className={styles.ratingItem} key={event.id}>
                  <Link aria-label={`Открыть фильм «${event.movie.title}»`} className={styles.thumbnail} to={`/movie/${event.movie.id}`}><MoviePoster alt="" src={event.movie.poster} /></Link>
                  <Link className={styles.movieName} to={`/movie/${event.movie.id}`}><strong>{event.movie.title}</strong><small>{event.movie.year} · {getMovieDirectorNames(event.movie.id).join(", ") || "Съёмочная группа не указана"}</small></Link>
                  <span className={styles.date}>{formatDate(event.watchedAt)}</span>
                </article>
              ))}
            </div>
          ) : <p className={styles.empty}>Отметьте фильм как просмотренный, чтобы здесь появилась история.</p>}
        </section>}

        <section aria-labelledby="reviews-title" className={styles.history}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ВАШИ ОЦЕНКИ</span><h2 id="reviews-title">Оценили лично.</h2></div><span className={styles.note}>Оценки по шкале от 1 до 5.</span></div>
          {ratedMovies.length ? (
            <div className={styles.ratings}>
              {ratedMovies.map(({ movie, rating, ratedAt }) => (
                <article className={styles.ratingItem} key={movie.id}>
                  <Link aria-label={`Открыть фильм «${movie.title}»`} className={styles.thumbnail} to={`/movie/${movie.id}`}><MoviePoster alt="" src={movie.poster} /></Link>
                  <Link className={styles.movieName} to={`/movie/${movie.id}`}><strong>{movie.title}</strong><small>{movie.year} · {getMovieDirectorNames(movie.id).join(", ") || "Съёмочная группа не указана"}</small></Link>
                  <span aria-label={`Ваша оценка: ${rating} из 5`} className={styles.stars}>{Array.from({ length: 5 }, (_, index) => <span className={index < rating ? styles.starFilled : ""} key={index}>★</span>)}</span>
                  <span className={styles.date}>{formatDate(ratedAt)}</span>
                </article>
              ))}
            </div>
          ) : <p className={styles.empty}>Пока нет оценок. Откройте фильм в каталоге и поставьте свою.</p>}
        </section>

        <section aria-labelledby="collections-title" className={styles.collections} id="collections">
          <div className={styles.sectionHeading}><div><span className="eyebrow">ВАШ ЛИЧНЫЙ КИНОАРХИВ</span><h2 id="collections-title">Подборки по вашему сценарию.</h2></div><span className={styles.note}>Сохраняются в этом браузере.</span></div>
          <form className={styles.collectionForm} onSubmit={submitCollection}>
            <label className="visually-hidden" htmlFor="collection-name">Название подборки</label>
            <input id="collection-name" maxLength={48} onChange={(event) => setCollectionName(event.target.value)} placeholder="Например, «На выходные»" value={collectionName} />
            <button disabled={!collectionName.trim()} type="submit">Создать подборку <span>+</span></button>
          </form>
          {collections.length ? <div className={styles.collectionList}>{collections.map((collection) => {
            const movies = collection.movieIds.flatMap((movieId) => {
              const movie = movieById.get(movieId);
              return movie ? [movie] : [];
            });
            return <article className={styles.collection} key={collection.id}>
              <div className={styles.collectionHeading}><div><h3>{collection.name}</h3><span>{movies.length} {movies.length === 1 ? "фильм" : "фильмов"}</span></div><button aria-label={`Удалить подборку «${collection.name}»`} onClick={() => deleteCollection(collection.id)} type="button">Удалить</button></div>
              {movies.length ? <div className={styles.collectionMovies}>{movies.map((movie) => <div key={movie.id}><Link to={`/movie/${movie.id}`}><MoviePoster alt={movie.title} src={movie.poster} /></Link><button aria-label={`Убрать «${movie.title}» из подборки`} onClick={() => removeMovieFromCollection(collection.id, movie.id)} type="button">×</button></div>)}</div> : <p className={styles.empty}>Добавьте сюда фильмы со страницы фильма.</p>}
            </article>;
          })}</div> : <p className={styles.empty}>Создайте подборку и соберите фильмы для особого вечера.</p>}
        </section>

        <section aria-labelledby="preferences-title" className={styles.preferences}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ТОЛЬКО ДЛЯ ВАШЕГО КИНОТЕАТРА</span><h2 id="preferences-title">Пара настроек.</h2></div></div>
          <label><span><strong>Тихий кинорежим</strong><small>Уменьшает движение и эффекты на странице.</small></span><input aria-label="Тихий кинорежим" checked={preferences.reduceMotion} onChange={(event) => updatePreferences({ reduceMotion: event.target.checked })} type="checkbox" /></label>
          <label><span><strong>Остаться в истории</strong><small>Показывать ваши отметки «Посмотрел» в профиле.</small></span><input aria-label="Показывать историю просмотров" checked={preferences.showViewingHistory} onChange={(event) => updatePreferences({ showViewingHistory: event.target.checked })} type="checkbox" /></label>
          <div className={styles.privacy}><span>🔒</span> Настройки, оценки и избранное хранятся только в вашем браузере.</div>
        </section>
      </div>
    </PageContainer>
  );
}
