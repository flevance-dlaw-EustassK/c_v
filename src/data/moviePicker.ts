import type { Movie } from "../types/movie";
import type {
  MovieAtmosphere,
  MoviePickerCriteria,
} from "../types/picker";

export const DEFAULT_PICKER_CRITERIA: MoviePickerCriteria = {
  atmosphere: {
    tension: 3,
    complexity: 3,
    emotionalTone: 3,
    pace: 3,
  },
  genres: [],
  company: "",
  durationLimit: null,
  era: "any",
  minRating: 7,
  preference: "",
};

export const ATMOSPHERE_CONTROLS: Array<{
  key: keyof MovieAtmosphere;
  title: string;
  labels: [string, string, string, string, string];
}> = [
  {
    key: "tension",
    title: "Напряжение",
    labels: ["Расслабленно", "Спокойно", "Умеренно", "Напряжённо", "Триллер"],
  },
  {
    key: "complexity",
    title: "Сложность сюжета",
    labels: ["Фоново", "Просто", "Умеренно", "Замысловато", "Головоломка"],
  },
  {
    key: "emotionalTone",
    title: "Эмоциональный тон",
    labels: ["Светло", "Оптимистично", "Сдержанно", "Мрачновато", "Тяжело"],
  },
  {
    key: "pace",
    title: "Темп повествования",
    labels: ["Неторопливо", "Спокойно", "Средне", "Бодро", "Динамично"],
  },
];

export const PICKER_PRESETS: Array<{
  id: string;
  label: string;
  criteria: MoviePickerCriteria;
}> = [
  {
    id: "friends",
    label: "Вечер с друзьями",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      company: "friends",
      atmosphere: { tension: 3, complexity: 2, emotionalTone: 2, pace: 4 },
    },
  },
  {
    id: "date",
    label: "Свидание",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      company: "duo",
      genres: ["Драма"],
      atmosphere: { tension: 2, complexity: 2, emotionalTone: 2, pace: 2 },
    },
  },
  {
    id: "thoughtful",
    label: "Задумчивый вечер",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      company: "solo",
      atmosphere: { tension: 3, complexity: 5, emotionalTone: 3, pace: 2 },
    },
  },
  {
    id: "surprise",
    label: "Хочу удивиться",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      preference: "surprise",
      atmosphere: { tension: 3, complexity: 5, emotionalTone: 3, pace: 4 },
    },
  },
  {
    id: "short",
    label: "Фильм на час",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      durationLimit: 120,
      atmosphere: { tension: 3, complexity: 2, emotionalTone: 3, pace: 4 },
    },
  },
  {
    id: "light",
    label: "Что-нибудь лёгкое",
    criteria: {
      ...DEFAULT_PICKER_CRITERIA,
      genres: ["Комедия"],
      atmosphere: { tension: 1, complexity: 1, emotionalTone: 1, pace: 3 },
    },
  },
];

const companyGenres: Record<Exclude<MoviePickerCriteria["company"], "">, string[]> = {
  solo: ["Драма", "Детектив", "Криминал", "Триллер", "Ужасы"],
  duo: ["Драма", "Комедия", "Приключения", "Спортивное кино"],
  friends: ["Боевик", "Комедия", "Приключения", "Спортивное кино", "Фантастика"],
  family: ["Комедия", "Приключения", "Спортивное кино", "Фантастика"],
};

const eraMatches: Record<Exclude<MoviePickerCriteria["era"], "any">, (year: number) => boolean> = {
  classic: (year) => year < 2000,
  "2000s": (year) => year >= 2000 && year < 2010,
  "2010s": (year) => year >= 2010 && year < 2020,
  recent: (year) => year >= 2020,
};

export function getMoviePickerResults(
  movies: Movie[],
  criteria: MoviePickerCriteria,
) {
  return movies
    .map((movie) => ({
      movie,
      atmosphereDistance: ATMOSPHERE_CONTROLS.reduce(
        (distance, control) =>
          distance +
          Math.abs(
            movie.atmosphere[control.key] - criteria.atmosphere[control.key],
          ),
        0,
      ),
    }))
    .filter(({ movie, atmosphereDistance }) => {
      const genreMatches =
        criteria.genres.length === 0 ||
        criteria.genres.some((genre) => movie.genres.includes(genre));
      const selectedCompany = criteria.company;
      const companyMatches =
        selectedCompany === "" ||
        movie.genres.some((genre) => companyGenres[selectedCompany].includes(genre));
      const durationMatches =
        criteria.durationLimit === null || movie.duration <= criteria.durationLimit;
      const eraMatchesSelection =
        criteria.era === "any" || eraMatches[criteria.era](movie.year);
      const ratingMatches = movie.rating >= criteria.minRating;
      const preferenceMatches =
        (criteria.preference !== "cult" || movie.rating >= 8.7) &&
        (criteria.preference !== "surprise" || movie.atmosphere.complexity >= 4) &&
        (criteria.preference !== "short" || movie.duration <= 130);

      return (
        atmosphereDistance <= ATMOSPHERE_CONTROLS.length &&
        genreMatches &&
        companyMatches &&
        durationMatches &&
        eraMatchesSelection &&
        ratingMatches &&
        preferenceMatches
      );
    })
    .sort(
      (first, second) =>
        first.atmosphereDistance - second.atmosphereDistance ||
        second.movie.rating - first.movie.rating,
    )
    .map(({ movie }) => movie);
}

export function getMoviePickerReasons(
  movie: Movie,
  criteria: MoviePickerCriteria,
) {
  const reasons = ATMOSPHERE_CONTROLS.flatMap((control) => {
    const distance = Math.abs(
      movie.atmosphere[control.key] - criteria.atmosphere[control.key],
    );
    return distance <= 1
      ? [`${control.title.toLocaleLowerCase("ru")}: ${control.labels[criteria.atmosphere[control.key] - 1].toLocaleLowerCase("ru")}`]
      : [];
  });
  const matchingGenres = movie.genres.filter((genre) =>
    criteria.genres.includes(genre),
  );
  if (matchingGenres.length) reasons.push(`жанр: ${matchingGenres.join(", ")}`);
  if (criteria.company) {
    reasons.push(
      `жанры для просмотра ${criteria.company === "solo" ? "наедине" : criteria.company === "duo" ? "вдвоём" : criteria.company === "friends" ? "с друзьями" : "с близкими"}`,
    );
  }
  if (criteria.durationLimit !== null) {
    reasons.push(`длительность ${movie.duration} минут — в вашем лимите`);
  }
  if (criteria.era !== "any") reasons.push("подходит выбранная эпоха");
  return reasons.slice(0, 3);
}
