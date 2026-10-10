import styles from "./MovieRating.module.css";

interface MovieRatingProps {
  rating: number;
  value?: number;
  onChange?: (rating: number) => void;
}

export function MovieRating({ rating, value, onChange }: MovieRatingProps) {
  if (onChange) {
    return (
      <div className={styles.stars} aria-label="Ваша оценка" role="group">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            aria-label={`${index + 1} из 5 звёзд`}
            aria-pressed={value === index + 1}
            className={index < (value ?? 0) ? styles.filled : ""}
            onClick={() => onChange(index + 1)}
            type="button"
          >
            ★
          </button>
        ))}
      </div>
    );
  }
  return (
    <span className={styles.rating} aria-label={`Рейтинг ${rating.toFixed(1)} из 10`}>
      <span aria-hidden="true">★</span> {rating.toFixed(1)}
    </span>
  );
}
