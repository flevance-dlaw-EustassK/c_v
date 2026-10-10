import { useState, type FormEvent } from "react";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { PickerForm } from "../../components/picker/PickerForm/PickerForm";
import { PickerResult } from "../../components/picker/PickerResult/PickerResult";
import { PickerStep } from "../../components/picker/PickerStep/PickerStep";
import { Select } from "../../components/ui/Select/Select";
import { mockMovies } from "../../data/mockMovies";
import type { Movie } from "../../types/movie";
import styles from "./Picker.module.css";

const genres = ["Фантастика", "Драма", "Триллер", "Боевик", "Комедия", "Детектив", "Приключения", "Криминал"];
const moods = ["Захватывающее", "Вдохновляющее", "Загадочное", "Лёгкое", "Задумчивое", "Напряжённое", "Мрачное", "Эпичное"];
const preferences = [{ value: "cult", label: "Культовое кино" }, { value: "surprise", label: "Найти неожиданный фильм" }, { value: "short", label: "Без долгих вступлений" }];

function matchesMood(movie: Movie, mood: string) {
  return !mood || movie.mood?.includes(mood);
}

export function Picker() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [duration, setDuration] = useState("any");
  const [year, setYear] = useState("any");
  const [rating, setRating] = useState(7);
  const [preference, setPreference] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [resultIndex, setResultIndex] = useState(0);
  const toggle = (items: string[], value: string) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullMatch = mockMovies.filter((movie) =>
      (!selectedGenres.length || selectedGenres.some((genre) => movie.genres.includes(genre))) &&
      matchesMood(movie, mood) &&
      (duration === "any" || (duration === "short" ? movie.duration <= 110 : duration === "medium" ? movie.duration <= 150 : movie.duration > 150)) &&
      (year === "any" || (year === "classic" ? movie.year < 2000 : year === "before-2010" ? movie.year < 2010 : year === "2010s" ? movie.year >= 2010 && movie.year < 2020 : movie.year >= 2020)) &&
      movie.rating >= rating &&
      (preference !== "cult" || movie.rating >= 8.7) &&
      (preference !== "short" || movie.duration <= 130) &&
      (preference !== "surprise" || movie.rating <= 8.5),
    );
    const acceptable = mockMovies.filter((movie) =>
      (!selectedGenres.length || selectedGenres.some((genre) => movie.genres.includes(genre))) &&
      matchesMood(movie, mood),
    );
    setResults(fullMatch.length ? fullMatch : acceptable.length ? acceptable : mockMovies);
    setResultIndex(0);
  };
  const selectedResult = results[resultIndex] ?? null;
  const relaxed = results.length > 0 && (
    !selectedResult ||
    selectedResult.rating < rating ||
    (duration === "short" && selectedResult!.duration > 110) ||
    (duration === "medium" && selectedResult!.duration > 150) ||
    (duration === "long" && selectedResult!.duration <= 150) ||
    (year === "classic" && selectedResult!.year >= 2000) ||
    (year === "before-2010" && selectedResult!.year >= 2010) ||
    (year === "2010s" && (selectedResult!.year < 2010 || selectedResult!.year >= 2020)) ||
    (year === "new" && selectedResult!.year < 2020) ||
    (preference === "cult" && selectedResult!.rating < 8.7) ||
    (preference === "surprise" && selectedResult!.rating > 8.5) ||
    (preference === "short" && selectedResult!.duration > 130)
  );

  return (
    <PageContainer>
      <div className={styles.page}>
        <header className={styles.heading}>
          <span className="eyebrow">ШЕСТЬ ВОПРОСОВ · ОДИН ХОРОШИЙ ВЕЧЕР</span>
          <h1>Что посмотрим<br />сегодня<span>?</span></h1>
          <p>Настройтесь на нужную волну. Мы найдём фильм, который совпадёт с вашим вечером.</p>
          <div className={styles.reel}><span /> <span /> <span /></div>
        </header>
        <div className={styles.intro}><span>01 <i>—</i> 06</span><p>Не нужно знать, чего именно хочется. Достаточно начать.</p><span className={styles.introRule} /></div>
        <PickerForm onSubmit={submit}>
          <PickerStep step="01" title="Какой жанр сегодня?">
            <div className={styles.options}>{genres.map((item) => <button aria-pressed={selectedGenres.includes(item)} className={`${styles.option} ${selectedGenres.includes(item) ? styles.active : ""}`} key={item} onClick={() => setSelectedGenres((current) => toggle(current, item))} type="button">{item}</button>)}</div>
          </PickerStep>
          <PickerStep step="02" title="Какое настроение?">
            <div className={styles.options}>{moods.slice(0, 6).map((item) => <button aria-pressed={mood === item} className={`${styles.option} ${mood === item ? styles.active : ""}`} key={item} onClick={() => setMood((current) => current === item ? "" : item)} type="button">{item}</button>)}</div>
          </PickerStep>
          <PickerStep step="03" title="Сколько у нас времени?">
            <div className={styles.options}>{[["any", "Как получится"], ["short", "До 1 ч 50 мин"], ["medium", "До 2 ч 30 мин"], ["long", "На весь вечер"]].map(([value, label]) => <button aria-pressed={duration === value} className={`${styles.option} ${duration === value ? styles.active : ""}`} key={value} onClick={() => setDuration(value)} type="button">{label}</button>)}</div>
          </PickerStep>
          <PickerStep step="04" title="Какое время ближе?">
            <div className={styles.options}>{[["any", "Неважно"], ["classic", "Классика · до 2000"], ["before-2010", "Нулевые"], ["2010s", "2010-е"], ["new", "Современное"]].map(([value, label]) => <button aria-pressed={year === value} className={`${styles.option} ${year === value ? styles.active : ""}`} key={value} onClick={() => setYear(value)} type="button">{label}</button>)}</div>
          </PickerStep>
          <PickerStep step="05" title="Какой уровень кино?">
            <div className={styles.ratingFilter}><label htmlFor="picker-rating">Не ниже <strong>{rating.toFixed(1)}</strong></label><Select aria-label="Минимальная оценка" id="picker-rating" onChange={(event) => setRating(Number(event.target.value))} value={rating}><option value={7}>7.0 — без предрассудков</option><option value={7.5}>7.5 — уверенное «да»</option><option value={8}>8.0 — наслышаны</option><option value={8.5}>8.5 — почти культовое</option></Select></div>
          </PickerStep>
          <PickerStep step="06" title="Что-нибудь особенное?">
            <div className={styles.options}>{preferences.map(({ value, label }) => <button aria-pressed={preference === value} className={`${styles.option} ${preference === value ? styles.active : ""}`} key={value} onClick={() => setPreference((current) => current === value ? "" : value)} type="button">{label}</button>)}</div>
          </PickerStep>
          <div className={styles.action}><span>Рекомендация появится прямо здесь. Всё без спойлеров.</span><button className={styles.submit} type="submit">Найти мой фильм <span>→</span></button></div>
        </PickerForm>
        {selectedResult && <PickerResult movie={selectedResult} onRefresh={() => setResultIndex((index) => (index + 1) % results.length)} relaxed={relaxed} />}
        <div className={styles.footnote}>CINEVAULT PICKER <span>—</span> КАЖДЫЙ ВЕЧЕР ЗАСЛУЖИВАЕТ СВОЙ ФИЛЬМ</div>
      </div>
    </PageContainer>
  );
}
