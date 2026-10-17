export interface MovieStudio {
  id: string;
  name: string;
  country: string;
  founded?: number;
  description: string;
  poster: string;
}

export type FilmEventKind = "festival" | "award";

export interface AwardNominee {
  movieId?: string;
  personId?: string;
  note?: string;
}

export interface AwardCategory {
  id: string;
  name: string;
  winner?: AwardNominee;
  nominees: AwardNominee[];
}

export interface FilmEventEdition {
  year: number;
  categories: AwardCategory[];
}

export interface FilmEvent {
  id: string;
  name: string;
  kind: FilmEventKind;
  location: string;
  founded?: number;
  description: string;
  heroImage: string;
  editions: FilmEventEdition[];
}
