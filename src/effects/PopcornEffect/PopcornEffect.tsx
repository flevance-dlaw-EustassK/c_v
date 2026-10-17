import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PopcornEffect.module.css";

interface Kernel {
  id: number;
  left: number;
  top: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  rotation: number;
  spin: number;
  size: number;
  duration: number;
  variant: number;
  delay: number;
}

const PARTICLE_COUNT = 9;
const MAX_PARTICLES = 36;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function createKernel(id: number, x: number, y: number): Kernel {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const angle = (18 + Math.random() * 59) * (Math.PI / 180);
  const speed = 125 + Math.random() * 115;
  const duration = 680 + Math.random() * 300;

  return {
    id,
    left: x + (Math.random() - 0.5) * 12,
    top: y + (Math.random() - 0.5) * 8,
    velocityX: Math.cos(angle) * speed * direction,
    velocityY: -Math.sin(angle) * speed * (0.65 + Math.random() * 0.55),
    gravity: 690 + Math.random() * 330,
    rotation: Math.random() * 100 - 50,
    spin: (Math.random() < 0.5 ? -1 : 1) * (300 + Math.random() * 570),
    size: 10 + Math.random() * 7,
    duration,
    variant: Math.floor(Math.random() * 3),
    delay: Math.random() * 55,
  };
}

function createTrajectory(kernel: Kernel) {
  const frameCount = 18;
  const durationSeconds = kernel.duration / 1000;

  return Array.from({ length: frameCount + 1 }, (_, index) => {
    const progress = index / frameCount;
    const time = durationSeconds * progress;
    const x = kernel.velocityX * time;
    const y = kernel.velocityY * time + 0.5 * kernel.gravity * time * time;
    const rotation = kernel.rotation + kernel.spin * time;
    const opacity =
      progress < 0.09
        ? progress / 0.09
        : progress > 0.72
          ? (1 - progress) / 0.28
          : 1;

    return {
      opacity: String(Math.max(0, Math.min(opacity, 1))),
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotation.toFixed(1)}deg)`,
      offset: progress,
    };
  });
}

export function PopcornEffect() {
  const [kernels, setKernels] = useState<Kernel[]>([]);
  const nextId = useRef(0);
  const lastClick = useRef(0);
  const elements = useRef(new Map<number, HTMLSpanElement>());
  const animations = useRef(new Map<number, Animation>());

  const setElement = useCallback((id: number, element: HTMLSpanElement | null) => {
    if (element) elements.current.set(id, element);
    else elements.current.delete(id);
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (
        motionPreference.matches ||
        document.documentElement.dataset.reduceMotion === "true" ||
        !(target instanceof Element) ||
        target.closest(
          "a, button, input, select, textarea, article, nav, label, [role='dialog'], [data-no-popcorn]",
        )
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastClick.current < 330) return;
      lastClick.current = now;

      const particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createKernel(nextId.current++, event.clientX, event.clientY),
      );
      setKernels((current) => [...current, ...particles].slice(-MAX_PARTICLES));
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    for (const kernel of kernels) {
      if (animations.current.has(kernel.id)) continue;
      const element = elements.current.get(kernel.id);
      if (!element) continue;

      const animation = element.animate(createTrajectory(kernel), {
        duration: kernel.duration,
        delay: kernel.delay,
        easing: "linear",
        fill: "forwards",
      });
      animation.onfinish = () => {
        animations.current.delete(kernel.id);
        elements.current.delete(kernel.id);
        setKernels((current) => current.filter((item) => item.id !== kernel.id));
        animation.cancel();
      };
      animations.current.set(kernel.id, animation);
    }
  }, [kernels]);

  useEffect(
    () => () => {
      for (const animation of animations.current.values()) animation.cancel();
      animations.current.clear();
      elements.current.clear();
    },
    [],
  );

  return (
    <div aria-hidden="true" className={styles.effect}>
      {kernels.map((kernel) => (
        <span
          className={`${styles.kernel} ${styles[`variant${kernel.variant}`]}`}
          key={kernel.id}
          ref={(element) => setElement(kernel.id, element)}
          style={
            {
              left: kernel.left,
              top: kernel.top,
              width: kernel.size,
              height: kernel.size * 0.82,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
