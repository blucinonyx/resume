export type LogStatus = 'init' | 'auth' | '3ds' | 'approved' | 'declined';
export type CardBrand = 'visa' | 'mc';

export interface LogLine {
  id: number;
  timestamp: string;
  status: LogStatus;
  amount: number;
  cardLast4: string;
  brand: CardBrand;
  merchant: string;
  txnId: string;
}
