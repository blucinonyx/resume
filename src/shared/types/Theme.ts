export enum Theme {
  Dark = 'dark',
  Light = 'light',
  Cyber = 'cyber',
  Indigo = 'indigo',
}

export const ALL_THEMES: readonly Theme[] = Object.freeze([
  Theme.Dark,
  Theme.Light,
  Theme.Cyber,
  Theme.Indigo,
]);

export const THEME_LABELS: Readonly<Record<Theme, string>> = Object.freeze({
  [Theme.Dark]: 'Dark',
  [Theme.Light]: 'Light',
  [Theme.Cyber]: 'Cyber',
  [Theme.Indigo]: 'Indigo',
});
