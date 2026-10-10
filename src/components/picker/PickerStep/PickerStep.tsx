import type { ReactNode } from "react";
import styles from "./PickerStep.module.css";

interface PickerStepProps {
  children: ReactNode;
  title: string;
  step?: string;
}

export function PickerStep({ children, title, step }: PickerStepProps) {
  return (
    <section aria-label={title} className={styles.step}>
      <div className={styles.heading}>{step && <span>{step}</span>}<h2>{title}</h2></div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
