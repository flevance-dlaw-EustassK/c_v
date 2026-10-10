import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref,
) {
  return <input className={`${styles.input} ${className}`} ref={ref} {...props} />;
});
