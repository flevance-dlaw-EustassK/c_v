import type { ReactNode } from "react";

interface FilmEffectsProps {
  children?: ReactNode;
}

export function FilmEffects({ children }: FilmEffectsProps) {
  return children ?? null;
}
