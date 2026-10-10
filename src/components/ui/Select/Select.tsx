import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ children, className = "", ...props }: SelectProps) {
  return <select className={`${styles.select} ${className}`} {...props}>{children}</select>;
}
