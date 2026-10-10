import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";

interface ModalProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

export function Modal({ children, title, onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    return () => { if (element.open) element.close(); };
  }, []);
  return (
    <dialog className={styles.dialog} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === dialog.current) onClose(); }} ref={dialog}>
      <div className={styles.top}><strong>{title}</strong><IconButton label="Закрыть" onClick={onClose}><Icon name="close" /></IconButton></div>
      {children}
    </dialog>
  );
}
