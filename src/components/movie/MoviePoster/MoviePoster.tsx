import { useState } from "react";
import styles from "./MoviePoster.module.css";

interface MoviePosterProps {
  alt: string;
  src: string;
  loading?: "eager" | "lazy";
}

export function MoviePoster({ alt, src, loading = "lazy" }: MoviePosterProps) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className={styles.poster}>
      <img
        alt={alt}
        loading={loading}
        onError={() => setImageError(true)}
        src={imageError ? "/images/poster-placeholder.svg" : src}
      />
    </div>
  );
}
