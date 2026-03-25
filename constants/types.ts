export interface Stock {
  symbol: string;
  name: string;
  nameEn?: string;
  market: 'HK' | 'US';
  sector?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
  turnover?: number;
  marketCap?: number;
  pe?: number;
  lotSize?: number;
}

export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
