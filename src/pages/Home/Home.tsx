import { Link } from "react-router-dom";
import { mockMovies } from "../../data/mockMovies";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MovieRow } from "../../components/movie/MovieRow/MovieRow";
import { Icon } from "../../components/ui/Icon/Icon";
import { useCineVault } from "../../app/CineVaultProvider";
import styles from "./Home.module.css";

const movie = (id: string) => mockMovies.find((item) => item.id === id)!;
const collections = [
  { title: "На вечер", subtitle: "КИНО, КОТОРОЕ СОБИРАЕТ ВМЕСТЕ", film: movie("14"), accent: "#804435" },
  { title: "Культовое кино", subtitle: "ФИЛЬМЫ, К КОТОРЫМ ВОЗВРАЩАЮТСЯ", film: movie("8"), accent: "#35535b" },
  { title: "Ничего лишнего", subtitle: "ИСТОРИЯ ВМЕСТО СПЕЦЭФФЕКТОВ", film: movie("15"), accent: "#766347" },
  { title: "После полуночи", subtitle: "ГОРОД УЖЕ СПИТ. А ТЫ — НЕТ.", film: movie("18"), accent: "#503d59" },
];

export function Home() {
  const { watched, library, state } = useCineVault();
  const watchedMovies = mockMovies.filter((item) => watched.includes(item.id));
  const continueMovies = mockMovies.filter((item) => library[item.id] === "watching");
  const libraryMovies = mockMovies.filter((item) => library[item.id]);
  const ratedMovies = mockMovies.filter((item) => state.movies[item.id]?.userRating !== undefined);
  const genreCounts = new Map<string, number>();
  for (const ratedMovie of ratedMovies) {
    for (const genre of ratedMovie.genres) genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
  }
  const favoriteGenres = [...genreCounts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([genre]) => genre)
    .join(" · ");
  const averageRating = ratedMovies.length
    ? (ratedMovies.reduce((sum, item) => sum + (state.movies[item.id]?.userRating ?? 0), 0) / ratedMovies.length).toFixed(1)
    : "—";
  const decades = new Map<string, number>();
  for (const watchedMovie of watchedMovies) {
    const decade = `${Math.floor(watchedMovie.year / 10) * 10}-е`;
    decades.set(decade, (decades.get(decade) ?? 0) + 1);
  }
  const favoriteDecade = [...decades.entries()].sort((first, second) => second[1] - first[1])[0]?.[0] ?? "—";

  return (
    <>
      <section
        className={styles.hero}
        style={{ "--hero-image": `url("${movie("3").backdrop}")` } as React.CSSProperties}
      >
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className="eyebrow">ВАШЕ МЕСТО ДЛЯ ХОРОШЕГО КИНО</span>
            <p className={styles.greeting}>Добрый вечер, Андрей.</p>
            <h1>Что посмотрим<br />сегодня<span>?</span></h1>
            <p className={styles.description}>Ваш следующий любимый фильм уже где-то здесь.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryLink} to="/picker"><Icon name="film" /> Подобрать фильм <Icon name="arrow" /></Link>
              <Link className={styles.catalogLink} to="/catalog">Открыть каталог</Link>
            </div>
            <span className={styles.filmNumber}>CINEVAULT <i>·</i> ВАШ ЛИЧНЫЙ КИНОТЕАТР</span>
          </div>
          <Link aria-label="Перейти к фильму Назад в будущее" className={styles.featured} to="/movie/3">
            <span className={styles.featuredPoster}>
              <img alt="Постер фильма «Назад в будущее»" fetchPriority="high" src={movie("3").poster} />
            </span>
            <span className={styles.featuredMeta}><span>В ГЛАВНОЙ РОЛИ СЕГОДНЯ</span><strong>Назад в будущее</strong><span>★ 8.5&nbsp; · &nbsp;1 ч 56 мин</span></span>
          </Link>
          <span className={styles.heroCounter}><span>01</span> / 04</span>
        </div>
        <div className={styles.heroFade} />
      </section>

      <PageContainer>
        <div className={styles.content}>
          <div className={styles.sectionLabel}><span /> ВАШ ВЕЧЕР ПРОДОЛЖАЕТСЯ</div>
          {continueMovies.length > 0 && <MovieRow movies={continueMovies} title="Продолжить просмотр" />}
          {libraryMovies.length > 0 && <MovieRow favorites movies={libraryMovies} title="Ваша фильмотека" linkTo="/library" />}
          <MovieRow movies={[movie("2"), movie("6"), movie("7"), movie("11"), movie("20")]} title="Рекомендации для вас" />

          <section aria-labelledby="curations-title" className={styles.curations}>
            <div className={styles.collectionHeading}><div><span className="eyebrow">КИНО ПО НАСТРОЕНИЮ</span><h2 id="curations-title">Сегодня особенный вечер</h2></div><Link to="/catalog">Все подборки <Icon name="arrow" /></Link></div>
            <div className={styles.collectionGrid}>
              {collections.map((collection, index) => (
                <Link
                  className={styles.collection}
                  key={collection.title}
                  style={{ "--collection-image": `url("${collection.film.backdrop}")`, "--collection-accent": collection.accent } as React.CSSProperties}
                  to="/catalog"
                >
                  <span className={styles.collectionImage}><img alt="" loading="lazy" src={collection.film.poster} /></span>
                  <span className={styles.collectionCopy}><small>{collection.subtitle}</small><strong>{collection.title}</strong><span>Подборка <i>0{index + 1}</i></span></span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="taste-title" className={styles.taste}>
            <div className={styles.tasteIntro}><span className="eyebrow">ЭТО ВАШ ВКУС</span><h2 id="taste-title">Мы начинаем<br />понимать друг друга.</h2><p>Ваши оценки и просмотры помогают собрать эту картину.</p><Link to="/profile">Моя киноистория <Icon name="arrow" /></Link></div>
            <div className={styles.tasteStats}>
              <div><span>ЛЮБИМЫЕ ЖАНРЫ</span><strong>{favoriteGenres || "Пока недостаточно оценок"}</strong></div>
              <div><span>ФИЛЬМОВ ПРОСМОТРЕНО</span><strong>{watchedMovies.length} <small>фильмов</small></strong></div>
              <div><span>ВАША СРЕДНЯЯ ОЦЕНКА</span><strong>{averageRating} <small>{averageRating === "—" ? "" : "/ 5"}</small></strong></div>
              <div><span>ЛЮБИМОЕ ДЕСЯТИЛЕТИЕ</span><strong>{favoriteDecade}</strong></div>
              <div><span>В ВАШЕЙ КОЛЛЕКЦИИ</span><strong>{libraryMovies.length} <small>фильмов</small></strong></div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
