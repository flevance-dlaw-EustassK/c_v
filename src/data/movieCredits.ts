import type { Movie } from "../types/movie";
import type { FilmEvent } from "../types/cinema";
import { mockFilmEvents } from "./mockFilmEvents";
import { mockMovies } from "./mockMovies";
import { mockMovieCredits } from "./mockMovieCredits";
import { mockPeople } from "./mockPeople";
import { mockStudios, movieStudioIds } from "./mockStudios";

export function getPerson(personId: string) {
  return mockPeople[personId];
}

export function getMovieStudios(movieId: string) {
  return (movieStudioIds[movieId] ?? []).flatMap((studioId) => {
    const studio = mockStudios.find((item) => item.id === studioId);
    return studio ? [studio] : [];
  });
}

export function getStudioMovies(studioId: string) {
  return mockMovies.filter((movie) => movieStudioIds[movie.id]?.includes(studioId));
}

export function getMovieCast(movieId: string) {
  return [...(mockMovieCredits[movieId]?.cast ?? [])]
    .sort((first, second) => first.order - second.order)
    .flatMap((member) => {
      const person = getPerson(member.personId);
      return person ? [{ ...member, person }] : [];
    });
}

export function getMovieCrew(movieId: string) {
  return (mockMovieCredits[movieId]?.crew ?? []).flatMap((member) => {
    const person = getPerson(member.personId);
    return person ? [{ ...member, person }] : [];
  });
}

export function getCrewByJob(crew: ReturnType<typeof getMovieCrew>) {
  return crew.reduce<Array<{ job: string; people: ReturnType<typeof getMovieCrew> }>>(
    (groups, member) => {
      const group = groups.find((item) => item.job === member.job);
      if (group) {
        if (!group.people.some((person) => person.personId === member.personId)) {
          group.people.push(member);
        }
      } else {
        groups.push({ job: member.job, people: [member] });
      }
      return groups;
    },
    [],
  );
}

export function getMovieDirectorNames(movieId: string): string[] {
  return getMovieCrew(movieId)
    .filter((member) => member.job === "Режиссёр")
    .map((member) => member.person.name);
}

export function getPersonMovies(personId: string) {
  return mockMovies.filter((movie) => {
    const credits = mockMovieCredits[movie.id];
    return [...(credits?.cast ?? []), ...(credits?.crew ?? [])].some(
      (credit) => credit.personId === personId,
    );
  });
}

export function getMovieAwards(movieId: string) {
  return mockFilmEvents.flatMap((event) =>
    event.editions.flatMap((edition) =>
      edition.categories.flatMap((category) => {
        const related = category.nominees.some((nominee) => nominee.movieId === movieId);
        if (!related) return [];
        return [{ event, edition, category, won: category.winner?.movieId === movieId }];
      }),
    ),
  );
}

export function getPersonAwards(personId: string) {
  return mockFilmEvents.flatMap((event) =>
    event.editions.flatMap((edition) =>
      edition.categories.flatMap((category) => {
        const related = category.nominees.some((nominee) => nominee.personId === personId);
        if (!related) return [];
        return [{ event, edition, category, won: category.winner?.personId === personId }];
      }),
    ),
  );
}

export function getEventAwardsForMovie(event: FilmEvent, movieId: string) {
  return event.editions.flatMap((edition) =>
    edition.categories.flatMap((category) => {
      const related = category.nominees.some((nominee) => nominee.movieId === movieId);
      return related ? [{ edition, category, won: category.winner?.movieId === movieId }] : [];
    }),
  );
}

export function getMovieSearchText(movie: Movie): string {
  const credits = mockMovieCredits[movie.id];
  const people = [...(credits?.cast ?? []), ...(credits?.crew ?? [])]
    .map((credit) => getPerson(credit.personId)?.name)
    .filter((name): name is string => Boolean(name));

  return `${movie.title} ${movie.originalTitle} ${movie.genres.join(" ")} ${people.join(" ")}`;
}
