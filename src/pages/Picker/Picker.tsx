import { useMemo, useState, type CSSProperties } from "react";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { PickerResult } from "../../components/picker/PickerResult/PickerResult";
import { movieGenres } from "../../data/genres";
import {
  ATMOSPHERE_CONTROLS,
  DEFAULT_PICKER_CRITERIA,
  getMoviePickerResults,
  PICKER_PRESETS,
} from "../../data/moviePicker";
import { mockMovies } from "../../data/mockMovies";
import type { MoviePickerCriteria } from "../../types/picker";
import styles from "./Picker.module.css";

const companyOptions = [
  { value: "solo", label: "Наедине" },
  { value: "duo", label: "Вдвоём" },
  { value: "friends", label: "С друзьями" },
  { value: "family", label: "С близкими" },
] as const;

const atmosphereColors = ["#a87960", "#a36b55", "#9b5949", "#95473e", "#8b3431"];

function getAtmosphereAverage(criteria: MoviePickerCriteria) {
  const values = Object.values(criteria.atmosphere);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMovieCount(count: number) {
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} фильмов`;
  if (count % 10 === 1) return `${count} фильм`;
  if (count % 10 >= 2 && count % 10 <= 4) return `${count} фильма`;
  return `${count} фильмов`;
}

export function Picker() {
  const [criteria, setCriteria] = useState(DEFAULT_PICKER_CRITERIA);
  const [activePreset, setActivePreset] = useState("");
  const [resultOffset, setResultOffset] = useState(0);
  const results = useMemo(
    () => getMoviePickerResults(mockMovies, criteria),
    [criteria],
  );
  const hasCustomAtmosphere = ATMOSPHERE_CONTROLS.some(
    ({ key }) => criteria.atmosphere[key] !== 3,
  );
  const softResetOptions = useMemo(() => {
    const options: Array<{
      label: string;
      criteria: MoviePickerCriteria;
    }> = [];
    if (criteria.genres.length > 0) {
      options.push({
        label: `Убрать жанр «${criteria.genres[0]}»`,
        criteria: { ...criteria, genres: [] },
      });
    }
    if (criteria.company) {
      options.push({
        label: "Не учитывать компанию",
        criteria: { ...criteria, company: "" },
      });
    }
    if (criteria.preference) {
      options.push({
        label: "Снять особое условие",
        criteria: { ...criteria, preference: "" },
      });
    }
    if (hasCustomAtmosphere) {
      options.push({
        label: "Вернуть микшер к нейтральному",
        criteria: {
          ...criteria,
          atmosphere: {
            tension: 3,
            complexity: 3,
            emotionalTone: 3,
            pace: 3,
          },
        },
      });
    }
    const usefulOptions = options.filter(
      (option) => getMoviePickerResults(mockMovies, option.criteria).length > 0,
    );
    if (usefulOptions.length > 0) return usefulOptions;

    const allSoftCriteriaReset: MoviePickerCriteria = {
      ...criteria,
      atmosphere: {
        tension: 3,
        complexity: 3,
        emotionalTone: 3,
        pace: 3,
      },
      genres: [],
      company: "",
      preference: "",
    };
    return getMoviePickerResults(mockMovies, allSoftCriteriaReset).length > 0
      ? [{ label: "Снять все мягкие условия", criteria: allSoftCriteriaReset }]
      : [];
  }, [criteria, hasCustomAtmosphere]);
  const accent = atmosphereColors[Math.round(getAtmosphereAverage(criteria)) - 1];
  const mixerStyle = { "--mixer-accent": accent } as CSSProperties;
  const visibleResults = Array.from(
    { length: Math.min(3, results.length) },
    (_, index) => results[(resultOffset + index) % results.length],
  );

  const updateCriteria = (update: (current: MoviePickerCriteria) => MoviePickerCriteria) => {
    setCriteria(update);
    setActivePreset("");
    setResultOffset(0);
  };

  const applyPreset = (presetId: string) => {
    const preset = PICKER_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    setCriteria({
      ...preset.criteria,
      atmosphere: { ...preset.criteria.atmosphere },
      genres: [...preset.criteria.genres],
    });
    setActivePreset(presetId);
    setResultOffset(0);
  };

  return (
    <PageContainer>
      <div className={styles.page}>
        <header className={styles.heading}>
          <span className="eyebrow">CINEVAULT · ПОДБОР ДЛЯ ВАШЕГО ВЕЧЕРА</span>
          <h1>Соберём<br />атмосферу<span>.</span></h1>
          <p>Настройте настроение — подберём кино из каталога, которое ему соответствует.</p>
        </header>

        <section aria-labelledby="mixer-title" className={styles.mixer} style={mixerStyle}>
          <div className={styles.mixerHeading}>
            <div>
              <span className="eyebrow">МИКШЕР АТМОСФЕРЫ</span>
              <h2 id="mixer-title">Какой будет этот фильм?</h2>
            </div>
            <span className={styles.liveCount} aria-live="polite" aria-atomic="true">
              <strong>{results.length}</strong>
              <small>ПОДХОДЯЩИХ ФИЛЬМОВ</small>
            </span>
          </div>

          <div className={styles.mixerGrid}>
            {ATMOSPHERE_CONTROLS.map(({ key, title, labels }) => {
              const value = criteria.atmosphere[key];
              return (
                <label className={styles.rangeControl} key={key}>
                  <span className={styles.rangeTitle}>
                    <span>{title}</span>
                    <output htmlFor={`mixer-${key}`}>{labels[value - 1]}</output>
                  </span>
                  <input
                    aria-label={title}
                    id={`mixer-${key}`}
                    max={5}
                    min={1}
                    onChange={(event) => {
                      const nextValue = Number(event.currentTarget.value);
                      updateCriteria((current) => ({
                        ...current,
                        atmosphere: { ...current.atmosphere, [key]: nextValue },
                      }));
                    }}
                    style={{ "--range-progress": `${((value - 1) / 4) * 100}%` } as CSSProperties}
                    type="range"
                    value={value}
                  />
                  <span className={styles.rangeLabels} aria-hidden="true">
                    <span>{labels[0]}</span><span>{labels[4]}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <p className={styles.scaleNote}>Оценки CineVault по шкале от 1 до 5. В результатах среднее отклонение от ваших настроек — не больше одного деления.</p>

          <div className={styles.presets}>
            <span className={styles.presetsLabel}>БЫСТРЫЙ ВЫБОР</span>
            <div className={styles.presetRail} aria-label="Готовые сценарии просмотра">
              {PICKER_PRESETS.map((preset) => (
                <button
                  aria-pressed={activePreset === preset.id}
                  className={activePreset === preset.id ? styles.presetActive : ""}
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <details className={styles.filters}>
          <summary>
            <span>Жанр, время и другие условия</span>
            <span aria-hidden="true" className={styles.summaryIcon}>+</span>
          </summary>
          <div className={styles.filterGrid}>
            <label>
              <span>ЖАНР</span>
              <select
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  updateCriteria((current) => ({
                    ...current,
                    genres: value ? [value] : [],
                  }));
                }}
                value={criteria.genres[0] ?? ""}
              >
                <option value="">Любой жанр</option>
                {movieGenres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
              </select>
            </label>
            <label>
              <span>КОМПАНИЯ</span>
              <select
                onChange={(event) => {
                  const value = event.currentTarget.value as MoviePickerCriteria["company"];
                  updateCriteria((current) => ({ ...current, company: value }));
                }}
                value={criteria.company}
              >
                <option value="">Неважно</option>
                {companyOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label>
              <span>ДЛИТЕЛЬНОСТЬ</span>
              <select
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  updateCriteria((current) => ({
                    ...current,
                    durationLimit: value ? Number(value) : null,
                  }));
                }}
                value={criteria.durationLimit ?? ""}
              >
                <option value="">Не ограничена</option>
                <option value="90">До 1 ч 30 мин</option>
                <option value="120">До 2 часов</option>
                <option value="150">До 2 ч 30 мин</option>
              </select>
            </label>
            <label>
              <span>ЭПОХА</span>
              <select
                onChange={(event) => {
                  const value = event.currentTarget.value as MoviePickerCriteria["era"];
                  updateCriteria((current) => ({ ...current, era: value }));
                }}
                value={criteria.era}
              >
                <option value="any">Любая</option>
                <option value="classic">До 2000 года</option>
                <option value="2000s">2000-е</option>
                <option value="2010s">2010-е</option>
                <option value="recent">2020-е</option>
              </select>
            </label>
            <label>
              <span>РЕЙТИНГ НЕ НИЖЕ</span>
              <select
                onChange={(event) => {
                  const value = Number(event.currentTarget.value);
                  updateCriteria((current) => ({ ...current, minRating: value }));
                }}
                value={criteria.minRating}
              >
                <option value="7">7.0</option>
                <option value="7.5">7.5</option>
                <option value="8">8.0</option>
                <option value="8.5">8.5</option>
                <option value="9">9.0</option>
              </select>
            </label>
            <label>
              <span>ОСОБОЕ УСЛОВИЕ</span>
              <select
                onChange={(event) => {
                  const value = event.currentTarget.value as MoviePickerCriteria["preference"];
                  updateCriteria((current) => ({ ...current, preference: value }));
                }}
                value={criteria.preference}
              >
                <option value="">Нет</option>
                <option value="cult">Высокий рейтинг · от 8.7</option>
                <option value="surprise">Необычный сюжет</option>
                <option value="short">До 130 минут</option>
              </select>
            </label>
          </div>
          {criteria.company && <p className={styles.filterNote}>Компания учитывается по жанровым предпочтениям каталога, не по возрастному рейтингу.</p>}
        </details>

        <section aria-labelledby="results-title" className={styles.results}>
          <div className={styles.resultsHeading}>
            <div>
              <span className="eyebrow">ВАШИ ВАРИАНТЫ</span>
              <h2 id="results-title">Кино в вашем настроении.</h2>
            </div>
            <span className={styles.resultsCount}>{formatMovieCount(results.length)}</span>
          </div>

          {results.length ? (
            <>
              <PickerResult criteria={criteria} movies={visibleResults} />
              {results.length > 1 && (
                <div className={styles.more}>
                  <span>Показаны {visibleResults.length} из {formatMovieCount(results.length)}</span>
                  <button onClick={() => setResultOffset((current) => (current + 1) % results.length)} type="button">
                    Другие фильмы <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.empty}>
              <h3>Точного совпадения пока нет.</h3>
              <p>{softResetOptions.length > 0
                ? "Лимит времени, эпоха и минимальный рейтинг не меняются сами собой. Можно попробовать один из этих вариантов."
                : "В каталоге нет фильма, который подошёл бы под эти строгие ограничения. Попробуйте увеличить время, выбрать другую эпоху или снизить минимальный рейтинг."
              }</p>
              {softResetOptions.length > 0 && <div className={styles.emptyActions}>
                {softResetOptions.map((option) => <button key={option.label} onClick={() => updateCriteria(() => option.criteria)} type="button">{option.label}</button>)}
              </div>}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
