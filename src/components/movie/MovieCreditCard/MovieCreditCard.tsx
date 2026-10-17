import { useState } from "react";
import { Link } from "react-router-dom";
import type { Person } from "../../../types/credits";
import styles from "./MovieCreditCard.module.css";

interface MovieCreditCardProps {
  person: Person;
  character?: string;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function MovieCreditCard({ person, character }: MovieCreditCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link aria-label={`Открыть страницу персоны: ${person.name}`} className={styles.card} to={`/person/${person.id}`}>
      {person.photoUrl && !imageFailed ? (
        <img alt={person.name} className={styles.portrait} onError={() => setImageFailed(true)} src={person.photoUrl} />
      ) : (
        <div aria-hidden="true" className={styles.portraitFallback}>
          {getInitials(person.name)}
        </div>
      )}
      <strong>{person.name}</strong>
      {character && <span>{character}</span>}
    </Link>
  );
}
