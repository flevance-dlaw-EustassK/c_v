import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { getPerson, getPersonAwards, getPersonMovies } from "../../data/movieCredits";
import styles from "./Person.module.css";

function getAge(birthDate: string, today = new Date()) {
  const date = new Date(`${birthDate}T00:00:00`);
  let age = today.getFullYear() - date.getFullYear();
  if (
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  ) {
    age -= 1;
  }
  return age;
}

function formatBirthDate(value: string) {
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function Person() {
  const { id = "" } = useParams();
  const person = getPerson(id);
  const filmography = getPersonMovies(id).sort(
    (first, second) => second.year - first.year,
  );
  const awards = getPersonAwards(id);

  if (!person) {
    return (
      <PageContainer>
        <div className={styles.empty}>
          <span className="eyebrow">КИНОЛЮДИ CINEVAULT</span>
          <h1>Такой страницы пока нет.</h1>
          <Link to="/catalog">Вернуться к фильмам →</Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <Link className={styles.back} to="/catalog">← К фильмам</Link>
        <header className={styles.hero}>
          <div className={styles.portrait}>
            {person.photoUrl ? (
              <img alt={person.name} src={person.photoUrl} />
            ) : (
              <span aria-hidden="true">
                {person.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}
              </span>
            )}
          </div>
          <div className={styles.identity}>
            <span className="eyebrow">ПЕРСОНА · CINEVAULT</span>
            <h1>{person.name}<i>.</i></h1>
            {person.professions?.length ? (
              <p className={styles.professions}>{person.professions.join(" · ")}</p>
            ) : (
              <p className={styles.professions}>Участник съёмочных групп фильмов каталога</p>
            )}
            <div className={styles.facts}>
              {person.birthDate && <span><small>РОДИЛСЯ</small>{formatBirthDate(person.birthDate)} · {getAge(person.birthDate)} лет</span>}
              {person.birthplace && <span><small>МЕСТО РОЖДЕНИЯ</small>{person.birthplace}</span>}
              {person.heightCm && <span><small>РОСТ</small>{person.heightCm} см</span>}
            </div>
            {person.biography && <p className={styles.biography}>{person.biography}</p>}
          </div>
        </header>

        {filmography.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div><span className="eyebrow">ВЫБРАННЫЕ РАБОТЫ</span><h2>Фильмы, которые остаются.</h2></div>
              <span>{filmography.length} в каталоге</span>
            </div>
            <div className={styles.featured}>
              {filmography.slice(0, 3).map((movie) => <MovieCard key={movie.id} movie={movie} showFavorite />)}
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div><span className="eyebrow">ПРИЗНАНИЕ</span><h2>Награды и номинации.</h2></div>
            </div>
            <div className={styles.awards}>
              {awards.map(({ event, edition, category, won }) => (
                <Link className={styles.award} key={`${event.id}-${edition.year}-${category.id}`} to={`/festivals/${event.id}?year=${edition.year}`}>
                  <span>{won ? "ПОБЕДИТЕЛЬ" : "НОМИНАЦИЯ"} · {edition.year}</span>
                  <strong>{category.name}</strong>
                  <small>{event.name} ↗</small>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filmography.length > 3 && (
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div><span className="eyebrow">ФИЛЬМОГРАФИЯ</span><h2>Все фильмы в CineVault.</h2></div>
            </div>
            <div className={styles.filmography}>
              {filmography.map((movie) => (
                <Link className={styles.film} key={movie.id} to={`/movie/${movie.id}`}>
                  <span>{movie.year}</span><strong>{movie.title}</strong><span>{movie.originalTitle}</span><span>★ {movie.rating.toFixed(1)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!filmography.length && (
          <p className={styles.empty}>Фильмография этой персоны пока не связана с фильмами каталога.</p>
        )}
      </div>
    </PageContainer>
  );
}
