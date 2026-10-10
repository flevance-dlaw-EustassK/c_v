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
  const { favorites, watched, library } = useCineVault();
  const savedMovies = mockMovies.filter((item) => favorites.includes(item.id));

  return (
    <>
      <section
        className={styles.hero}
        style={{ "--hero-image": `url("${movie("19").backdrop}")` } as React.CSSProperties}
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
          <Link aria-label="Перейти к фильму Оппенгеймер" className={styles.featured} to="/movie/19">
            <span className={styles.featuredPoster}>
              <img alt="Постер фильма «Оппенгеймер»" fetchPriority="high" src={movie("19").poster} />
            </span>
            <span className={styles.featuredMeta}><span>В ГЛАВНОЙ РОЛИ СЕГОДНЯ</span><strong>Оппенгеймер</strong><span>★ 8.3&nbsp; · &nbsp;3 ч 00 мин</span></span>
          </Link>
          <span className={styles.heroCounter}><span>01</span> / 04</span>
        </div>
        <div className={styles.heroFade} />
      </section>

      <PageContainer>
        <div className={styles.content}>
          <div className={styles.sectionLabel}><span /> ВАШ ВЕЧЕР ПРОДОЛЖАЕТСЯ</div>
          <MovieRow movies={[movie("1"), movie("4"), movie("9"), movie("18")]} title="Продолжить просмотр" />
          <MovieRow favorites movies={savedMovies} title="Ваша фильмотека" linkTo="/library" />
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
            <div className={styles.tasteIntro}><span className="eyebrow">ЭТО ВАШ ВКУС</span><h2 id="taste-title">Мы начинаем<br />понимать друг друга.</h2><p>Несколько вечеров за хорошим кино — и у нас уже есть кое-что общее.</p><Link to="/profile">Моя киноистория <Icon name="arrow" /></Link></div>
            <div className={styles.tasteStats}>
              <div><span>ЛЮБИМЫЕ ЖАНРЫ</span><strong>Фантастика <i>·</i> Драма <i>·</i> Триллер</strong></div>
              <div><span>СМОТРЕЛИ ВМЕСТЕ</span><strong>{watched.length + 42} <small>фильма</small></strong></div>
              <div><span>ВАША СРЕДНЯЯ ОЦЕНКА</span><strong>8.4 <small>/ 10</small></strong></div>
              <div><span>ЛЮБИМОЕ ДЕСЯТИЛЕТИЕ</span><strong>2010-е <small>годы</small></strong></div>
              <div><span>В ВАШЕЙ КОЛЛЕКЦИИ</span><strong>{Object.keys(library).length + 119} <small>фильмов</small></strong></div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
