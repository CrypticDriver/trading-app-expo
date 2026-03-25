import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import MiniChart from '../../components/MiniChart';
import { MOCK_STOCKS } from '../../data/mockData';
import { getFavorites } from '../../data/favorites';
import { BorderRadius, FontSizes, Spacing } from '../../constants/theme';
import { Stock } from '../../constants/types';

const DEFAULT_WATCHLIST: Stock[] = [
  { symbol: 'NVDA', name: '英伟达', market: 'US', price: 172.70, changePercent: -3.28, prevClose: 174.87 },
  { symbol: 'AAPL', name: '苹果', market: 'US', price: 247.99, changePercent: 1.23, prevClose: 244.97 },
  { symbol: 'TSLA', name: '特斯拉', market: 'US', price: 367.96, changePercent: -2.15, prevClose: 376.05 },
  { symbol: '00700', name: '腾讯控股', market: 'HK', price: 508.00, changePercent: -0.59, prevClose: 511.00 },
  { symbol: '09988', name: '阿里巴巴-SW', market: 'HK', price: 123.70, changePercent: 2.43, prevClose: 120.77 },
  { symbol: '00388', name: '香港交易所', market: 'HK', price: 396.00, changePercent: -0.65, prevClose: 398.6 },
];

type Tab = 'all' | 'us' | 'hk';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const watchlist = useMemo(() => {
    let list: Stock[] =
      favorites.length === 0
        ? DEFAULT_WATCHLIST
        : favorites.map((sym) => {
            const found = MOCK_STOCKS.find((s) => s.symbol === sym);
            return (
              found || {
                symbol: sym,
                name: sym,
                market: sym.match(/^\d/) ? ('HK' as const) : ('US' as const),
              }
            );
          });

    if (activeTab === 'us') list = list.filter((s) => s.market === 'US');
    else if (activeTab === 'hk') list = list.filter((s) => s.market === 'HK');

    if (searchQuery) {
      const q = searchQuery.toUpperCase();
      list = list.filter(
        (s) =>
          s.symbol.toUpperCase().includes(q) ||
          s.name.includes(searchQuery) ||
          s.nameEn?.toUpperCase().includes(q)
      );
    }

    return list;
  }, [favorites, activeTab, searchQuery]);

  const counts = {
    all: favorites.length || DEFAULT_WATCHLIST.length,
    us: (favorites.length ? favorites.filter((s) => !s.match(/^\d/)) : DEFAULT_WATCHLIST.filter((s) => s.market === 'US')).length,
    hk: (favorites.length ? favorites.filter((s) => s.match(/^\d/)) : DEFAULT_WATCHLIST.filter((s) => s.market === 'HK')).length,
  };

  const renderStockItem = ({ item, index }: { item: Stock; index: number }) => {
    const isUp = (item.changePercent || 0) >= 0;
    const price = item.price || 0;
    const changePercent = item.changePercent || 0;

    return (
      <TouchableOpacity
        style={[
          styles.stockCard,
          {
            backgroundColor: colors.bgCardTranslucent,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
        onPress={() => router.push(`/stock/${item.symbol}?market=${item.market}`)}
      >
        <View style={styles.stockRow}>
          {/* Left: stock info */}
          <View style={styles.stockInfo}>
            <View style={styles.stockNameRow}>
              <Text style={[styles.stockName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.marketBadge,
                  {
                    backgroundColor:
                      item.market === 'US'
                        ? isDark
                          ? 'rgba(91, 143, 168, 0.15)'
                          : 'rgba(74, 122, 144, 0.1)'
                        : isDark
                        ? 'rgba(201, 165, 92, 0.15)'
                        : 'rgba(168, 134, 46, 0.1)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.marketText,
                    {
                      color:
                        item.market === 'US'
                          ? isDark
                            ? '#5B8FA8'
                            : '#4A7A90'
                          : isDark
                          ? '#C9A55C'
                          : '#A8862E',
                    },
                  ]}
                >
                  {item.market}
                </Text>
              </View>
            </View>
            <Text style={[styles.stockSymbol, { color: colors.textMuted }]}>
              {item.symbol}
            </Text>
          </View>

          {/* Middle: mini chart */}
          <View style={styles.chartContainer}>
            <MiniChart isUp={isUp} seed={index + item.symbol.charCodeAt(0)} />
          </View>

          {/* Right: price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.stockPrice, { color: colors.text }]}>
              {price > 0 ? price.toFixed(2) : '--'}
            </Text>
            <Text
              style={[
                styles.changePercent,
                { color: isUp ? colors.stockUp : colors.stockDown },
              ]}
            >
              {changePercent !== 0
                ? `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`
                : '--'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>自选</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            style={styles.iconButton}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="搜索股票代码或名称"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tab pills */}
      <View style={styles.tabContainer}>
        <View style={[styles.tabPills, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
          {(['all', 'us', 'hk'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && {
                  backgroundColor: colors.accent,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? isDark
                          ? '#0f1219'
                          : '#ffffff'
                        : colors.textSecondary,
                  },
                ]}
              >
                {tab === 'all' ? '全部' : tab === 'us' ? '美股' : '港股'}
              </Text>
              <Text
                style={[
                  styles.tabCount,
                  {
                    color:
                      activeTab === tab
                        ? isDark
                          ? 'rgba(15,18,25,0.7)'
                          : 'rgba(255,255,255,0.7)'
                        : colors.textMuted,
                  },
                ]}
              >
                {' '}{counts[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stock list */}
      <FlatList
        data={watchlist}
        renderItem={renderStockItem}
        keyExtractor={(item) => `${item.market}-${item.symbol}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bar-chart-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>暂无自选股票</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              点击股票详情页的 ❤️ 添加自选
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.body,
    paddingVertical: 4,
  },
  tabContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  tabPills: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tabText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  tabCount: {
    fontSize: FontSizes.body,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
    gap: Spacing.md,
  },
  stockCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInfo: {
    flex: 1,
    minWidth: 0,
  },
  stockNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stockName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    flexShrink: 1,
  },
  marketBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  marketText: {
    fontSize: 10,
    fontWeight: '600',
  },
  stockSymbol: {
    fontSize: FontSizes.small,
    marginTop: 2,
  },
  chartContainer: {
    marginHorizontal: Spacing.lg,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  changePercent: {
    fontSize: FontSizes.small,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: FontSizes.body,
  },
});
