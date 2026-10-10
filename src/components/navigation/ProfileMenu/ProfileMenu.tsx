import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icon/Icon";
import styles from "./ProfileMenu.module.css";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.profile}>
      <button
        aria-expanded={open}
        aria-label="Профиль Андрея"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={styles.avatar}>А</span>
        <span className={styles.name}>Андрей</span>
        <Icon name="chevron" />
      </button>
      {open && (
        <div className={styles.menu}>
          <span className={styles.greeting}>Андрей · киноман</span>
          <Link onClick={() => setOpen(false)} to="/profile">Мой профиль</Link>
          <Link onClick={() => setOpen(false)} to="/library">Моя фильмотека</Link>
          <Link onClick={() => setOpen(false)} to="/favorites">Избранное</Link>
        </div>
      )}
    </div>
  );
}
