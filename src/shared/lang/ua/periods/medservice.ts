import type { MedserviceBundle } from '../../types';

export const medservice: MedserviceBundle = Object.freeze({
  pageSpeed: Object.freeze({
    title: 'PageSpeed Insights · apteka-med-service.ru',
    mobile: 'Mobile',
    desktop: 'Desktop',
    diploma: 'Найкращий проект · Голосування',
    note: 'Візит-кард аптеки на WordPress — тема написана з нуля + власні плагіни. Здобув 100 / 100 і на Mobile, і на Desktop за алгоритмами PageSpeed того часу.',
    metrics: Object.freeze([
      { key: 'FCP', value: '1.2с' },
      { key: 'LCP', value: '1.8с' },
      { key: 'CLS', value: '0.00' },
      { key: 'TTI', value: '2.1с' },
    ]),
  }),
  approvalFlow: Object.freeze({
    label: 'Автоматизація бізнес-процесів · Bitrix корп. портал',
    diploma: 'Найкращий проект · Голосування',
    stages: Object.freeze(['Заявка', 'Менеджер', 'Директор', 'Архів']),
    note: 'Workflow що замінив паперові підписи 4-етапним цифровим ланцюжком. Колеги обрали проектом року.',
    processed: 'оброблено',
  }),
});
