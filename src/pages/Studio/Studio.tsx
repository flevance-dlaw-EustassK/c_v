import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieCard } from "../../components/movie/MovieCard/MovieCard";
import { getStudioMovies } from "../../data/movieCredits";
import { mockStudios } from "../../data/mockStudios";
import styles from "./Studio.module.css";

export function Studio() {
  const { id = "" } = useParams();
  const studio = mockStudios.find((item) => item.id === id);
  const movies = getStudioMovies(id).sort((first, second) => second.year - first.year);

  if (!studio) {
    return (
      <PageContainer>
        <div className={styles.empty}><h1>Киностудия не найдена.</h1><Link to="/catalog">Вернуться к фильмам →</Link></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <header className={styles.hero} style={{ "--studio-image": `url("${studio.poster}")` } as React.CSSProperties}>
          <div className={styles.heroCopy}>
            <span className="eyebrow">КИНОСТУДИЯ · CINEVAULT</span>
            <h1>{studio.name}<i>.</i></h1>
            <p>{studio.description}</p>
            <span className={styles.details}>{studio.country}{studio.founded ? ` · Основана в ${studio.founded} году` : ""} · Фильмов в каталоге: {movies.length}</span>
          </div>
        </header>
        <section className={styles.filmography}>
          <div className={styles.heading}>
            <div><span className="eyebrow">ФИЛЬМОГРАФИЯ В CINEVAULT</span><h2>Истории этой студии.</h2></div>
            <Link to="/catalog">Весь каталог →</Link>
          </div>
          {movies.length ? (
            <div className={styles.grid}>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} showFavorite />)}</div>
          ) : (
            <p className={styles.empty}>Фильмы этой студии пока не представлены в каталоге CineVault.</p>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
