export interface Person {
  id: string;
  name: string;
  photoUrl?: string;
  birthDate?: string;
  birthplace?: string;
  heightCm?: number;
  professions?: string[];
  biography?: string;
}

export interface MovieCastMember {
  personId: string;
  character: string;
  order: number;
}

export interface MovieCrewMember {
  personId: string;
  job: string;
}

export interface MovieCredits {
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}
