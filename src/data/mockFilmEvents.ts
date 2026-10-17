import type { FilmEvent } from "../types/cinema";

const images = "https://image.tmdb.org/t/p/w1280";

export const mockFilmEvents: FilmEvent[] = [
  {
    id: "cannes",
    name: "Каннский кинофестиваль",
    kind: "festival",
    location: "Канны, Франция",
    founded: 1946,
    description:
      "Международный кинофестиваль, где конкурсные показы и премьеры собирают авторов и зрителей со всего мира. Главная награда конкурса — «Золотая пальмовая ветвь».",
    heroImage: images + "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    editions: [
      {
        year: 1994,
        categories: [
          {
            id: "palme-dor",
            name: "Золотая пальмовая ветвь",
            winner: { movieId: "14" },
            nominees: [{ movieId: "14" }],
          },
        ],
      },
    ],
  },
  {
    id: "academy-awards",
    name: "Премия «Оскар»",
    kind: "award",
    location: "Лос-Анджелес, США",
    founded: 1929,
    description:
      "Ежегодная американская кинопремия Американской академии кинематографических искусств и наук. В отличие от фестиваля, это церемония вручения наград по профессиональным категориям. Архив содержит выборку подтверждённых категорий для фильмов и персон из каталога CineVault.",
    heroImage: images + "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    editions: [
      {
        year: 2024,
        categories: [
          {
            id: "best-picture",
            name: "Лучший фильм",
            winner: { movieId: "19" },
            nominees: [{ movieId: "19" }],
          },
          {
            id: "best-director",
            name: "Лучшая режиссура",
            winner: { personId: "christopher-nolan" },
            nominees: [{ personId: "christopher-nolan" }],
          },
          {
            id: "best-actor",
            name: "Лучшая мужская роль",
            winner: { personId: "cillian-murphy" },
            nominees: [{ personId: "cillian-murphy" }],
          },
          {
            id: "best-supporting-actor",
            name: "Лучшая мужская роль второго плана",
            winner: { personId: "robert-downey-jr" },
            nominees: [{ personId: "robert-downey-jr" }],
          },
          {
            id: "best-supporting-actress",
            name: "Лучшая женская роль второго плана",
            nominees: [{ personId: "emily-blunt" }],
          },
          {
            id: "best-cinematography",
            name: "Лучшая операторская работа",
            winner: { personId: "hoyte-van-hoytema" },
            nominees: [{ personId: "hoyte-van-hoytema" }],
          },
          {
            id: "best-original-score",
            name: "Лучшая музыка к фильму",
            winner: { personId: "ludwig-goransson" },
            nominees: [{ personId: "ludwig-goransson" }],
          },
        ],
      },
      {
        year: 2022,
        categories: [
          {
            id: "best-picture",
            name: "Лучший фильм",
            nominees: [{ movieId: "4" }],
          },
          {
            id: "best-original-score",
            name: "Лучшая музыка к фильму",
            winner: { personId: "hans-zimmer" },
            nominees: [{ personId: "hans-zimmer" }],
          },
        ],
      },
    ],
  },
  {
    id: "golden-globes",
    name: "Премия «Золотой глобус»",
    kind: "award",
    location: "США",
    founded: 1944,
    description:
      "Кинопремия Голливудской ассоциации иностранной прессы, отмечающая достижения в кино и на телевидении. В этой локальной подборке представлены только связанные с каталогом CineVault категории.",
    heroImage: images + "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    editions: [
      {
        year: 1977,
        categories: [
          {
            id: "best-motion-picture-drama",
            name: "Лучший фильм — драма",
            winner: { movieId: "21" },
            nominees: [{ movieId: "21" }],
          },
        ],
      },
    ],
  },
];
