export interface PickerCriteria {
  genres: string[];
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
}

export interface MovieAtmosphere {
  tension: number;
  complexity: number;
  emotionalTone: number;
  pace: number;
}

export type MovieCompany = "solo" | "duo" | "friends" | "family";
export type MovieEra = "any" | "classic" | "2000s" | "2010s" | "recent";

export interface MoviePickerCriteria {
  atmosphere: MovieAtmosphere;
  genres: string[];
  company: MovieCompany | "";
  durationLimit: number | null;
  era: MovieEra;
  minRating: number;
  preference: "" | "cult" | "surprise" | "short";
}
