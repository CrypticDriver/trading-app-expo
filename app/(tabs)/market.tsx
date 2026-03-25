import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import { US_INDICES, HK_INDICES, HOT_STOCKS } from '../../data/mockData';
import { BorderRadius, FontSizes, Spacing } from '../../constants/theme';

type MainTab = 'discover' | 'market' | 'fund';
type MarketTab = 'us' | 'hk';

export default function MarketScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>('discover');
  const [marketTab, setMarketTab] = useState<MarketTab>('us');

  const indices = marketTab === 'us' ? US_INDICES : HK_INDICES;

  const mainTabs: { key: MainTab; label: string }[] = [
    { key: 'discover', label: '发现' },
    { key: 'market', label: '市场' },
    { key: 'fund', label: '基金' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header with main tabs */}
      <View style={styles.header}>
        <View style={styles.mainTabs}>
          {mainTabs.map((tab) => (
            <TouchableOpacity key={tab.key} onPress={() => setMainTab(tab.key)}>
              <Text
                style={[
                  styles.mainTabText,
                  {
                    color:
                      mainTab === tab.key
                        ? colors.text
                        : isDark
                        ? 'rgba(237, 240, 245, 0.25)'
                        : 'rgba(26, 29, 35, 0.25)',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Market sub-tab */}
      {mainTab === 'market' && (
        <View style={styles.subTabContainer}>
          <View style={[styles.tabPills, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
            {(['us', 'hk'] as MarketTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  marketTab === tab && { backgroundColor: colors.accent },
                ]}
                onPress={() => setMarketTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        marketTab === tab
                          ? isDark
                            ? '#0f1219'
                            : '#ffffff'
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {tab === 'us' ? '美股' : '港股'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ===== Discover ===== */}
        {mainTab === 'discover' && (
          <View style={styles.section}>
            {/* Hot stocks */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>热股异动</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>实时更新</Text>
            </View>
            <View style={styles.hotGrid}>
              {HOT_STOCKS.map((stock, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.hotCard,
                    {
                      backgroundColor: colors.bgCardTranslucent,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push(`/stock/${stock.symbol}?market=${stock.market}`)
                  }
                >
                  <View style={styles.hotCardHeader}>
                    <Text style={[styles.hotName, { color: colors.text }]}>{stock.name}</Text>
                    <View
                      style={[
                        styles.marketBadge,
                        {
                          backgroundColor:
                            stock.market === 'US'
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
                        style={{
                          fontSize: 10,
                          fontWeight: '600',
                          color:
                            stock.market === 'US'
                              ? isDark
                                ? '#5B8FA8'
                                : '#4A7A90'
                              : isDark
                              ? '#C9A55C'
                              : '#A8862E',
                        }}
                      >
                        {stock.market}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.hotChange,
                      {
                        color:
                          stock.change >= 0 ? colors.stockUp : colors.stockDown,
                      },
                    ]}
                  >
                    {stock.change >= 0 ? '+' : ''}
                    {stock.change.toFixed(2)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* IPO section */}
            <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>新股申购</Text>
            </View>
            <View
              style={[
                styles.ipoCard,
                {
                  backgroundColor: colors.bgCardTranslucent,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.ipoRow}>
                <View
                  style={[
                    styles.ipoIcon,
                    {
                      backgroundColor: isDark
                        ? 'rgba(201, 165, 92, 0.15)'
                        : 'rgba(168, 134, 46, 0.1)',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.accent }}>
                    同
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.ipoNameRow}>
                    <Text style={[styles.ipoName, { color: colors.text }]}>
                      同仁堂医养
                    </Text>
                    <View
                      style={[
                        styles.ipoBadge,
                        {
                          backgroundColor: isDark
                            ? 'rgba(201, 165, 92, 0.15)'
                            : 'rgba(168, 134, 46, 0.1)',
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 11, color: colors.accent }}>预测 8倍</Text>
                    </View>
                  </View>
                  <Text style={[styles.ipoDesc, { color: colors.textSecondary }]}>
                    中医医疗集团
                  </Text>
                  <Text style={[styles.ipoTimer, { color: colors.textMuted }]}>
                    剩余{' '}
                    <Text style={{ fontWeight: '600', color: colors.accent }}>3 天</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ===== Market ===== */}
        {mainTab === 'market' && (
          <View style={styles.section}>
            {/* Index cards */}
            <View style={styles.indexGrid}>
              {indices.map((index, idx) => {
                const isUp = index.change >= 0;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.indexCard,
                      {
                        backgroundColor: colors.bgCardTranslucent,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.indexLabel, { color: colors.textSecondary }]}>
                      {index.name}
                    </Text>
                    <Text
                      style={[
                        styles.indexPrice,
                        { color: isUp ? colors.stockUp : colors.stockDown },
                      ]}
                    >
                      {index.price.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.indexChange,
                        { color: isUp ? colors.stockUp : colors.stockDown },
                      ]}
                    >
                      {isUp ? '+' : ''}
                      {index.change.toFixed(2)}%
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Rise/Fall distribution */}
            <View
              style={[
                styles.distCard,
                {
                  backgroundColor: colors.bgCardTranslucent,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.distTitle, { color: colors.text }]}>涨跌分布</Text>
              <View style={styles.distBar}>
                <View style={[styles.distBarSegment, { flex: 1, backgroundColor: 'rgba(39,174,96,0.8)', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
                <View style={[styles.distBarSegment, { flex: 0.22, backgroundColor: 'rgba(150,150,150,0.5)' }]} />
                <View style={[styles.distBarSegment, { flex: 0.3, backgroundColor: 'rgba(231,76,60,0.8)', borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
              </View>
              <View style={styles.distLabels}>
                <Text style={{ fontSize: 11, color: colors.stockDown }}>跌 70%</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>平 16%</Text>
                <Text style={{ fontSize: 11, color: colors.stockUp }}>涨 14%</Text>
              </View>
            </View>
          </View>
        )}

        {/* ===== Fund ===== */}
        {mainTab === 'fund' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.md }]}>
              收益排行
            </Text>
            {[
              { type: '股票型', ret: '+124.86%', period: '近3年', name: '摩根日本基金' },
              { type: '债券型', ret: '+28.88%', period: '近5年', name: '泰康短期债券基金' },
              { type: '平衡型', ret: '+79.96%', period: '近3年', name: '中银全天候投资基金' },
            ].map((fund, idx) => (
              <View
                key={idx}
                style={[
                  styles.fundCard,
                  {
                    backgroundColor: colors.bgCardTranslucent,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View>
                  <View
                    style={[
                      styles.fundBadge,
                      {
                        backgroundColor: isDark ? colors.cardGradientFrom : '#f0ede8',
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                      {fund.type}
                    </Text>
                  </View>
                  <Text style={[styles.fundName, { color: colors.text }]}>{fund.name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.fundReturn, { color: colors.accent }]}>{fund.ret}</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>{fund.period}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  mainTabs: {
    flexDirection: 'row',
    gap: Spacing.xl,
    flex: 1,
  },
  mainTabText: {
    fontSize: FontSizes.large,
    fontWeight: '700',
  },
  iconButton: { padding: Spacing.sm },
  subTabContainer: {
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tabText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
  },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: FontSizes.caption,
  },
  hotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  hotCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  hotCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  hotName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  marketBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotChange: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  ipoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  ipoRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  ipoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ipoNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ipoName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  ipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  ipoDesc: {
    fontSize: FontSizes.body,
    marginTop: 4,
  },
  ipoTimer: {
    fontSize: FontSizes.body,
    marginTop: Spacing.sm,
  },
  indexGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  indexCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  indexLabel: {
    fontSize: FontSizes.caption,
    marginBottom: 4,
  },
  indexPrice: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  indexChange: {
    fontSize: FontSizes.small,
    fontVariant: ['tabular-nums'],
  },
  distCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  distTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  distBar: {
    flexDirection: 'row',
    height: 32,
    gap: 2,
  },
  distBarSegment: {
    height: '100%',
  },
  distLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  fundCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  fundName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  fundReturn: {
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
});
