import { Input } from "../../ui/Input/Input";
import { Select } from "../../ui/Select/Select";
import { movieGenres } from "../../../data/genres";
import styles from "./LibraryFilters.module.css";

interface LibraryFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
}

export function LibraryFilters({
  query,
  onQueryChange,
  sort,
  onSortChange,
  genre,
  onGenreChange,
}: LibraryFiltersProps) {
  return (
    <form aria-label="Фильтры фильмотеки" className={styles.filters} onSubmit={(event) => event.preventDefault()}>
      <label className={styles.search}><span className="visually-hidden">Поиск в коллекции</span><Input onChange={(event) => onQueryChange(event.target.value)} placeholder="Название, жанр, режиссёр…" value={query} /></label>
      <Select aria-label="Фильтр по жанру" onChange={(event) => onGenreChange(event.target.value)} value={genre}><option value="">Все жанры</option>{movieGenres.map((value) => <option key={value}>{value}</option>)}</Select>
      <Select aria-label="Сортировка фильмотеки" onChange={(event) => onSortChange(event.target.value)} value={sort}><option value="recent">Последние добавленные</option><option value="rating">Высокий рейтинг</option><option value="title">По названию</option><option value="year">По году</option></Select>
    </form>
  );
}
