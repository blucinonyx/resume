import { PeriodSlug, type PeriodContentMap } from '@/shared/types/Period';

export const CONTENT_EN: PeriodContentMap = Object.freeze({
  [PeriodSlug.Keyapp]: {
    title: 'Keyapp',
    subtitle: 'Tech Lead / Full-Stack Developer',
    location: 'Kyiv (remote-friendly)',
    url: 'https://keyapp.top',
    context:
      'App-store-optimisation SaaS — keyword installs, ratings and analytics across Google Play and the App Store; 43,000+ clients in 30+ niches and coverage across 200+ regions. I own engineering across two products in the Keyapp portfolio.',
    bullets: [
      'Tech Lead and Team Lead. Built the engineering team from zero to a steady five (1 FE, 1 BE, 1 QA + me; alongside CTO). Run code review, hiring loops and onboarding.',
      'Designed the new platform architecture and led the migration off the legacy version.',
      'Designed event-driven ingestion on Laravel + RabbitMQ + ClickHouse + Redis; scaled ClickHouse inserts from 1M to 124M rows/day (~20 TB daily traffic).',
      'Built a Node.js WebSocket notification layer (Pusher-style) so dashboards push real-time updates without polling.',
      'Designed and rolled out a domain-driven Vue 3 + TypeScript + Pinia front-end architecture — 32 domains, each with its own aggregate, Pinia store, repositories, interfaces and utils. Migrated 30+ legacy modules; the canonical reference module is the standard the team writes new pages against.',
      'Wrote and own the Docker configuration for both products end-to-end — multi-service stack (nginx, PHP, MariaDB, Redis, ClickHouse, supervisor) + Kubernetes for orchestration. Grafana + Loki for metrics and log aggregation.',
      'Built the CI/CD pipeline from scratch — first on GitLab, later migrated to Bitbucket Pipelines with zero-downtime deploys, environment templates per dev/live/prod, and a one-time server-provisioning script.',
      'Designed multi-threaded worker patterns with lock-based concurrency (RabbitMQ + DB locks) for safe parallel batch ingestion.',
    ],
    metrics: [
      { key: 'events/day', value: '1M → 124M' },
      { key: 'daily traffic', value: '~20 TB' },
      { key: 'team grown', value: '0 → 5 (lead)' },
      { key: 'products owned', value: '2' },
      { key: 'FE domains', value: '32 (30+ migrated)' },
      { key: 'clients', value: '43K+' },
    ],
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
    location: 'Kyiv',
    url: 'https://koshelok.ua',
    context: 'Lending / wallet fintech (consumer credit).',
    bullets: [
      'Joined to build the new product on Laravel + Vue.js + MySQL + Webpack.',
      'Engagement ended after three months when wartime market conditions paused the lending business; the team scaled down with the project.',
    ],
    metrics: [
      { key: 'tenure', value: '4 months' },
      { key: 'reason for leaving', value: 'wartime business pause' },
    ],
    stack: ['Laravel', 'Vue.js', 'MySQL', 'Webpack', 'PHP 8'],
    quote: null,
  },

  [PeriodSlug.Xpay]: {
    title: 'XPAY GROUP',
    subtitle: 'Full-Stack PHP / Yii2 Developer',
    location: 'Kyiv',
    url: null,
    context:
      'Payment platform; the acquirer integrated with one of Ukraine’s largest banks.',
    bullets: [
      'Built and maintained payment-integration code primarily on Yii2 (~90% of the work), with PostgreSQL + MySQL + jQuery; Laravel was about 10% of the codebase.',
      'Joined hoping for Laravel work; closed essentially all assigned Yii2 tickets and then left to focus on Laravel-only roles.',
    ],
    metrics: [
      { key: 'tenure', value: '9 months' },
      { key: 'Yii2 share', value: '~90%' },
      { key: 'Laravel share', value: '~10%' },
    ],
    stack: ['Yii2', 'Laravel', 'PHP', 'PostgreSQL', 'MySQL', 'jQuery'],
    quote: null,
  },

  [PeriodSlug.ClickDealer]: {
    title: 'ClickDealer',
    subtitle: 'Mid PHP Developer',
    location: 'Dnipro',
    url: null,
    context: 'Short engagement on internal portal features.',
    bullets: ['Worked on internal portal features in Silex.'],
    metrics: [{ key: 'tenure', value: '2 months' }],
    stack: ['Silex', 'PHP', 'MySQL'],
    quote: null,
  },

  [PeriodSlug.MedService]: {
    title: 'Mеd-Serviсe',
    subtitle: 'Bitrix Architect',
    location: 'Dnipro',
    url: 'https://online-apteka.com.ua',
    context: 'National pharmacy chain — Bitrix-based corporate portal and B2C online pharmacy.',
    bullets: [
      'Co-rolled out a new platform version with one colleague — owned the larger share of architecture and module work.',
      'Re-designed the company’s business-process workflows on the Bitrix corporate portal.',
      'Maintained and extended the e-commerce store online-apteka.com.ua.',
      'Built the small business-card site apteka-med-service.ru from scratch (PHP + CSS + HTML + JS).',
      'Designed an internal business-process automation project; chosen as the best project by company-wide team vote, awarded a company diploma.',
      'Optimised MySQL queries and added caching to keep the portal responsive at scale.',
    ],
    metrics: [
      { key: 'tenure', value: '2 years (full-time)' },
      { key: 'sites shipped', value: '2 + corporate portal' },
      { key: 'recognition', value: 'best-project diploma' },
    ],
    stack: ['Bitrix', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    quote: null,
  },

  [PeriodSlug.Karbosnab]: {
    title: 'karbosnab.com',
    subtitle: 'Full-Stack Developer',
    location: 'remote',
    url: null,
    context: 'Built an e-commerce store from scratch (in parallel with Mеd-Serviсe).',
    bullets: [
      'Frontend: vanilla JS, Gulp, SASS, HTML, Photoshop assets.',
      'Backend: PHP 7.4, Laravel 7, MySQL, Ubuntu.',
    ],
    metrics: [{ key: 'tenure', value: '2 years (part-time)' }],
    stack: ['PHP 7.4', 'Laravel 7', 'MySQL', 'Vanilla JS', 'SASS', 'Gulp', 'Ubuntu'],
    quote: null,
  },

  [PeriodSlug.WizardsDev]: {
    title: 'WizardsDev',
    subtitle: 'PHP Developer',
    location: 'Dnipro',
    url: 'https://wizardsdev.com',
    context: 'Worked inside the frontend team on PHP plugins and widgets across ~10 finance/forex sites.',
    bullets: [
      'Sites contributed to: maximarkets.org, eland.kiev.ua, finprotect.info, birzha.name, forex-helper.ru, top-technology.com.ua, globalcloudteam.com, fx-strategy.info, business-oppurtunities.com.',
    ],
    metrics: [
      { key: 'tenure', value: '3 months' },
      { key: 'sites contributed', value: '~10' },
    ],
    stack: ['PHP', 'JavaScript', 'HTML/CSS', 'WordPress', 'Custom CMS'],
    quote: null,
  },

  [PeriodSlug.FreelanceLate]: {
    title: 'Freelance',
    subtitle: 'Web Developer',
    location: 'Ukraine',
    url: null,
    context: 'Various small PHP fixes between contract roles.',
    bullets: [],
    metrics: [{ key: 'tenure', value: '7 months' }],
    stack: ['PHP', 'JavaScript', 'HTML', 'CSS'],
    quote: null,
  },

  [PeriodSlug.Marines]: {
    title: 'Ukrainian Marines',
    subtitle: 'Enlisted service',
    location: 'Mykolaiv',
    url: null,
    context:
      'Two years in the Ukrainian Navy Marine Corps. Discipline and stress endurance I now lean on during production incidents.',
    bullets: [],
    metrics: [
      { key: 'tenure', value: '1 year 9 months' },
      { key: 'transferable', value: 'discipline · ownership · pressure' },
    ],
    stack: [],
    quote: null,
  },

  [PeriodSlug.FreelanceEarly]: {
    title: 'Freelance',
    subtitle: 'Back-end PHP Developer',
    location: 'Dnipro',
    url: null,
    context: 'First commercial years — small PHP backend projects.',
    bullets: [
      'Projects: enjoy-ukraine.com, lumberjack.style, moscowteslaclub.ru.',
    ],
    metrics: [{ key: 'tenure', value: '2 years 6 months' }],
    stack: ['PHP', 'CSS', 'JS', 'HTML', 'Yii1'],
    quote: null,
  },

  [PeriodSlug.Rechout]: {
    title: 'Rechout',
    subtitle: 'Junior C# Developer',
    location: 'Dnipro',
    url: null,
    context: 'Short engagement on a catalogue project.',
    bullets: ['Catalogue with products and categories on C# + Web API + SQL + Angular + JSON + Ajax + MVC.'],
    metrics: [{ key: 'tenure', value: '2 months' }],
    stack: ['C#', '.NET', 'Web API', 'SQL', 'Angular'],
    quote: null,
  },

  [PeriodSlug.GoIT]: {
    title: 'GoIT',
    subtitle: 'JavaScript & web fundamentals',
    location: 'Online',
    url: 'https://goit.global',
    context: 'Online bootcamp covering HTML, CSS and JavaScript modules.',
    bullets: [
      'Completed JS, HTML and CSS modules; did not continue into the Node.js / React tracks since they were not used at work.',
    ],
    metrics: [{ key: 'period', value: '2018 – 2019' }],
    stack: ['JavaScript', 'HTML', 'CSS'],
    quote: null,
  },

  [PeriodSlug.MykolaivBachelor]: {
    title: 'Mykolaiv University',
    subtitle: 'Bachelor in Finance & Credit',
    location: 'Mykolaiv',
    url: null,
    context: 'Two parallel degrees in finance — Bachelor following Associate.',
    bullets: [],
    metrics: [{ key: 'period', value: '2013 – 2015' }],
    stack: ['Finance', 'Credit', 'Macro'],
    quote: null,
  },

  [PeriodSlug.MykolaivAssociate]: {
    title: 'Mykolaiv University',
    subtitle: 'Associate in Accounting & Audit',
    location: 'Mykolaiv',
    url: null,
    context: 'First degree — accounting and audit fundamentals.',
    bullets: [],
    metrics: [{ key: 'period', value: '2010 – 2013' }],
    stack: ['Accounting', 'Audit'],
    quote: null,
  },

  [PeriodSlug.StepAcademy]: {
    title: 'STEP IT Academy',
    subtitle: 'Computer Programming',
    location: 'Mykolaiv',
    url: 'https://itstep.org',
    context:
      'Five-year part-time programme — first programming education. Pascal, C++, SQL fundamentals.',
    bullets: [
      'Final-year project: a property-area calculator on VB6 — eight years later it became the demo that landed me my first commercial job.',
    ],
    metrics: [{ key: 'duration', value: '5 years (part-time)' }],
    stack: ['Pascal', 'C++', 'SQL', 'VB6', 'HTML/CSS', 'Algorithms'],
    quote:
      'The calculator I shipped at STEP later became the live demo that got me hired — that’s why I keep building click-it interactives like this site.',
  },
});
