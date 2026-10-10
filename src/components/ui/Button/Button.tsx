import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "large";
  to?: string;
}

export function Button({
  children,
  variant = "secondary",
  size = "small",
  className = "",
  to,
  ...props
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
  if (to) return <Link className={classes} to={to}>{children}</Link>;
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
