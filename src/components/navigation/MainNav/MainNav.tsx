import { NavLink } from "react-router-dom";
import styles from "./MainNav.module.css";

const navigationItems = [
  { label: "Главная", to: "/" },
  { label: "Фильмы", to: "/catalog" },
  { label: "Подбор", to: "/picker" },
  { label: "Моя фильмотека", to: "/library" },
];

interface MainNavProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function MainNav({ mobileOpen = false, onNavigate }: MainNavProps) {
  return (
    <nav aria-label="Основная навигация" className={`${styles.nav} ${mobileOpen ? styles.open : ""}`}>
      {navigationItems.map(({ label, to }) => (
        <NavLink end key={to} onClick={onNavigate} to={to}>{label}</NavLink>
      ))}
    </nav>
  );
}
