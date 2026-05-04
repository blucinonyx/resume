import type { MedserviceBundle } from '../../types';

// Shared by PageSpeedDash + ApprovalFlow.
export const medservice: MedserviceBundle = Object.freeze({
  // PageSpeedDash
  pageSpeed: Object.freeze({
    title: 'PageSpeed Insights · apteka-med-service.ru',
    mobile: 'Mobile',
    desktop: 'Desktop',
    diploma: 'Best Project · Company Vote',
    note: 'Visit card for the pharmacy on WordPress — custom theme written from scratch plus my own plugins. Hit 100 / 100 on both Mobile and Desktop with the PageSpeed algorithms of the time.',
    metrics: Object.freeze([
      { key: 'FCP', value: '1.2s' },
      { key: 'LCP', value: '1.8s' },
      { key: 'CLS', value: '0.00' },
      { key: 'TTI', value: '2.1s' },
    ]),
  }),
  // ApprovalFlow
  approvalFlow: Object.freeze({
    label: 'Business-process automation · Bitrix corporate portal',
    diploma: 'Best Project · Company Vote',
    stages: Object.freeze(['Request', 'Manager', 'Director', 'Archive']),
    note: 'A workflow that replaced paper sign-offs with a 4-step digital chain. Colleagues voted it best project of the year.',
    processed: 'processed',
  }),
});
