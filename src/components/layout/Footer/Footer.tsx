import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const links = [
  { text: "Главная", to: "/" },
  { text: "Фильмы", to: "/catalog" },
  { text: "Подбор", to: "/picker" },
  { text: "Фестивали", to: "/festivals" },
  { text: "Фильмотека", to: "/library" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">CINEVAULT</Link>
        <nav aria-label="Навигация в подвале">
          {links.map(({ text, to }) => <Link key={to} to={to}>{text}</Link>)}
        </nav>
        <nav aria-label="Информация о проекте">
          <a href="mailto:hello@cinevault.local">О проекте</a>
          <a href="mailto:help@cinevault.local">Помощь</a>
        </nav>
        <small>© 2026 CineVault · фильмы для домашнего кинотеатра</small>
      </div>
    </footer>
  );
}
