# 同舟证券 - Expo App

Cross-platform trading app built with Expo Router. Runs on **Android**, **iOS**, and **Web** from a single codebase.

## Features

- 📊 **Watchlist** — Stock list with mini charts, search, HK/US filter
- 🌐 **Market** — Market indices, hot stocks, IPO, fund rankings
- 💱 **Trade** — Buy/sell interface with limit/market orders
- 👤 **Account** — Profile, settings, dark/light theme toggle
- 📈 **Stock Detail** — K-line chart (ECharts via WebView), price data, news
- ❤️ **Favorites** — Persisted via AsyncStorage

## Design

- **Premium finance aesthetic**: dark navy `#0f1219` + warm gold `#C9A55C`
- **HK convention**: red = up, green = down
- **Dark/Light theme** with smooth toggle
- 4-tab bottom navigation

## Tech Stack

- **Expo SDK 55** + **Expo Router** (file-based routing)
- **React Native** with TypeScript
- **ECharts** via WebView for K-line charts
- **AsyncStorage** for persistent data
- **react-native-svg** for mini charts

## Quick Start

```bash
npm install
npx expo start          # Dev server (scan QR with Expo Go)
npx expo start --web    # Web browser
npx expo export --platform web  # Web build
```

## Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx        # Home — Watchlist
│   ├── market.tsx       # Market overview
│   ├── trade.tsx        # Trading hall
│   └── account.tsx      # Account/Settings
├── stock/[symbol].tsx   # Stock detail with K-line
├── _layout.tsx          # Root layout + ThemeProvider
└── +not-found.tsx
components/
├── ThemeContext.tsx      # Dark/Light theme context
├── MiniChart.tsx        # SVG mini sparkline
└── KlineChart.tsx       # ECharts K-line via WebView
constants/
├── theme.ts             # Design system colors/sizes
└── types.ts             # TypeScript interfaces
data/
├── mockData.ts          # Mock stock data (Longbridge API)
├── favorites.ts         # Favorites persistence
└── stocks.json          # 250 stocks (trimmed for mobile)
```

## Building

### Android APK
```bash
npx expo run:android     # Requires Android SDK
# Or via EAS:
eas build --platform android --profile preview
```

### iOS
```bash
npx expo run:ios         # Requires macOS + Xcode
```

### Web
```bash
npx expo export --platform web
# Output in dist/
```
