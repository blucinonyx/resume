export enum Lang {
  EN = 'en',
  UK = 'uk',
}

export const ALL_LANGS: readonly Lang[] = Object.freeze([Lang.EN, Lang.UK]);

export const LANG_LABELS: Readonly<Record<Lang, string>> = Object.freeze({
  [Lang.EN]: 'EN',
  [Lang.UK]: 'UK',
});
