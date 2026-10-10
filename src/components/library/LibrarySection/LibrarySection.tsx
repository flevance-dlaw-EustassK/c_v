import type { ReactNode } from "react";
import styles from "./LibrarySection.module.css";

interface LibrarySectionProps {
  children: ReactNode;
  title: string;
}

export function LibrarySection({ children, title }: LibrarySectionProps) {
  return (
    <section aria-label={title} className={styles.section}>
      <h2>{title}</h2><div className={styles.content}>{children}</div>
    </section>
  );
}
