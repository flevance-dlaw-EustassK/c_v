import { Outlet } from "react-router-dom";
import styles from "./App.module.css";
import { Footer } from "../components/layout/Footer/Footer";
import { Header } from "../components/layout/Header/Header";
import { ClapboardTransition } from "../effects/ClapboardTransition/ClapboardTransition";
import { PageTransition } from "../effects/PageTransition/PageTransition";
import { PopcornEffect } from "../effects/PopcornEffect/PopcornEffect";

export function App() {
  return (
    <div className={styles.shell}>
      <Header />
      <ClapboardTransition />
      <PageTransition><main><Outlet /></main></PageTransition>
      <Footer />
      <PopcornEffect />
    </div>
  );
}
