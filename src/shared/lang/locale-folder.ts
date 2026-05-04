import { Lang } from '@/shared/types/Lang';

// Locale code → folder slug used inside src/shared/lang/.
// The locale code stays `uk` (ISO 639-1) per project convention; only
// the folder name and user-visible CV filenames use `ua`.
export const LOCALE_FOLDER: Readonly<Record<Lang, 'en' | 'ua'>> = Object.freeze({
  [Lang.EN]: 'en',
  [Lang.UK]: 'ua',
});
