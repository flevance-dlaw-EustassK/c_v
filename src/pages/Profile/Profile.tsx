import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { MoviePoster } from "../../components/movie/MoviePoster/MoviePoster";
import { useCineVault } from "../../app/CineVaultProvider";
import { mockMovies } from "../../data/mockMovies";
import styles from "./Profile.module.css";

const reviewIds = ["2", "9", "1", "13", "10"];

export function Profile() {
  const { favorites, library, ratings, watched } = useCineVault();
  const ranked = reviewIds.map((id, index) => {
    const movie = mockMovies.find((item) => item.id === id)!;
    return { movie, stars: ratings[id] ?? [5, 5, 4, 5, 4][index] };
  });
  const average = (ranked.reduce((sum, item) => sum + item.stars, 0) / ranked.length).toFixed(1);

  return (
    <PageContainer>
      <div className={styles.page}>
        <span className="eyebrow">ВАША КИНОИСТОРИЯ</span>
        <section className={styles.identity}>
          <div aria-label="Аватар Андрея" className={styles.avatar}>А</div>
          <div className={styles.name}><span>ПОСМОТРИТЕ, СКОЛЬКО МЫ УЖЕ ВИДЕЛИ</span><h1>Андрей<span>.</span></h1><p>На CineVault с сентября 2024</p></div>
          <span className={styles.member}>ЧАСТЬ КЛУБА<br /><strong>№ 000128</strong></span>
        </section>

        <div className={styles.stats}>
          {[{ amount: 47 + watched.length, label: "ФИЛЬМОВ ПРОСМОТРЕНО" }, { amount: 128 + Object.keys(library).length, label: "В ЛИЧНОЙ КОЛЛЕКЦИИ" }, { amount: average, label: "ВАША СРЕДНЯЯ ОЦЕНКА" }].map(({ amount, label }, index) => (
            <article className={styles.stat} key={label}><span>0{index + 1} <i>—</i> {label}</span><strong>{amount}<small>{index === 2 ? " / 5" : " фильм."}</small></strong><div /></article>
          ))}
        </div>

        <section aria-labelledby="genres-title" className={styles.taste}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ЧТО ОСТАЁТСЯ С ВАМИ</span><h2 id="genres-title">Ваш вкус. Ваши истории.</h2></div><p>Каждая оценка, каждое возвращение<br />к любимому кадру — это часть истории.</p></div>
          <div className={styles.tasteGrid}>
            <article><span>01 &nbsp;ЛЮБИМЫЕ ЖАНРЫ</span><strong>Фантастика <i>·</i> Драма <i>·</i> Триллер</strong></article>
            <article><span>02 &nbsp;ЛЮБИМЫЕ РЕЖИССЁРЫ</span><strong>Кристофер Нолан <i>·</i> Дени Вильнёв</strong></article>
            <article><span>03 &nbsp;СОХРАНИЛИ ДЛЯ СЕБЯ</span><strong>{favorites.length + 46} <small>фильмов</small></strong></article>
          </div>
        </section>

        <section aria-labelledby="reviews-title" className={styles.history}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ПОСЛЕДНИЕ ВПЕЧАТЛЕНИЯ</span><h2 id="reviews-title">Оценили лично.</h2></div><span className={styles.note}>Ваши оценки остаются только в этом профиле.</span></div>
          <div className={styles.ratings}>
            {ranked.map(({ movie, stars }) => (
              <article className={styles.ratingItem} key={movie.id}>
                <div className={styles.thumbnail}><MoviePoster alt="" src={movie.poster} /></div>
                <span className={styles.movieName}><strong>{movie.title}</strong><small>{movie.year}&nbsp; · &nbsp;{movie.director}</small></span>
                <span aria-label={`Ваша оценка: ${stars} из 5`} className={styles.stars}>{Array.from({ length: 5 }, (_, index) => <span className={index < stars ? styles.starFilled : ""} key={index}>★</span>)}</span>
                <span className={styles.date}>{["21 мая", "18 мая", "12 мая", "9 мая", "4 мая"][ranked.findIndex((item) => item.movie.id === movie.id)]} 2025</span>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="preferences-title" className={styles.preferences}>
          <div className={styles.sectionHeading}><div><span className="eyebrow">ТОЛЬКО ДЛЯ ВАШЕГО КИНОТЕАТРА</span><h2 id="preferences-title">Пара настроек.</h2></div></div>
          <label><span><strong>Тихий кинорежим</strong><small>Уменьшает движение и эффекты на странице.</small></span><input aria-label="Тихий кинорежим" defaultChecked type="checkbox" /></label>
          <label><span><strong>Остаться в истории</strong><small>Показывать ваши отметки «Посмотрел» в фильмотеке.</small></span><input aria-label="Показывать историю просмотров" defaultChecked type="checkbox" /></label>
          <div className={styles.privacy}><span>🔒</span> Настройки, оценки и избранное хранятся только в вашем браузере.</div>
        </section>
      </div>
    </PageContainer>
  );
}
