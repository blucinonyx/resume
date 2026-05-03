import { defineStore } from 'pinia';
import { Lang, ALL_LANGS } from '@/shared/types/Lang';

const STORAGE_KEY = 'resume.lang';
const LANG_ATTR = 'lang';

interface I18nState {
  current: Lang;
}

export const useI18nStore = defineStore('i18n', {
  state: (): I18nState => ({
    current: I18nStoreActions.readPersistedLang(),
  }),

  getters: {
    available: (): readonly Lang[] => ALL_LANGS,
    isEN(state): boolean {
      return state.current === Lang.EN;
    },
    isUK(state): boolean {
      return state.current === Lang.UK;
    },
  },

  actions: {
    set(lang: Lang): void {
      this.current = lang;
      I18nStoreActions.applyToDom(lang);
      I18nStoreActions.persist(lang);
    },

    toggle(): void {
      this.set(this.current === Lang.EN ? Lang.UK : Lang.EN);
    },

    init(): void {
      I18nStoreActions.applyToDom(this.current);
    },
  },
});

class I18nStoreActions {
  static readPersistedLang(): Lang {
    if (typeof localStorage === 'undefined') return Lang.EN;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (ALL_LANGS as readonly string[]).includes(stored)) {
      return stored as Lang;
    }
    return Lang.EN;
  }

  static applyToDom(lang: Lang): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(LANG_ATTR, lang);
  }

  static persist(lang: Lang): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, lang);
  }
}
