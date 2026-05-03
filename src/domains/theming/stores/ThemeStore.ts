import { defineStore } from 'pinia';
import { Theme, ALL_THEMES } from '@/shared/types/Theme';

const STORAGE_KEY = 'resume.theme';
const THEME_ATTR = 'data-theme';

interface ThemeState {
  current: Theme;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    current: ThemeStoreActions.readPersistedTheme(),
  }),

  getters: {
    available: (): readonly Theme[] => ALL_THEMES,
  },

  actions: {
    set(theme: Theme): void {
      this.current = theme;
      ThemeStoreActions.applyToDom(theme);
      ThemeStoreActions.persist(theme);
    },

    cycle(): void {
      const idx = ALL_THEMES.indexOf(this.current);
      const next = ALL_THEMES[(idx + 1) % ALL_THEMES.length] ?? Theme.Dark;
      this.set(next);
    },

    init(): void {
      ThemeStoreActions.applyToDom(this.current);
    },
  },
});

class ThemeStoreActions {
  static readPersistedTheme(): Theme {
    if (typeof localStorage === 'undefined') return Theme.Dark;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (ALL_THEMES as readonly string[]).includes(stored)) {
      return stored as Theme;
    }
    return Theme.Dark;
  }

  static applyToDom(theme: Theme): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  static persist(theme: Theme): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
