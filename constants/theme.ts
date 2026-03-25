/**
 * Premium Finance Design System
 * Accent: warm gold #C9A55C (primary), steel blue #5B8FA8 (secondary)
 * Stock: red #e74c3c (up), green #27ae60 (down) — HK convention
 */

export const Colors = {
  dark: {
    bg: '#0f1219',
    bgSecondary: '#161b26',
    bgCard: '#1a2030',
    bgCardTranslucent: 'rgba(26, 32, 48, 0.8)',
    text: '#edf0f5',
    textSecondary: 'rgba(237, 240, 245, 0.6)',
    textMuted: 'rgba(237, 240, 245, 0.4)',
    border: '#2a3344',
    borderLight: '#232b3b',
    input: '#1a2030',
    navBg: 'rgba(15, 18, 25, 0.95)',
    accent: '#C9A55C',
    accentDark: '#A8862E',
    accentSecondary: '#5B8FA8',
    stockUp: '#e74c3c',
    stockDown: '#27ae60',
    cardGradientFrom: '#1e2636',
    cardGradientTo: '#161b26',
    tabInactive: 'rgba(237, 240, 245, 0.35)',
  },
  light: {
    bg: '#faf9f7',
    bgSecondary: '#ffffff',
    bgCard: '#ffffff',
    bgCardTranslucent: 'rgba(255, 255, 255, 0.8)',
    text: '#1a1d23',
    textSecondary: 'rgba(26, 29, 35, 0.6)',
    textMuted: 'rgba(26, 29, 35, 0.4)',
    border: '#e8e5df',
    borderLight: '#f0ede8',
    input: '#f5f3ef',
    navBg: 'rgba(250, 249, 247, 0.95)',
    accent: '#A8862E',
    accentDark: '#8D6F1F',
    accentSecondary: '#4A7A90',
    stockUp: '#e74c3c',
    stockDown: '#27ae60',
    cardGradientFrom: '#f5f3ef',
    cardGradientTo: '#ffffff',
    tabInactive: 'rgba(26, 29, 35, 0.35)',
  },
};

export type ThemeType = 'dark' | 'light';

export const FontSizes = {
  title: 28,
  subtitle: 18,
  body: 14,
  caption: 11,
  small: 12,
  large: 20,
  xlarge: 24,
  price: 36,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
