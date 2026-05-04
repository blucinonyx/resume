export enum Lang {
  EN = 'en',
  UK = 'uk',
}

export const ALL_LANGS: readonly Lang[] = Object.freeze([Lang.EN, Lang.UK]);

// Display label only — the underlying locale code stays `uk` (ISO 639-1).
// `UA` is shown to users because it's the more familiar identifier (it
// matches the country/flag) for the Ukrainian-speaking audience.
export const LANG_LABELS: Readonly<Record<Lang, string>> = Object.freeze({
  [Lang.EN]: 'EN',
  [Lang.UK]: 'UA',
});
