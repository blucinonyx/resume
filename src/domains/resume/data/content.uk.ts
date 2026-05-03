import { PeriodSlug, type PeriodContentMap } from '@/shared/types/Period';

export const CONTENT_UK: PeriodContentMap = Object.freeze({
  [PeriodSlug.Keyapp]: {
    title: 'Keyapp',
    subtitle: 'Tech Lead / Full-Stack Developer',
    location: 'Київ (remote-friendly)',
    url: 'https://keyapp.top',
    context:
      'ASO SaaS — keyword installs, рейтинги і аналітика для Google Play та Apple App Store; 43 000+ клієнтів у 30+ нішах і покриття 200+ регіонів. Веду інженерію по двох продуктах портфоліо Keyapp.',
    bullets: [
      'Tech Lead і Team Lead. Збудував інженерну команду з нуля до сталих п’яти (1 FE, 1 BE, 1 QA + я; поряд з CTO). Веду code review, hiring loops, онбординг.',
      'Спроєктував архітектуру нової платформи і вів міграцію зі старої версії.',
      'Спроєктував event-driven ingestion на Laravel + RabbitMQ + ClickHouse + Redis; масштабував вставки в ClickHouse з 1 млн до 124 млн рядків/добу (~20 ТБ трафіку щодня).',
      'Збудував WebSocket нотифікаційний шар на Node.js (Pusher-style) — дашборди отримують оновлення в реальному часі без поллінгу.',
      'Спроєктував і впровадив доменно-орієнтовану фронт-енд-архітектуру Vue 3 + TypeScript + Pinia — 32 домени, кожен з власним агрегатом, Pinia store, repositories, інтерфейсами і утилітами. Мігрував 30+ legacy-модулів; canonical reference module — стандарт за яким команда пише нові сторінки.',
      'Написав і володію Docker-конфігами для обох продуктів end-to-end — мульти-сервісний стек (nginx, PHP, MariaDB, Redis, ClickHouse, supervisor) + Kubernetes для оркестрації. Grafana + Loki для метрик і агрегації логів.',
      'Збудував CI/CD пайплайн з нуля — спочатку на GitLab, потім мігрував на Bitbucket Pipelines з zero-downtime deploys, шаблонами середовищ dev/live/prod і скриптом one-time provisioning сервера.',
      'Спроєктував багатопоточні worker-патерни з lock-based concurrency (RabbitMQ + DB locks) для безпечного паралельного batch ingestion.',
    ],
    metrics: [
      { key: 'подій/добу', value: '1М → 124М' },
      { key: 'добовий трафік', value: '~20 ТБ' },
      { key: 'команда зросла', value: '0 → 5 (lead)' },
      { key: 'продуктів веду', value: '2' },
      { key: 'FE-домени', value: '32 (30+ мігровано)' },
      { key: 'клієнтів', value: '43К+' },
    ],
    highlightMetrics: ['добовий трафік', 'команда зросла', 'подій/добу'] as const,
    pinnedDescription:
      'Масштабував ClickHouse <b>1М → 124М рядків/добу</b> на Laravel + RabbitMQ. ' +
      'Зібрав інженерну команду <b>0 → 5</b>. App-store SaaS · <b>43K+ клієнтів</b>.',
    stack: [
      'Laravel 9',
      'Vue 3',
      'TypeScript',
      'SCSS',
      'Webpack',
      'MySQL',
      'Redis',
      'ClickHouse',
      'RabbitMQ',
      'Docker',
      'Kubernetes',
      'Node.js',
      'Grafana',
      'Loki',
    ],
    quote: null,
  },

  [PeriodSlug.KoshelOk]: {
    title: 'KoshelOK',
    subtitle: 'Full-Stack Laravel Developer',
    location: 'Київ',
    url: 'https://koshelok.ua',
    context: 'Кредитний / wallet fintech (споживчі кредити).',
    bullets: [
      'Прийшов будувати новий продукт на Laravel + Vue.js + MySQL + Webpack.',
    ],
    metrics: [{ key: 'тривалість', value: '4 місяці' }],
    stack: ['Laravel', 'Vue.js', 'MySQL', 'Webpack', 'PHP 8'],
    quote: null,
  },

  [PeriodSlug.Xpay]: {
    title: 'XPAY GROUP',
    subtitle: 'Full-Stack PHP / Yii2 Developer',
    location: 'Київ',
    url: null,
    context:
      'Платіжна платформа; acquirer працював з одним із найбільших банків України.',
    bullets: [
      'Будував і підтримував код інтеграції платежів переважно на Yii2 (~90% роботи), з PostgreSQL + MySQL + jQuery; Laravel становив близько 10% кодбази.',
      'Прийшов з надією на Laravel-роботу; закрив фактично всі призначені тікети на Yii2 і пішов щоб працювати тільки з Laravel.',
    ],
    metrics: [
      { key: 'тривалість', value: '9 місяців' },
      { key: 'частка Yii2', value: '~90%' },
      { key: 'частка Laravel', value: '~10%' },
    ],
    stack: ['Yii2', 'Laravel', 'PHP', 'PostgreSQL', 'MySQL', 'jQuery'],
    quote: null,
  },

  [PeriodSlug.ClickDealer]: {
    title: 'ClickDealer',
    subtitle: 'Mid PHP Developer',
    location: 'Дніпро',
    url: null,
    context: 'Короткий контракт — внутрішній портал.',
    bullets: ['Працював над фічами внутрішнього порталу на Silex.'],
    metrics: [{ key: 'тривалість', value: '2 місяці' }],
    stack: ['Silex', 'PHP', 'MySQL'],
    quote: null,
  },

  [PeriodSlug.MedService]: {
    title: 'Мед-Сервіс',
    subtitle: 'Bitrix Architect',
    location: 'Дніпро',
    url: 'https://online-apteka.com.ua',
    context: 'Національна мережа аптек — Bitrix-портал і B2C інтернет-аптека.',
    bullets: [
      'Розгортав нову версію платформи разом з колегою — більша частина архітектури і модулів моя.',
      'Перепроєктував workflow бізнес-процесів компанії на корпоративному порталі Bitrix.',
      'Підтримував і розвивав інтернет-магазин online-apteka.com.ua.',
      'Зробив з нуля сайт-візитку apteka-med-service.ru (PHP + CSS + HTML + JS).',
      'Спроєктував проект автоматизації внутрішніх бізнес-процесів; обрано найкращим за загальнокорпоративним голосуванням, нагороджений дипломом компанії.',
      'Оптимізував MySQL-запити і додав кешування щоб портал лишався чуйним при навантаженні.',
    ],
    metrics: [
      { key: 'тривалість', value: '2 роки (full-time)' },
      { key: 'сайтів запущено', value: '2 + корп. портал' },
      { key: 'визнання', value: 'диплом за best project' },
    ],
    stack: ['Bitrix', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    quote: null,
  },

  [PeriodSlug.Karbosnab]: {
    title: 'karbosnab.com',
    subtitle: 'Full-Stack Developer',
    location: 'remote',
    url: null,
    context: 'Збудував e-commerce магазин з нуля (паралельно з Мед-Сервіс).',
    bullets: [
      'Frontend: vanilla JS, Gulp, SASS, HTML, асети у Photoshop.',
      'Backend: PHP 7.4, Laravel 7, MySQL, Ubuntu.',
    ],
    metrics: [{ key: 'тривалість', value: '2 роки (part-time)' }],
    stack: ['PHP 7.4', 'Laravel 7', 'MySQL', 'Vanilla JS', 'SASS', 'Gulp', 'Ubuntu'],
    quote: null,
  },

  [PeriodSlug.WizardsDev]: {
    title: 'WizardsDev',
    subtitle: 'PHP Developer',
    location: 'Дніпро',
    url: 'https://wizardsdev.com',
    context: 'Працював у frontend-команді над PHP-плагінами і віджетами для ~10 finance/forex сайтів.',
    bullets: [
      'Сайти: maximarkets.org, eland.kiev.ua, finprotect.info, birzha.name, forex-helper.ru, top-technology.com.ua, globalcloudteam.com, fx-strategy.info, business-oppurtunities.com.',
    ],
    metrics: [
      { key: 'тривалість', value: '3 місяці' },
      { key: 'сайтів', value: '~10' },
    ],
    stack: ['PHP', 'JavaScript', 'HTML/CSS', 'WordPress', 'Custom CMS'],
    quote: null,
  },

  [PeriodSlug.FreelanceLate]: {
    title: 'Фріланс',
    subtitle: 'Web Developer',
    location: 'Україна',
    url: null,
    context: 'Дрібні фікси на PHP між контрактами.',
    bullets: [],
    metrics: [{ key: 'тривалість', value: '7 місяців' }],
    stack: ['PHP', 'JavaScript', 'HTML', 'CSS'],
    quote: null,
  },

  [PeriodSlug.Marines]: {
    title: 'ВМС України · морська піхота',
    subtitle: 'Військовослужбовець',
    location: 'Миколаїв',
    url: null,
    context:
      'Два роки у морській піхоті ВМС України. Дисципліна і стресостійкість — звички якими користуюся під час production-incidentів.',
    bullets: [],
    metrics: [
      { key: 'тривалість', value: '1 рік 9 місяців' },
      { key: 'transferable', value: 'дисципліна · ownership · стрес' },
    ],
    stack: [],
    quote: null,
  },

  [PeriodSlug.FreelanceEarly]: {
    title: 'Фріланс',
    subtitle: 'Back-end PHP Developer',
    location: 'Дніпро',
    url: null,
    context: 'Перші комерційні роки — невеликі PHP backend проекти.',
    bullets: [
      'Проекти: enjoy-ukraine.com, lumberjack.style, moscowteslaclub.ru.',
    ],
    metrics: [{ key: 'тривалість', value: '2 роки 6 місяців' }],
    stack: ['PHP', 'CSS', 'JS', 'HTML', 'Yii1'],
    quote: null,
  },

  [PeriodSlug.Rechout]: {
    title: 'Rechout',
    subtitle: 'Junior C# Developer',
    location: 'Дніпро',
    url: null,
    context: 'Короткий контракт — каталог-проект.',
    bullets: ['Каталог з товарами і категоріями: C# + Web API + SQL + Angular + JSON + Ajax + MVC.'],
    metrics: [{ key: 'тривалість', value: '2 місяці' }],
    stack: ['C#', '.NET', 'Web API', 'SQL', 'Angular'],
    quote: null,
  },

  [PeriodSlug.GoIT]: {
    title: 'GoIT',
    subtitle: 'JavaScript і веб-основи',
    location: 'Онлайн',
    url: 'https://goit.global',
    context: 'Онлайн-bootcamp по HTML, CSS та JavaScript-модулях.',
    bullets: [],
    metrics: [{ key: 'період', value: '2018 – 2019' }],
    stack: ['JavaScript', 'HTML', 'CSS'],
    quote: null,
  },

  [PeriodSlug.MykolaivBachelor]: {
    title: 'Миколаївський університет',
    subtitle: 'Бакалавр з фінансів і кредиту',
    location: 'Миколаїв',
    url: null,
    context: 'Два паралельні дипломи з фінансів — Бакалавр після Молодшого спеціаліста.',
    bullets: [],
    metrics: [{ key: 'період', value: '2013 – 2015' }],
    stack: ['Фінанси', 'Кредит', 'Макро'],
    quote: null,
  },

  [PeriodSlug.MykolaivAssociate]: {
    title: 'Миколаївський університет',
    subtitle: 'Молодший спеціаліст, бухгалтерський облік і аудит',
    location: 'Миколаїв',
    url: null,
    context: 'Перший диплом — основи бухгалтерського обліку і аудиту.',
    bullets: [],
    metrics: [{ key: 'період', value: '2010 – 2013' }],
    stack: ['Бухоблік', 'Аудит'],
    quote: null,
  },

  [PeriodSlug.StepAcademy]: {
    title: 'Академія ШАГ',
    subtitle: 'Комп’ютерне програмування',
    location: 'Миколаїв',
    url: 'https://itstep.org',
    context:
      'П’ятирічна вечірня програма — перша освіта з програмування. Курс включав JavaScript, C++, C#, CI, PHP, HTML і SQL.',
    bullets: [
      'Дипломний проект: калькулятор площі нерухомості на VB6 — через вісім років він став демо-проектом, який приніс мою першу комерційну роботу.',
    ],
    metrics: [{ key: 'тривалість', value: '5 років (part-time)' }],
    stack: ['JavaScript', 'C++', 'C#', 'CI', 'PHP', 'HTML', 'SQL', 'VB6'],
    quote:
      'Калькулятор написаний на ШАГ став live-демо що принесло першу роботу — звідси звичка робити інтерактивні штуки на кшталт цього сайту.',
  },
});
