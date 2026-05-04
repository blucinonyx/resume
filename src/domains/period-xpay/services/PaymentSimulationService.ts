import { FormatService } from '@/shared/utils/format';
import type { CardBrand } from '../interface/PaymentTypes';

// Public XPAY partners + a couple of generic merchants from sectors
// xpay services (hotels, microfinance, insurance, tour-operators, utilities, retail).
const MERCHANTS: readonly string[] = Object.freeze([
  'yakaboo.ua',
  'sportlife.ua',
  'smartplanet.ua',
  'otpusk.com',
  'hotel.kiev',
  'mfo.express',
  'insure.ua',
  'utility.kyiv',
]);

export class PaymentSimulationService {
  /** Weighted toward small/mid charges. Returns whole UAH amount. */
  static randAmount(): number {
    const r = Math.random();
    if (r < 0.55) return Math.round(50 + Math.random() * 450);
    if (r < 0.85) return Math.round(500 + Math.random() * 1500);
    return Math.round(2000 + Math.random() * 8000);
  }

  /** Random four-digit card "last 4". */
  static randCard(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  /** Random transaction id, e.g. "txn_4f3kpqz0". */
  static randTxn(): string {
    return 'txn_' + Math.random().toString(36).slice(2, 10);
  }

  /** Pick a merchant from the canonical XPAY partner list. */
  static randMerchant(): string {
    return MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
  }

  /** Bias toward Visa (60/40). */
  static randBrand(): CardBrand {
    return Math.random() < 0.6 ? 'visa' : 'mc';
  }

  /** "12:34:56.789" formatted live timestamp for the log ticker. */
  static nowStamp(): string {
    const d = new Date();
    return [
      FormatService.pad(d.getHours()),
      FormatService.pad(d.getMinutes()),
      FormatService.pad(d.getSeconds()),
    ].join(':') + '.' + FormatService.pad(d.getMilliseconds(), 3);
  }

  /** Decorative latency that drifts gently — never a real metric. */
  static decorativeLatencyMs(): number {
    return Math.round(280 + Math.sin(Date.now() / 4000) * 60);
  }

  /** Promise-based delay — pulled out so the loop has a single async helper. */
  static wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
