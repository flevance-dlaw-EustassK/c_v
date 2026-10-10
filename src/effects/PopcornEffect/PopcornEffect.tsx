import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PopcornEffect.module.css";

interface Kernel {
  id: number;
  left: number;
  top: number;
  drift: string;
  twirl: string;
}

export function PopcornEffect() {
  const [kernels, setKernels] = useState<Kernel[]>([]);
  const nextId = useRef(0);
  const lastClick = useRef(0);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a, button, input, select, textarea, article, nav, label, [role='dialog'], [data-no-popcorn]")) return;
      const now = Date.now();
      if (now - lastClick.current < 330) return;
      lastClick.current = now;
      const { clientX, clientY } = event;
      const newKernels = Array.from({ length: 4 }, () => {
        const id = nextId.current++;
        return {
          id,
          left: clientX + (Math.random() - 0.5) * 48 - 11,
          top: clientY - 8,
          drift: `${Math.round((Math.random() - 0.5) * 100)}px`,
          twirl: `${Math.round(Math.random() * 200 - 100)}deg`,
        };
      });
      setKernels((current) => [...current, ...newKernels].slice(-20));
      window.setTimeout(() => {
        const earliest = nextId.current - 20;
        setKernels((current) => current.filter((kernel) => kernel.id >= earliest));
      }, 1020);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div aria-hidden="true">
      {kernels.map((kernel, index) => (
        <span
          className={styles.kernel}
          key={kernel.id}
          style={
            {
              left: kernel.left,
              top: kernel.top,
              animationDelay: `${(index % 4) * 30}ms`,
              "--drift": kernel.drift,
              "--twirl": kernel.twirl,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
