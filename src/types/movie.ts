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
  director: string;
  description: string;
  country?: string;
  cast?: string[];
  mood?: string[];
  status?: "watching" | "watched" | "plan";
}
