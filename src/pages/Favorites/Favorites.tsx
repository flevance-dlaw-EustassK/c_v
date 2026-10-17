import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { Icon } from "../../components/ui/Icon/Icon";
import { Input } from "../../components/ui/Input/Input";
import { Select } from "../../components/ui/Select/Select";
import { useCineVault } from "../../app/CineVaultProvider";
import { mockMovies } from "../../data/mockMovies";
import { getMovieSearchText } from "../../data/movieCredits";
import styles from "./Favorites.module.css";

export function Favorites() {
  const { favorites } = useCineVault();
  const favoriteMovies = mockMovies.filter((movie) => favorites.includes(movie.id));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating");
  const movies = useMemo(() =>
    mockMovies.filter((movie) =>
      favorites.includes(movie.id) &&
      getMovieSearchText(movie)
        .toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")),
    ).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title, "ru") : sort === "year" ? b.year - a.year : b.rating - a.rating),
  [favorites, query, sort]);

  return (
    <PageContainer>
      <div className={styles.page}>
        <span className="eyebrow">САМЫЕ ДОРОГИЕ СЕРДЦУ</span>
        <div className={styles.heading}><div><h1 className="page-heading">Избранное<span>.</span></h1><p>Особенные истории, которые хочется сохранить.</p></div><span className={styles.edition}>ЛИЧНАЯ КОЛЛЕКЦИЯ&nbsp; · &nbsp;∞</span></div>
        {favoriteMovies.length ? (
          <>
            <div className={styles.toolbar}>
              <label><Icon name="search" /><Input aria-label="Поиск среди избранных" onChange={(event) => setQuery(event.target.value)} placeholder="Найти среди любимого…" value={query} /></label>
              <Select aria-label="Сортировка избранного" onChange={(event) => setSort(event.target.value)} value={sort}><option value="rating">Высокий рейтинг</option><option value="year">Год выхода</option><option value="title">По названию</option></Select>
              <span className={styles.count}><strong>{movies.length}</strong>&nbsp; фильмов</span>
            </div>
            {movies.length ? <div className={styles.grid}>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} showFavorite />)}</div> : (
              <div className={styles.empty}><h2>Пока не нашли.</h2><p>В избранном есть подходящий фильм, но он скрыт поиском. Попробуйте другой запрос.</p><button onClick={() => setQuery("")} type="button">Сбросить поиск</button></div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyArt}><Icon name="heart" /></span>
            <h2>Здесь хранятся любимые истории.</h2>
            <p>Добавляйте фильмы в избранное, нажав на сердечко у постера. Ваша коллекция останется с вами.</p>
            <Link to="/catalog">Найти, что добавить <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
