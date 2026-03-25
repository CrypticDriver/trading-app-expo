import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import KlineChart from '../../components/KlineChart';
import { getStock, generateMockKline, MOCK_STOCKS } from '../../data/mockData';
import { isFavorite, toggleFavorite } from '../../data/favorites';
import { BorderRadius, FontSizes, Spacing } from '../../constants/theme';
import { Stock } from '../../constants/types';

export default function StockDetailScreen() {
  const { symbol, market: marketParam } = useLocalSearchParams<{
    symbol: string;
    market: string;
  }>();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState<Stock | null>(null);

  const market = (marketParam || (symbol?.match(/^\d/) ? 'HK' : 'US')) as 'HK' | 'US';

  useEffect(() => {
    if (!symbol) return;

    // Load stock data
    const found = getStock(symbol);
    if (found) {
      setStock(found);
    } else {
      // Generate mock price for unknown stocks
      const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const basePrice = 50 + (seed % 450);
      const changePercent = ((seed % 100) - 50) / 10;
      setStock({
        symbol,
        name: symbol,
        market,
        price: basePrice,
        change: (basePrice * changePercent) / 100,
        changePercent,
        open: basePrice * 0.99,
        high: basePrice * 1.02,
        low: basePrice * 0.98,
        prevClose: basePrice * (1 - changePercent / 100),
        volume: 10000000 + (seed % 50000000),
      });
    }

    isFavorite(symbol).then(setFavorited);
    setLoading(false);
  }, [symbol]);

  const handleToggleFavorite = async () => {
    if (!symbol) return;
    const newState = await toggleFavorite(symbol);
    setFavorited(newState);
  };

  if (loading || !stock) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  const isUp = (stock.change || 0) >= 0;
  const klineData = generateMockKline(60, stock.price || 500);
  const turnover = ((stock.volume || 0) * (stock.price || 0)) / 100000000;
  const amplitude =
    stock.high && stock.low && stock.prevClose
      ? (((stock.high - stock.low) / stock.prevClose) * 100).toFixed(2)
      : '--';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerName, { color: colors.text }]}>{stock.name}</Text>
          <View style={styles.headerSubRow}>
            <View
              style={[
                styles.marketBadge,
                {
                  backgroundColor:
                    market === 'US'
                      ? isDark
                        ? 'rgba(91,143,168,0.12)'
                        : 'rgba(74,122,144,0.1)'
                      : isDark
                      ? 'rgba(201,165,92,0.12)'
                      : 'rgba(168,134,46,0.1)',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: market === 'US' ? (isDark ? '#5B8FA8' : '#4A7A90') : isDark ? '#C9A55C' : '#A8862E',
                }}
              >
                {market}
              </Text>
            </View>
            <Text style={{ fontSize: FontSizes.caption, color: colors.textMuted }}>
              {stock.symbol}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.backButton}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Price card */}
        <View
          style={[
            styles.priceCard,
            {
              backgroundColor: isDark ? colors.cardGradientFrom : '#fff',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.priceRow}>
            <View>
              <Text
                style={[
                  styles.mainPrice,
                  { color: isUp ? colors.stockUp : colors.stockDown },
                ]}
              >
                {(stock.price || 0).toFixed(market === 'HK' ? 3 : 2)}
              </Text>
              <Text
                style={[
                  styles.priceChange,
                  { color: isUp ? colors.stockUp : colors.stockDown },
                ]}
              >
                {isUp ? '+' : ''}
                {(stock.change || 0).toFixed(2)} ({isUp ? '+' : ''}
                {(stock.changePercent || 0).toFixed(2)}%)
              </Text>
            </View>
            <Text style={{ fontSize: FontSizes.small, color: colors.textMuted }}>
              {market === 'HK' ? 'T+2 结算' : 'T+1 结算'}
            </Text>
          </View>

          {/* Data grid */}
          <View style={[styles.dataGrid, { borderTopColor: colors.borderLight }]}>
            <View style={styles.dataRow}>
              {[
                { label: '最高', value: (stock.high || 0).toFixed(2), color: colors.stockUp },
                { label: '最低', value: (stock.low || 0).toFixed(2), color: colors.stockDown },
                { label: '今开', value: (stock.open || 0).toFixed(2), color: colors.text },
                { label: '昨收', value: (stock.prevClose || 0).toFixed(2), color: colors.text },
              ].map((item) => (
                <View key={item.label} style={styles.dataItem}>
                  <Text style={[styles.dataLabel, { color: colors.textMuted }]}>{item.label}</Text>
                  <Text style={[styles.dataValue, { color: item.color }]}>{item.value}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.dataRow, { marginTop: Spacing.md }]}>
              {[
                {
                  label: '成交量',
                  value: `${((stock.volume || 0) / 10000).toFixed(0)}万`,
                },
                { label: '成交额', value: `${turnover.toFixed(2)}亿` },
                { label: '振幅', value: `${amplitude}%` },
                { label: '每手', value: market === 'HK' ? '100股' : '1股' },
              ].map((item) => (
                <View key={item.label} style={styles.dataItem}>
                  <Text style={[styles.dataLabel, { color: colors.textMuted }]}>{item.label}</Text>
                  <Text style={[styles.dataValue, { color: colors.text }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* K-line period buttons */}
        <View style={styles.klinePeriods}>
          {['日K', '周K', '月K', '5分', '15分', '60分'].map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    i === 0 ? colors.accent : isDark ? colors.bgCard : '#f0ede8',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: FontSizes.small,
                  fontWeight: '600',
                  color:
                    i === 0
                      ? isDark
                        ? '#0f1219'
                        : '#fff'
                      : colors.textSecondary,
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* K-line chart */}
        <View
          style={[
            styles.chartContainer,
            { backgroundColor: isDark ? colors.bgCard : '#fff' },
          ]}
        >
          <KlineChart data={klineData} symbol={stock.symbol} isDark={isDark} />
          <Text
            style={{
              textAlign: 'center',
              fontSize: FontSizes.caption,
              color: colors.textMuted,
              paddingVertical: Spacing.sm,
            }}
          >
            📊 模拟K线数据 | 双指缩放
          </Text>
        </View>

        {/* News section */}
        <View style={styles.newsSection}>
          <Text style={[styles.newsTitle, { color: colors.text }]}>相关资讯</Text>
          {[
            {
              title: `${stock.name}发布最新财报，营收超预期`,
              time: '今天 09:30',
            },
            {
              title: `分析师上调${stock.name}目标价至${((stock.price || 0) * 1.2).toFixed(0)}`,
              time: '昨天 15:20',
            },
            {
              title: `机构增持${stock.name}，看好长期发展`,
              time: '3天前',
            },
          ].map((news, idx) => (
            <View
              key={idx}
              style={[
                styles.newsCard,
                {
                  backgroundColor: colors.bgCardTranslucent,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.newsText, { color: colors.text }]}>{news.title}</Text>
              <Text style={{ fontSize: FontSizes.caption, color: colors.textMuted, marginTop: Spacing.sm }}>
                {news.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom trade bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.navBg, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.bottomIconBtn, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomIconBtn, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tradeButton, { backgroundColor: colors.stockUp }]}
          activeOpacity={0.8}
        >
          <Text style={styles.tradeButtonText}>买入</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tradeButton, { backgroundColor: colors.stockDown }]}
          activeOpacity={0.8}
        >
          <Text style={styles.tradeButtonText}>卖出</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    fontSize: FontSizes.body + 1,
    fontWeight: '700',
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  marketBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  priceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  mainPrice: {
    fontSize: FontSizes.price,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  priceChange: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  dataGrid: {
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  dataRow: {
    flexDirection: 'row',
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    fontSize: FontSizes.small,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  klinePeriods: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  chartContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  newsSection: {
    marginTop: Spacing.xl,
  },
  newsTitle: {
    fontSize: FontSizes.body + 1,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  newsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  newsText: {
    fontSize: FontSizes.body,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 32,
    borderTopWidth: 0.5,
    gap: Spacing.md,
  },
  bottomIconBtn: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  tradeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  tradeButtonText: {
    fontSize: FontSizes.body + 1,
    fontWeight: '700',
    color: '#fff',
  },
});
