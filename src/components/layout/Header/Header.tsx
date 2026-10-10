import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "../../navigation/MainNav/MainNav";
import { ProfileMenu } from "../../navigation/ProfileMenu/ProfileMenu";
import { Search } from "../../navigation/Search/Search";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import styles from "./Header.module.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link aria-label="CineVault — главная" className={styles.brand} to="/">
          <span className={styles.brandIcon}><Icon name="film" /></span>
          <span>CINE<span>VAULT</span></span>
        </Link>
        <MainNav mobileOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <div className={styles.actions}>
          <Search />
          <ProfileMenu />
          <IconButton
            aria-expanded={menuOpen}
            className={styles.menuButton}
            label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          ><Icon name={menuOpen ? "close" : "menu"} /></IconButton>
        </div>
      </div>
    </header>
  );
}
