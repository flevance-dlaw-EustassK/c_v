import type { FormEventHandler, ReactNode } from "react";
import styles from "./PickerForm.module.css";

interface PickerFormProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function PickerForm({ children, onSubmit }: PickerFormProps) {
  return <form aria-label="Параметры подбора фильма" className={styles.form} onSubmit={onSubmit}>{children}</form>;
}
