import { useMemo, useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { LibraryFilters } from "../../components/library/LibraryFilters/LibraryFilters";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import { getMovieSearchText } from "../../data/movieCredits";
import { useLibrary } from "../../hooks/useLibrary";
import styles from "./Library.module.css";

const tabs = [
  { id: "all", label: "Все" },
  { id: "watching", label: "Смотрю" },
  { id: "watched", label: "Посмотрел" },
  { id: "plan", label: "Хочу посмотреть" },
];

export function Library() {
  const { movies, library, setLibraryStatus } = useLibrary();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("recent");
  const filtered = useMemo(() => {
    const filteredMovies = movies.filter((movie) =>
      (tab === "all" || library[movie.id] === tab) &&
      (!genre || movie.genres.includes(genre)) &&
      getMovieSearchText(movie)
        .toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")),
    );
    return filteredMovies.sort((a, b) =>
      sort === "rating" ? b.rating - a.rating :
      sort === "title" ? a.title.localeCompare(b.title, "ru") :
      sort === "year" ? b.year - a.year :
      Number(library[b.id] === "watching") - Number(library[a.id] === "watching"),
    );
  }, [genre, library, movies, query, sort, tab]);
  const countWatched = movies.filter((movie) => library[movie.id] === "watched").length;
  const countPlan = movies.filter((movie) => library[movie.id] === "plan").length;
  const countWatching = movies.filter((movie) => library[movie.id] === "watching").length;
  const total = movies.length;

  return (
    <PageContainer>
      <div className={styles.page}>
        <span className="eyebrow">ЛИЧНАЯ КОЛЛЕКЦИЯ</span>
        <div className={styles.heading}><div><h1 className="page-heading">Моя фильмотека<span>.</span></h1><p>Кино, которому вы уже нашли место.</p></div><span className={styles.total}><strong>{total}</strong><small>ФИЛЬМОВ<br />В КОЛЛЕКЦИИ</small></span></div>
        <div className={styles.stats}>
          <div><span>ПОСМОТРЕЛИ</span><strong>{countWatched}</strong><small><span style={{ width: `${total ? (countWatched / total) * 100 : 0}%` }} /></small></div>
          <div><span>БУДЕТ К ЧЕМУ ВЕРНУТЬСЯ</span><strong>{countPlan}</strong><small><span style={{ width: `${total ? (countPlan / total) * 100 : 0}%` }} /></small></div>
          <div><span>СЕЙЧАС СМОТРИТЕ</span><strong>{countWatching}</strong><small><span style={{ width: `${total ? (countWatching / total) * 100 : 0}%` }} /></small></div>
        </div>
        <div aria-label="Категории фильмов" className={styles.tabs} role="tablist">
          {tabs.map(({ id, label }) => <button aria-selected={tab === id} className={tab === id ? styles.active : ""} key={id} onClick={() => setTab(id)} role="tab" type="button">{label}<span>{id === "all" ? total : id === "watching" ? countWatching : id === "watched" ? countWatched : countPlan}</span></button>)}
        </div>
        <LibraryFilters genre={genre} onGenreChange={setGenre} onQueryChange={setQuery} onSortChange={setSort} query={query} sort={sort} />
        <p className={styles.count}><strong>{filtered.length}</strong> {tab === "all" ? "фильмов из вашей коллекции" : "фильмов в этом списке"}</p>
        {filtered.length ? <div className={styles.grid}>{filtered.map((movie) => <div className={styles.item} key={movie.id}><MovieCard movie={movie} showFavorite /><label className={styles.statusControl}><span className={`${styles.status} ${styles[library[movie.id]]}`}>{library[movie.id] === "watched" ? "Посмотрел" : library[movie.id] === "watching" ? "Смотрю" : "Хочу посмотреть"}</span><select aria-label={`Изменить статус фильма «${movie.title}»`} className={styles.statusSelect} onChange={(event) => { const value = event.currentTarget.value; if (value === "watching" || value === "watched" || value === "plan") setLibraryStatus(movie.id, value); else setLibraryStatus(movie.id, null); }} value={library[movie.id]}><option value="watching">Смотрю</option><option value="plan">Хочу посмотреть</option><option value="watched">Посмотрел</option><option value="">Убрать из фильмотеки</option></select></label></div>)}</div> : (
          <div className={styles.empty}><span>ВАШ СЛЕДУЮЩИЙ ФИЛЬМ ЖДЁТ</span><h2>Здесь пока тихо.</h2><p>Попробуйте изменить фильтры или загляните в каталог за новой историей.</p><Link to="/catalog">Перейти в каталог →</Link></div>
        )}
      </div>
    </PageContainer>
  );
}
