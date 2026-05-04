import { computed, type ComputedRef } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';
import * as enBundle from '@/shared/lang/en';
import * as uaBundle from '@/shared/lang/ua';

// Single source of truth for the localised UI string shape — anything we
// add to `en/` must have a matching entry in `ua/` or TypeScript will fail
// the BUNDLES assignment below.
export type LangBundle = typeof enBundle;

const BUNDLES: Readonly<Record<Lang, LangBundle>> = {
  [Lang.EN]: enBundle,
  [Lang.UK]: uaBundle,
};

// Reactive bundle for the active locale. Use as `const lang = useLang()`
// then read like `lang.value.header.home` / `lang.value.periods.keyapp.title`.
// No runtime key lookup, no `if (lang === EN)` branches — typed access only.
export function useLang(): ComputedRef<LangBundle> {
  const i18n = useI18nStore();
  return computed(() => BUNDLES[i18n.current]);
}
