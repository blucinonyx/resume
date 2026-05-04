// Cross-domain string-formatting helpers. Class-with-static-methods per
// project convention (no module-level helper functions in services/).

export class FormatService {
  /**
   * Convert a zero-based index to a padded label, e.g. 0 → "01", 9 → "10".
   * Replaces inline `String(i + 1).padStart(2, '0')` in templates.
   */
  static stepNumber(i: number, width = 2): string {
    return String(i + 1).padStart(width, '0');
  }

  /**
   * Group-separated big-number formatting (en-US locale) used by the
   * pipeline simulator + payment console for "1,234,567".
   */
  static thousands(n: number, locale = 'en-US'): string {
    return n.toLocaleString(locale);
  }

  /**
   * Two-decimal currency-friendly format used by the karbosnab roof
   * calculator. Locale-grouped, fixed fraction.
   */
  static currency2dp(value: number, locale = 'en-US'): string {
    return value.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Zero-pad a number to a given width: pad(5, 3) → "005".
   * Replaces the local `pad()` helpers in payment console.
   */
  static pad(n: number, width = 2): string {
    return String(n).padStart(width, '0');
  }
}
