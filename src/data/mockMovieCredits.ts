import type { MovieCredits } from "../types/credits";

export const mockMovieCredits: Record<string, MovieCredits> = {
  "1": {
    cast: [
      { personId: "leonardo-dicaprio", character: "Дом Кобб", order: 1 },
      { personId: "joseph-gordon-levitt", character: "Артур", order: 2 },
      { personId: "marion-cotillard", character: "Мол", order: 3 },
    ],
    crew: [
      { personId: "christopher-nolan", job: "Режиссёр" },
      { personId: "christopher-nolan", job: "Сценарист" },
      { personId: "wally-pfister", job: "Оператор-постановщик" },
      { personId: "hans-zimmer", job: "Композитор" },
    ],
  },
  "2": {
    cast: [
      { personId: "matthew-mcconaughey", character: "Купер", order: 1 },
      { personId: "anne-hathaway", character: "Амелия Брэнд", order: 2 },
      { personId: "jessica-chastain", character: "Мёрф", order: 3 },
    ],
    crew: [
      { personId: "christopher-nolan", job: "Режиссёр" },
      { personId: "jonathan-nolan", job: "Сценарист" },
      { personId: "hoyte-van-hoytema", job: "Оператор-постановщик" },
      { personId: "hans-zimmer", job: "Композитор" },
    ],
  },
  "3": {
    cast: [
      { personId: "michael-j-fox", character: "Марти Макфлай", order: 1 },
      { personId: "christopher-lloyd", character: "Доктор Эмметт Браун", order: 2 },
      { personId: "lea-thompson", character: "Лоррейн Бэйнс", order: 3 },
    ],
    crew: [
      { personId: "robert-zemeckis", job: "Режиссёр" },
      { personId: "bob-gale", job: "Сценарист" },
      { personId: "dean-cundey", job: "Оператор-постановщик" },
      { personId: "alan-silvestri", job: "Композитор" },
    ],
  },
  "4": {
    cast: [
      { personId: "timothee-chalamet", character: "Пол Атрейдес", order: 1 },
      { personId: "rebecca-ferguson", character: "Леди Джессика", order: 2 },
      { personId: "oscar-isaac", character: "Герцог Лето Атрейдес", order: 3 },
    ],
    crew: [
      { personId: "denis-villeneuve", job: "Режиссёр" },
      { personId: "eric-roth", job: "Сценарист" },
      { personId: "jon-spaihts", job: "Сценарист" },
      { personId: "greig-fraser", job: "Оператор-постановщик" },
      { personId: "hans-zimmer", job: "Композитор" },
    ],
  },
  "5": {
    cast: [
      { personId: "timothee-chalamet", character: "Пол Атрейдес", order: 1 },
      { personId: "zendaya", character: "Чани", order: 2 },
      { personId: "florence-pugh", character: "Принцесса Ирулан", order: 3 },
    ],
    crew: [
      { personId: "denis-villeneuve", job: "Режиссёр" },
      { personId: "denis-villeneuve", job: "Сценарист" },
      { personId: "jon-spaihts", job: "Сценарист" },
      { personId: "greig-fraser", job: "Оператор-постановщик" },
      { personId: "hans-zimmer", job: "Композитор" },
    ],
  },
  "6": {
    cast: [
      { personId: "arnold-schwarzenegger", character: "Терминатор", order: 1 },
      { personId: "linda-hamilton", character: "Сара Коннор", order: 2 },
      { personId: "edward-furlong", character: "Джон Коннор", order: 3 },
      { personId: "robert-patrick", character: "Т-1000", order: 4 },
    ],
    crew: [
      { personId: "james-cameron", job: "Режиссёр" },
      { personId: "james-cameron", job: "Сценарист" },
      { personId: "adam-greenberg", job: "Оператор-постановщик" },
      { personId: "brad-fiedel", job: "Композитор" },
    ],
  },
  "7": {
    cast: [
      { personId: "sigourney-weaver", character: "Эллен Рипли", order: 1 },
      { personId: "tom-skerritt", character: "Даллас", order: 2 },
      { personId: "john-hurt", character: "Кейн", order: 3 },
    ],
    crew: [
      { personId: "ridley-scott", job: "Режиссёр" },
      { personId: "dan-obanonn", job: "Сценарист" },
      { personId: "derek-vanlint", job: "Оператор-постановщик" },
      { personId: "jerry-goldsmith", job: "Композитор" },
    ],
  },
  "8": {
    cast: [
      { personId: "keanu-reeves", character: "Нео", order: 1 },
      { personId: "carrie-anne-moss", character: "Тринити", order: 2 },
      { personId: "laurence-fishburne", character: "Морфеус", order: 3 },
    ],
    crew: [
      { personId: "lana-wachowski", job: "Режиссёр" },
      { personId: "lilly-wachowski", job: "Режиссёр" },
      { personId: "lana-wachowski", job: "Сценарист" },
      { personId: "lilly-wachowski", job: "Сценарист" },
      { personId: "bill-pope", job: "Оператор-постановщик" },
      { personId: "don-davis", job: "Композитор" },
    ],
  },
  "9": {
    cast: [
      { personId: "hugh-jackman", character: "Роберт Энджер", order: 1 },
      { personId: "christian-bale", character: "Альфред Борден", order: 2 },
      { personId: "scarlett-johansson", character: "Оливия Уэнскомб", order: 3 },
    ],
    crew: [
      { personId: "christopher-nolan", job: "Режиссёр" },
      { personId: "christopher-nolan", job: "Сценарист" },
      { personId: "wally-pfister", job: "Оператор-постановщик" },
    ],
  },
  "10": {
    cast: [
      { personId: "miles-teller", character: "Эндрю Ниман", order: 1 },
      { personId: "j-k-simmons", character: "Теренс Флетчер", order: 2 },
    ],
    crew: [
      { personId: "damien-chazelle", job: "Режиссёр" },
      { personId: "damien-chazelle", job: "Сценарист" },
      { personId: "sharone-meir", job: "Оператор-постановщик" },
      { personId: "justin-hurwitz", job: "Композитор" },
    ],
  },
  "11": {
    cast: [
      { personId: "robert-de-niro", character: "Трэвис Бикл", order: 1 },
      { personId: "jodie-foster", character: "Айрис", order: 2 },
      { personId: "cybill-shepherd", character: "Бетси", order: 3 },
      { personId: "harvey-keitel", character: "Мэттью «Спорт»", order: 4 },
    ],
    crew: [
      { personId: "martin-scorsese", job: "Режиссёр" },
      { personId: "paul-schrader", job: "Сценарист" },
      { personId: "michael-chapman", job: "Оператор-постановщик" },
      { personId: "bernard-herrmann", job: "Композитор" },
    ],
  },
  "12": {
    cast: [
      { personId: "edward-norton", character: "Рассказчик", order: 1 },
      { personId: "brad-pitt", character: "Тайлер Дёрден", order: 2 },
      { personId: "helena-bonham-carter", character: "Марла Сингер", order: 3 },
    ],
    crew: [
      { personId: "david-fincher", job: "Режиссёр" },
      { personId: "darius-khondji", job: "Оператор-постановщик" },
    ],
  },
  "13": {
    cast: [
      { personId: "marlon-brando", character: "Вито Корлеоне", order: 1 },
      { personId: "al-pacino", character: "Майкл Корлеоне", order: 2 },
      { personId: "james-caan", character: "Сонни Корлеоне", order: 3 },
    ],
    crew: [
      { personId: "francis-ford-coppola", job: "Режиссёр" },
      { personId: "mario-puzo", job: "Сценарист" },
      { personId: "francis-ford-coppola", job: "Сценарист" },
      { personId: "gordon-willis", job: "Оператор-постановщик" },
      { personId: "nino-rota", job: "Композитор" },
    ],
  },
  "14": {
    cast: [
      { personId: "john-travolta", character: "Винсент Вега", order: 1 },
      { personId: "samuel-l-jackson", character: "Джулс Уиннфилд", order: 2 },
      { personId: "uma-thurman", character: "Миа Уоллес", order: 3 },
    ],
    crew: [
      { personId: "quentin-tarantino", job: "Режиссёр" },
      { personId: "quentin-tarantino", job: "Сценарист" },
      { personId: "andrew-sekula", job: "Оператор-постановщик" },
    ],
  },
  "15": {
    cast: [
      { personId: "tim-robbins", character: "Энди Дюфрейн", order: 1 },
      { personId: "morgan-freeman", character: "Эллис Бойд «Ред» Реддинг", order: 2 },
    ],
    crew: [
      { personId: "frank-darabont", job: "Режиссёр" },
      { personId: "frank-darabont", job: "Сценарист" },
      { personId: "stephen-king", job: "Автор повести" },
      { personId: "roger-deakins", job: "Оператор-постановщик" },
      { personId: "thomas-newman", job: "Композитор" },
    ],
  },
  "16": {
    cast: [
      { personId: "morgan-freeman", character: "Уильям Сомерсет", order: 1 },
      { personId: "brad-pitt", character: "Дэвид Миллз", order: 2 },
      { personId: "gwyneth-paltrow", character: "Трейси Миллз", order: 3 },
    ],
    crew: [
      { personId: "david-fincher", job: "Режиссёр" },
      { personId: "kevin-walker", job: "Сценарист" },
      { personId: "darius-khondji", job: "Оператор-постановщик" },
    ],
  },
  "17": {
    cast: [
      { personId: "joaquin-phoenix", character: "Теодор Туомбли", order: 1 },
      { personId: "scarlett-johansson", character: "Саманта (голос)", order: 2 },
    ],
    crew: [
      { personId: "spike-jonze", job: "Режиссёр" },
      { personId: "spike-jonze", job: "Сценарист" },
    ],
  },
  "18": {
    cast: [
      { personId: "ryan-gosling", character: "Водитель", order: 1 },
      { personId: "carey-mulligan", character: "Ирен", order: 2 },
      { personId: "bryan-cranston", character: "Шеннон", order: 3 },
    ],
    crew: [
      { personId: "nicolas-winding-refn", job: "Режиссёр" },
      { personId: "hossein-amini", job: "Сценарист" },
      { personId: "newton-thomas-sigel", job: "Оператор-постановщик" },
      { personId: "cliff-martinez", job: "Композитор" },
    ],
  },
  "19": {
    cast: [
      { personId: "cillian-murphy", character: "Дж. Роберт Оппенгеймер", order: 1 },
      { personId: "emily-blunt", character: "Кэтрин Оппенгеймер", order: 2 },
      { personId: "robert-downey-jr", character: "Льюис Штраус", order: 3 },
    ],
    crew: [
      { personId: "christopher-nolan", job: "Режиссёр" },
      { personId: "christopher-nolan", job: "Сценарист" },
      { personId: "hoyte-van-hoytema", job: "Оператор-постановщик" },
      { personId: "ludwig-goransson", job: "Композитор" },
    ],
  },
  "20": {
    cast: [
      { personId: "michelle-yeoh", character: "Эвелин Ванг", order: 1 },
      { personId: "ke-huy-quan", character: "Уэймонд Ванг", order: 2 },
      { personId: "jamie-lee-curtis", character: "Дейрдре Бобейрдр", order: 3 },
    ],
    crew: [
      { personId: "daniel-kwan", job: "Режиссёр" },
      { personId: "daniel-scheinert", job: "Режиссёр" },
      { personId: "daniel-kwan", job: "Сценарист" },
      { personId: "daniel-scheinert", job: "Сценарист" },
      { personId: "larkin-seiple", job: "Оператор-постановщик" },
      { personId: "son-lux", job: "Композитор" },
    ],
  },
  "21": {
    cast: [
      { personId: "sylvester-stallone", character: "Рокки Бальбоа", order: 1 },
      { personId: "talia-shire", character: "Эдриан Пеннино", order: 2 },
      { personId: "carl-weathers", character: "Аполло Крид", order: 3 },
    ],
    crew: [
      { personId: "john-g-avildsen", job: "Режиссёр" },
      { personId: "sylvester-stallone", job: "Сценарист" },
      { personId: "bill-butler", job: "Оператор-постановщик" },
      { personId: "bill-conti", job: "Композитор" },
    ],
  },
};
