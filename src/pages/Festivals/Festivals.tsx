import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { mockFilmEvents } from "../../data/mockFilmEvents";
import { mockMovies } from "../../data/mockMovies";
import { getPerson } from "../../data/movieCredits";
import styles from "./Festivals.module.css";

export function Festivals() {
  const featuredEvent = mockFilmEvents.find((event) => event.kind === "festival") ?? mockFilmEvents[0];
  const events = mockFilmEvents.filter((event) => event.id !== featuredEvent.id);
  const editionsCount = mockFilmEvents.reduce((total, event) => total + event.editions.length, 0);
  const featuredEdition = [...featuredEvent.editions].sort((a, b) => b.year - a.year)[0];
  const featuredCategory = featuredEdition?.categories[0];
  const featuredWinner = featuredCategory?.winner?.movieId
    ? mockMovies.find((movie) => movie.id === featuredCategory.winner?.movieId)
    : undefined;

  return (
    <PageContainer>
      <div className={styles.page}>
        <header className={styles.masthead}>
          <span className="eyebrow">CINEVAULT · АРХИВ КИНО</span>
          <h1>Истории, отмеченные<br /><i>большим экраном.</i></h1>
          <div className={styles.intro}>
            <p>Фестивальные открытия и решения киноакадемий — через фильмы, людей и годы.</p>
            <span>{mockFilmEvents.length} события <b>·</b> {editionsCount} архивных выпуска</span>
          </div>
        </header>

        <Link className={styles.feature} to={`/festivals/${featuredEvent.id}`}>
          <img alt="" src={featuredEvent.heroImage} />
          <div className={styles.featureShade} />
          <div className={styles.featureText}>
            <span className={styles.kicker}>ФЕСТИВАЛЬ · {featuredEvent.location}</span>
            <h2>{featuredEvent.name}</h2>
            <p>{featuredEvent.description}</p>
            {featuredWinner && featuredCategory && (
              <span className={styles.laureate}>{featuredEdition?.year} · {featuredCategory.name} · {featuredWinner.title}</span>
            )}
            <span className={styles.discover}>Исследовать архив <b>↗</b></span>
          </div>
        </Link>

        <section className={styles.archive}>
          <div className={styles.sectionHeading}>
            <div><span className="eyebrow">АРХИВ И ЦЕРЕМОНИИ</span><h2>Разные сцены. Общая любовь к кино.</h2></div>
            <span className={styles.editionCount}>{editionsCount} выпуска</span>
          </div>
          <div className={styles.eventList}>
            {events.map((event, index) => {
              const years = [...event.editions].map((edition) => edition.year).sort((a, b) => b - a);
              const firstWinner = event.editions.flatMap((edition) =>
                edition.categories.flatMap((category) => {
                  const winner = category.winner;
                  if (!winner) return [];
                  return [{
                    year: edition.year,
                    category: category.name,
                    title: winner.movieId
                      ? mockMovies.find((movie) => movie.id === winner.movieId)?.title
                      : winner.personId
                        ? getPerson(winner.personId)?.name
                        : undefined,
                  }];
                }),
              )[0];
              return (
                <Link className={styles.event} key={event.id} to={`/festivals/${event.id}`}>
                  <img alt="" src={event.heroImage} />
                  <div className={styles.eventNumber}>0{index + 2}</div>
                  <div className={styles.eventCopy}>
                    <span>{event.kind === "festival" ? "КИНОФЕСТИВАЛЬ" : "КИНОПРЕМИЯ"} · {event.location}</span>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <div className={styles.eventMeta}>
                      <span>В каталоге: {years.join(" · ") || "архив пополняется"}</span>
                      {firstWinner?.title && <span>{firstWinner.year} · {firstWinner.category}: {firstWinner.title}</span>}
                    </div>
                  </div>
                  <span className={styles.arrow}>↗</span>
                </Link>
              );
            })}
          </div>
          <p className={styles.note}>Архив CineVault — демонстрационная подборка связанных записей, а не полный официальный реестр наград и номинаций.</p>
        </section>
      </div>
    </PageContainer>
  );
}
