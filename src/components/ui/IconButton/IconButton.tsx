import type { ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ children, label, className = "", ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className={`${styles.iconButton} ${className}`} {...props}>
      {children}
    </button>
  );
}
