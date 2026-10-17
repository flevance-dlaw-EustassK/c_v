import type { MovieAtmosphere } from "./picker";

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  duration: number;
  genres: string[];
  rating: number;
  poster: string;
  backdrop: string;
  description: string;
  country?: string;
  mood?: string[];
  atmosphere: MovieAtmosphere;
  studioIds?: string[];
  gallery?: string[];
}
