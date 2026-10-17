import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { Icon } from "../../components/ui/Icon/Icon";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { getMovieSearchText } from "../../data/movieCredits";
import { movieGenres } from "../../data/genres";
import { mockMovies } from "../../data/mockMovies";
import styles from "./Catalog.module.css";

export function Catalog() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("popular");
  useEffect(() => setQuery(searchParams.get("q") ?? ""), [searchParams]);
  const movies = useMemo(() => {
    const filtered = mockMovies.filter((movie) => {
      const search = getMovieSearchText(movie).toLocaleLowerCase("ru");
      return (
        (!query || search.includes(query.toLocaleLowerCase("ru"))) &&
        (!genre || movie.genres.includes(genre)) &&
        (!year || (year === "before" ? movie.year < 2000 : year === "older" ? movie.year < 2010 : year === "recent" ? movie.year >= 2015 : movie.year >= 2000 && movie.year < 2015)) &&
        (!rating || movie.rating >= Number(rating)) &&
        (!duration || (duration === "short" ? movie.duration < 110 : duration === "medium" ? movie.duration >= 110 && movie.duration < 150 : movie.duration >= 150)) &&
        (!country || movie.country?.toLocaleLowerCase("ru").includes(country.toLocaleLowerCase("ru")))
      );
    });
    if (sort === "rating") return filtered.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") return filtered.sort((a, b) => b.year - a.year);
    if (sort === "alphabetical") return filtered.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    return filtered;
  }, [query, genre, year, rating, duration, country, sort]);

  return (
    <PageContainer>
      <div className={styles.page}>
        <div className="eyebrow">БОЛЬШАЯ КИНОТЕКА</div>
        <div className={styles.titleLine}>
          <div><h1 className="page-heading">Фильмы<span>.</span></h1><p>Кино, которое хочется оставить себе.</p></div>
          <span className={styles.index}>КОЛЛЕКЦИЯ CINEVAULT&nbsp; · &nbsp;001—{String(movies.length).padStart(2, "0")}</span>
        </div>
        <div className={styles.toolbar}>
          <label className={styles.search}><Icon name="search" /><Input aria-label="Поиск фильмов каталога" onChange={(event) => setQuery(event.target.value)} placeholder="Название, режиссёр, жанр…" value={query} /></label>
          <Select aria-label="Фильтр жанра" onChange={(event) => setGenre(event.target.value)} value={genre}>
            <option value="">Все жанры</option>{movieGenres.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Select aria-label="Фильтр года" onChange={(event) => setYear(event.target.value)} value={year}><option value="">Любой год</option><option value="before">До 2000</option><option value="older">До 2010</option><option value="2010s">2010–2014</option><option value="recent">2015 и новее</option></Select>
          <Select aria-label="Минимальный рейтинг" onChange={(event) => setRating(event.target.value)} value={rating}><option value="">Любой рейтинг</option><option value="9">От 9.0</option><option value="8">От 8.0</option><option value="7">От 7.0</option></Select>
          <Select aria-label="Фильтр длительности" onChange={(event) => setDuration(event.target.value)} value={duration}><option value="">Любая длительность</option><option value="short">До 110 минут</option><option value="medium">110–150 минут</option><option value="long">От 150 минут</option></Select>
          <Select aria-label="Фильтр страны" onChange={(event) => setCountry(event.target.value)} value={country}><option value="">Любая страна</option>{["США", "Великобритания", "Южная Корея", "Канада"].map((item) => <option key={item}>{item}</option>)}</Select>
        </div>
        <div className={styles.results}>
          <span><strong>{movies.length}</strong> {query || genre || year || rating || duration || country ? "фильмов найдено" : "фильмов в коллекции"}</span>
          <label className={styles.sort}><span>СОРТИРОВКА</span><Select aria-label="Сортировка фильмов" onChange={(event) => setSort(event.target.value)} value={sort}><option value="popular">Популярные</option><option value="rating">Высокий рейтинг</option><option value="newest">Сначала новые</option><option value="alphabetical">По алфавиту</option></Select></label>
        </div>
        {movies.length ? (
          <div className={styles.grid}>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} showFavorite />)}</div>
        ) : (
          <div className={styles.empty}><span>04</span><h2>Такого кадра пока нет.</h2><p>Измените фильтры или поиск и попробуйте ещё раз.</p><button onClick={() => { setQuery(""); setGenre(""); setYear(""); setRating(""); setDuration(""); setCountry(""); }} type="button">Сбросить фильтры <Icon name="arrow" /></button></div>
        )}
      </div>
    </PageContainer>
  );
}
