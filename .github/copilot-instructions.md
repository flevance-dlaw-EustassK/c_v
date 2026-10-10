# CineVault development guidelines

- Keep pages in `src/pages`; keep reusable, page-independent UI in `src/components`.
- Keep shared data types in `src/types` and mock movie data in `src/data/mockMovies.ts`.
- Keep API and browser-storage logic in `src/services`, never in page or UI components.
- Use React, TypeScript, React Router, Vite, and CSS; do not add Tailwind or state-management libraries without an explicit project decision.
- Define global CSS variables in `src/styles/variables.css`. Prefer the existing dark cinema color palette and Inter font.
- Keep cinema effects in `src/effects`, separate from page and business logic.
- Keep additions straightforward, typed, reusable, and proportionate to a student diploma project.
- TMDB integration is only a placeholder. Do not add real API calls or credentials without approval.
