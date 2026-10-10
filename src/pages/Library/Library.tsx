import { useMemo, useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { LibraryFilters } from "../../components/library/LibraryFilters/LibraryFilters";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import { useLibrary } from "../../hooks/useLibrary";
import styles from "./Library.module.css";

const tabs = [
  { id: "all", label: "Все" },
  { id: "watching", label: "Смотрю" },
  { id: "watched", label: "Посмотрел" },
  { id: "plan", label: "Хочу посмотреть" },
];

export function Library() {
  const { movies, library } = useLibrary();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("recent");
  const filtered = useMemo(() => {
    const filteredMovies = movies.filter((movie) =>
      (tab === "all" || library[movie.id] === tab) &&
      (!genre || movie.genres.includes(genre)) &&
      `${movie.title} ${movie.originalTitle} ${movie.director}`
        .toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")),
    );
    return filteredMovies.sort((a, b) =>
      sort === "rating" ? b.rating - a.rating :
      sort === "title" ? a.title.localeCompare(b.title, "ru") :
      sort === "year" ? b.year - a.year :
      Number(library[b.id] === "watching") - Number(library[a.id] === "watching"),
    );
  }, [genre, library, movies, query, sort, tab]);
  const countWatched = Object.values(library).filter((status) => status === "watched").length;
  const countPlan = Object.values(library).filter((status) => status === "plan").length;
  const countWatching = Object.values(library).filter((status) => status === "watching").length;

  return (
    <PageContainer>
      <div className={styles.page}>
        <span className="eyebrow">ЛИЧНАЯ КОЛЛЕКЦИЯ</span>
        <div className={styles.heading}><div><h1 className="page-heading">Моя фильмотека<span>.</span></h1><p>Кино, которому вы уже нашли место.</p></div><span className={styles.total}><strong>128</strong><small>ФИЛЬМОВ<br />В КОЛЛЕКЦИИ</small></span></div>
        <div className={styles.stats}>
          <div><span>ПОСМОТРЕЛИ</span><strong>{47 + Math.max(countWatched - 5, 0)}</strong><small><span style={{ width: `${Math.min(47 + Math.max(countWatched - 5, 0), 100) * 0.78}%` }} /></small></div>
          <div><span>БУДЕТ К ЧЕМУ ВЕРНУТЬСЯ</span><strong>{23 + Math.max(countPlan - 2, 0)}</strong><small><span style={{ width: "18%" }} /></small></div>
          <div><span>СЕЙЧАС СМОТРИТЕ</span><strong>{countWatching || "—"}</strong><small><span style={{ width: `${Math.max(countWatching * 12, 3)}%` }} /></small></div>
        </div>
        <div aria-label="Категории фильмов" className={styles.tabs} role="tablist">
          {tabs.map(({ id, label }) => <button aria-selected={tab === id} className={tab === id ? styles.active : ""} key={id} onClick={() => setTab(id)} role="tab" type="button">{label}<span>{id === "all" ? 128 + Object.keys(library).length - 9 : id === "watching" ? countWatching : id === "watched" ? 47 + Math.max(countWatched - 5, 0) : 23 + Math.max(countPlan - 2, 0)}</span></button>)}
        </div>
        <LibraryFilters genre={genre} onGenreChange={setGenre} onQueryChange={setQuery} onSortChange={setSort} query={query} sort={sort} />
        <p className={styles.count}><strong>{filtered.length}</strong> {tab === "all" ? "фильмов из вашей коллекции" : "фильмов в этом списке"}</p>
        {filtered.length ? <div className={styles.grid}>{filtered.map((movie) => <div className={styles.item} key={movie.id}><MovieCard movie={movie} showFavorite /><span className={`${styles.status} ${styles[library[movie.id]]}`}>{library[movie.id] === "watched" ? "Посмотрел" : library[movie.id] === "watching" ? "Смотрю" : "Хочу посмотреть"}</span></div>)}</div> : (
          <div className={styles.empty}><span>ВАШ СЛЕДУЮЩИЙ ФИЛЬМ ЖДЁТ</span><h2>Здесь пока тихо.</h2><p>Попробуйте изменить фильтры или загляните в каталог за новой историей.</p><Link to="/catalog">Перейти в каталог →</Link></div>
        )}
      </div>
    </PageContainer>
  );
}
