import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockMovies } from "../../../data/mockMovies";
import { getMovieSearchText } from "../../../data/movieCredits";
import type { Movie } from "../../../types/movie";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Input } from "../../ui/Input/Input";
import { MoviePoster } from "../../movie/MoviePoster/MoviePoster";
import styles from "./Search.module.css";

export function Search() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = query.trim()
    ? mockMovies.filter((movie) =>
        getMovieSearchText(movie)
          .toLocaleLowerCase("ru")
          .includes(query.trim().toLocaleLowerCase("ru")),
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (open) input.current?.focus();
    else {
      setQuery("");
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((wasOpen) => !wasOpen);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const goToMovie = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    setOpen(false);
  };

  return (
    <div className={styles.search}>
      <IconButton
        label="Открыть поиск фильмов"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Icon name="search" />
      </IconButton>
      {open && (
        <div className={styles.panel}>
          <div className={styles.inputLine}>
            <Icon name="search" />
            <Input
              aria-activedescendant={results[selected] ? `search-result-${results[selected].id}` : undefined}
              aria-autocomplete="list"
              aria-controls="search-results"
              autoComplete="off"
              onChange={(event) => { setQuery(event.target.value); setSelected(0); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") { event.preventDefault(); setSelected((index) => Math.min(index + 1, results.length - 1)); }
                if (event.key === "ArrowUp") { event.preventDefault(); setSelected((index) => Math.max(index - 1, 0)); }
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (results[selected]) goToMovie(results[selected]);
                  else if (query.trim()) { navigate(`/catalog?q=${encodeURIComponent(query.trim())}`); setOpen(false); }
                }
              }}
              placeholder="Фильм, жанр, режиссёр…"
              ref={input}
              role="combobox"
              value={query}
            />
            <span className={styles.shortcut}>ESC</span>
            <IconButton label="Закрыть поиск" onClick={() => setOpen(false)} type="button"><Icon name="close" /></IconButton>
          </div>
          {query && (
            <div aria-label="Результаты поиска" className={styles.results} id="search-results" role="listbox">
              {results.length ? results.map((movie, index) => (
                <button
                  aria-selected={selected === index}
                  className={styles.result}
                  id={`search-result-${movie.id}`}
                  key={movie.id}
                  onClick={() => goToMovie(movie)}
                  onMouseEnter={() => setSelected(index)}
                  role="option"
                  type="button"
                >
                  <MoviePoster alt="" src={movie.poster} />
                  <span><strong>{movie.title}</strong><small>{movie.originalTitle} · {movie.year}</small></span>
                  <span className={styles.resultRating}>★ {movie.rating}</span>
                </button>
              )) : <p className={styles.empty}>Не нашли подходящих фильмов — попробуйте другой запрос.</p>}
              {!!results.length && <button className={styles.catalogLink} onClick={() => { navigate(`/catalog?q=${encodeURIComponent(query)}`); setOpen(false); }} type="button">Все результаты в каталоге <Icon name="arrow" /></button>}
            </div>
          )}
          {!query && <p className={styles.hint}>Попробуйте <button onClick={() => setQuery("Нолан")} type="button">Нолан</button> или «Interstellar» <span>Нажмите ↑↓ для выбора · Enter, чтобы открыть</span></p>}
        </div>
      )}
    </div>
  );
}
