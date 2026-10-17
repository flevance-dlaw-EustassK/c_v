export const movieGenres = [
  "Боевик",
  "Детектив",
  "Драма",
  "История",
  "Комедия",
  "Криминал",
  "Музыка",
  "Приключения",
  "Спортивное кино",
  "Триллер",
  "Ужасы",
  "Фантастика",
] as const;

export type MovieGenre = (typeof movieGenres)[number];
