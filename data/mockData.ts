import { Stock, Kline } from '../constants/types';

// Real stock data from Longbridge API (2026-03-21)
export const MOCK_STOCKS: Stock[] = [
  { symbol: '00700', name: '腾讯控股', nameEn: 'Tencent', market: 'HK', price: 508.00, change: -5.00, changePercent: -0.97, open: 505, high: 519, low: 505, prevClose: 513, volume: 24924662, pe: 19.2 },
  { symbol: '09988', name: '阿里巴巴-SW', nameEn: 'Alibaba', market: 'HK', price: 123.70, change: -8.30, changePercent: -6.29, open: 123.5, high: 126.8, low: 122.4, prevClose: 132, volume: 206068855, pe: 15.8 },
  { symbol: '03690', name: '美团-W', nameEn: 'Meituan', market: 'HK', price: 79.15, change: -1.55, changePercent: -1.92, open: 81.55, high: 82.65, low: 78.15, prevClose: 80.7, volume: 64632837, pe: 35.6 },
  { symbol: '01810', name: '小米集团-W', nameEn: 'Xiaomi', market: 'HK', price: 33.20, change: -3.12, changePercent: -8.59, open: 35.5, high: 35.64, low: 33.2, prevClose: 36.32, volume: 396613712, pe: 22.4 },
  { symbol: '00388', name: '香港交易所', nameEn: 'HKEX', market: 'HK', price: 396.00, change: -2.60, changePercent: -0.65, open: 398.6, high: 401, low: 395.2, prevClose: 398.6, volume: 4416051, pe: 38.5 },
  { symbol: '02318', name: '中国平安', nameEn: 'Ping An', market: 'HK', price: 61.75, change: 0.10, changePercent: 0.16, open: 61.65, high: 62.6, low: 61.35, prevClose: 61.65, volume: 31221069, pe: 7.8 },
  { symbol: 'AAPL', name: '苹果', nameEn: 'Apple', market: 'US', price: 247.99, change: -0.97, changePercent: -0.39, open: 247.975, high: 249.2, low: 246, prevClose: 248.96, volume: 88331081, pe: 31.2 },
  { symbol: 'NVDA', name: '英伟达', nameEn: 'NVIDIA', market: 'US', price: 172.70, change: -5.86, changePercent: -3.28, open: 178, high: 178.26, low: 171.72, prevClose: 178.56, volume: 241323528, pe: 35.1 },
  { symbol: 'TSLA', name: '特斯拉', nameEn: 'Tesla', market: 'US', price: 367.96, change: -12.34, changePercent: -3.24, open: 379.85, high: 379.89, low: 364.46, prevClose: 380.30, volume: 78628603, pe: 142.5 },
  { symbol: 'AMZN', name: '亚马逊', nameEn: 'Amazon', market: 'US', price: 205.37, change: -3.39, changePercent: -1.62, open: 207.4, high: 207.54, low: 204.316, prevClose: 208.76, volume: 63694603, pe: 28.5 },
  { symbol: 'GOOGL', name: '谷歌', nameEn: 'Alphabet', market: 'US', price: 301.00, change: -6.13, changePercent: -2.00, open: 305.46, high: 306, low: 298.27, prevClose: 307.13, volume: 44364079, pe: 27.8 },
  { symbol: 'META', name: 'Meta', nameEn: 'Meta Platforms', market: 'US', price: 593.66, change: -13.04, changePercent: -2.15, open: 603.53, high: 603.955, low: 587.25, prevClose: 606.70, volume: 21214898, pe: 20.2 },
];

export function getStock(symbol: string): Stock | undefined {
  return MOCK_STOCKS.find((s) => s.symbol === symbol);
}

export function getHKStocks(): Stock[] {
  return MOCK_STOCKS.filter((s) => s.market === 'HK');
}

export function getUSStocks(): Stock[] {
  return MOCK_STOCKS.filter((s) => s.market === 'US');
}

export function searchStocks(query: string): Stock[] {
  const q = query.toUpperCase();
  return MOCK_STOCKS.filter(
    (s) =>
      s.symbol.toUpperCase().includes(q) ||
      s.name.includes(query) ||
      s.nameEn?.toUpperCase().includes(q)
  );
}

export function generateMockKline(days: number = 60, basePrice: number = 500): Kline[] {
  const klines: Kline[] = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const time = now - i * 24 * 60 * 60 * 1000;
    const change = (Math.random() - 0.5) * 20;
    const open = price + change;
    const close = open + (Math.random() - 0.5) * 15;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 10000000) + 5000000;

    klines.push({ time, open, high, low, close, volume });
    price = close;
  }

  return klines;
}

// Market indices data
export const US_INDICES = [
  { name: '道琼斯', symbol: 'DJI', price: 45577.47, change: -0.96 },
  { name: '纳斯达克', symbol: 'IXIC', price: 21647.61, change: -2.01 },
  { name: '标普500', symbol: 'SPY', price: 648.57, change: -1.43 },
];

export const HK_INDICES = [
  { name: '恒生指数', symbol: 'HSI', price: 25277.32, change: 0.88 },
  { name: '国企指数', symbol: 'HSCEI', price: 8574.07, change: -1.40 },
  { name: '恒生科技', symbol: 'HSTECH', price: 4872.38, change: -2.48 },
];

export const HOT_STOCKS = [
  { name: '阿里巴巴', symbol: 'BABA', market: 'US' as const, change: -2.18 },
  { name: '超微电脑', symbol: 'SMCI', market: 'US' as const, change: -5.32 },
  { name: '英伟达', symbol: 'NVDA', market: 'US' as const, change: -3.15 },
  { name: '腾讯控股', symbol: '00700', market: 'HK' as const, change: 1.25 },
];
