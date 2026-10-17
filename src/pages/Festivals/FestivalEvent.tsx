import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { mockFilmEvents } from "../../data/mockFilmEvents";
import { mockMovies } from "../../data/mockMovies";
import { getPerson } from "../../data/movieCredits";
import styles from "./FestivalEvent.module.css";

export function FestivalEvent() {
  const { eventId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const event = mockFilmEvents.find((item) => item.id === eventId);
  const years = useMemo(
    () => event?.editions.map((edition) => edition.year).sort((first, second) => second - first) ?? [],
    [event],
  );
  const queryYear = Number(searchParams.get("year"));
  const initialYear = years.includes(queryYear) ? queryYear : years[0];
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const edition = event?.editions.find((item) => item.year === selectedYear);
  const categories = edition?.categories ?? [];
  const visibleCategories = categoryFilter === "all"
    ? categories
    : categories.filter((category) => category.id === categoryFilter);

  if (!event) {
    return <PageContainer><div className={styles.empty}><h1>Событие не найдено.</h1><Link to="/festivals">К фестивалям и премиям →</Link></div></PageContainer>;
  }

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setCategoryFilter("all");
    setSearchParams({ year: String(year) }, { replace: true });
  };

  return (
    <PageContainer>
      <div className={styles.page}>
        <Link className={styles.back} to="/festivals">← Фестивали и премии</Link>
        <header className={styles.hero} style={{ "--event-image": `url("${event.heroImage}")` } as React.CSSProperties}>
          <div className={styles.heroCopy}>
            <span className="eyebrow">{event.kind === "festival" ? "КИНОФЕСТИВАЛЬ" : "КИНОПРЕМИЯ"} · {event.location}</span>
            <h1>{event.name}<i>.</i></h1>
            <p>{event.description}</p>
            <span className={styles.founded}>Основано в {event.founded ?? "неизвестном"} году · Архивных выпусков: {years.length}</span>
          </div>
        </header>

        <section className={styles.archive}>
          <div className={styles.archiveHeading}>
            <div><span className="eyebrow">АРХИВ ПО ГОДАМ</span><h2>Решения и открытия.</h2></div>
            <label>
              <span className="visually-hidden">Фильтр по категории</span>
              <select value={categoryFilter} onChange={(eventChange) => setCategoryFilter(eventChange.target.value)}>
                <option value="all">Все категории</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
          </div>
          {years.length > 0 ? (
            <>
              <nav aria-label="Выбрать год выпуска" className={styles.years}>
                {years.map((year) => (
                  <button aria-pressed={selectedYear === year} key={year} onClick={() => selectYear(year)} type="button">{year}</button>
                ))}
              </nav>
              {visibleCategories.length ? (
                <div className={styles.categories}>
                  {visibleCategories.map((category) => {
                    const participants = new Set(category.nominees.map((nominee) => `${nominee.movieId ?? ""}:${nominee.personId ?? ""}`));
                    if (category.winner) participants.add(`${category.winner.movieId ?? ""}:${category.winner.personId ?? ""}`);
                    return (
                      <article className={styles.category} key={category.id}>
                        <div className={styles.categoryTitle}>
                          <span>{category.winner ? "ОТМЕЧЕНЫ ЖЮРИ / АКАДЕМИЕЙ" : "НОМИНАЦИЯ"}</span>
                          <h3>{category.name}</h3>
                        </div>
                        <div className={styles.nominees}>
                          {[...participants].map((key) => {
                            const [movieId, personId] = key.split(":");
                            const movie = movieId ? mockMovies.find((item) => item.id === movieId) : undefined;
                            const person = personId ? getPerson(personId) : undefined;
                            const winner = Boolean(
                              (movieId && category.winner?.movieId === movieId) ||
                              (personId && category.winner?.personId === personId),
                            );
                            const content = movie
                              ? <Link className={`${styles.nominee} ${winner ? styles.winner : ""}`} key={key} to={`/movie/${movie.id}`}><span>{winner ? "ЛАУРЕАТ" : "ФИЛЬМ"}</span><strong>{movie.title}</strong><small>{movie.year} · ★ {movie.rating.toFixed(1)}</small></Link>
                              : person
                                ? <Link className={`${styles.nominee} ${winner ? styles.winner : ""}`} key={key} to={`/person/${person.id}`}><span>{winner ? "ЛАУРЕАТ" : "ПЕРСОНА"}</span><strong>{person.name}</strong><small>Участник категории</small></Link>
                                : null;
                            return content;
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.noResults}>Для этого года и категории записей нет.</p>
              )}
            </>
          ) : (
            <p className={styles.noResults}>Архив события пока не заполнен.</p>
          )}
          <p className={styles.disclaimer}>Представлена локальная выборка данных CineVault. Она не является полным официальным архивом номинантов.</p>
        </section>
      </div>
    </PageContainer>
  );
}
