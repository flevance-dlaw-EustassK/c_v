import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ClapboardTransition.module.css";

export function ClapboardTransition() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 520);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  if (!visible) return null;
  return (
    <div aria-hidden="true" className={styles.curtain}>
      <div className={styles.stripe} />
      CINEVAULT &nbsp;·&nbsp; СЛЕДУЮЩИЙ КАДР
    </div>
  );
}
