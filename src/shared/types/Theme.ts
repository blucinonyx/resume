export enum Theme {
  Dark = 'dark',
  Light = 'light',
  Cyber = 'cyber',
}

export const ALL_THEMES: readonly Theme[] = Object.freeze([Theme.Dark, Theme.Light, Theme.Cyber]);

export const THEME_LABELS: Readonly<Record<Theme, string>> = Object.freeze({
  [Theme.Dark]: 'Dark',
  [Theme.Light]: 'Light',
  [Theme.Cyber]: 'Cyber',
});
