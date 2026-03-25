import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import { MOCK_STOCKS } from '../../data/mockData';
import { BorderRadius, FontSizes, Spacing } from '../../constants/theme';

export default function TradeScreen() {
  const { colors, isDark } = useTheme();
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0]);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(selectedStock.price?.toFixed(2) || '0');
  const [quantity, setQuantity] = useState('100');

  const total = parseFloat(price || '0') * parseInt(quantity || '0');
  const currency = selectedStock.market === 'HK' ? 'HKD' : 'USD';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>交易</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stock selector */}
        <TouchableOpacity
          style={[
            styles.stockSelector,
            { backgroundColor: colors.bgCardTranslucent, borderColor: colors.border },
          ]}
        >
          <View>
            <Text style={[styles.stockName, { color: colors.text }]}>
              {selectedStock.name}
            </Text>
            <Text style={[styles.stockSymbol, { color: colors.textMuted }]}>
              {selectedStock.market} · {selectedStock.symbol}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.stockPrice,
                {
                  color:
                    (selectedStock.changePercent || 0) >= 0
                      ? colors.stockUp
                      : colors.stockDown,
                },
              ]}
            >
              {selectedStock.price?.toFixed(2)}
            </Text>
            <Text
              style={{
                fontSize: FontSizes.small,
                color:
                  (selectedStock.changePercent || 0) >= 0
                    ? colors.stockUp
                    : colors.stockDown,
              }}
            >
              {(selectedStock.changePercent || 0) >= 0 ? '+' : ''}
              {selectedStock.changePercent?.toFixed(2)}%
            </Text>
          </View>
        </TouchableOpacity>

        {/* Buy/Sell toggle */}
        <View style={[styles.tradeToggle, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
          <TouchableOpacity
            style={[
              styles.tradeToggleBtn,
              tradeType === 'buy' && { backgroundColor: colors.stockUp },
            ]}
            onPress={() => setTradeType('buy')}
          >
            <Text
              style={[
                styles.tradeToggleText,
                { color: tradeType === 'buy' ? '#fff' : colors.textSecondary },
              ]}
            >
              买入
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tradeToggleBtn,
              tradeType === 'sell' && { backgroundColor: colors.stockDown },
            ]}
            onPress={() => setTradeType('sell')}
          >
            <Text
              style={[
                styles.tradeToggleText,
                { color: tradeType === 'sell' ? '#fff' : colors.textSecondary },
              ]}
            >
              卖出
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order type */}
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>订单类型</Text>
          <View style={[styles.orderTypePills, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}>
            {(['limit', 'market'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.orderTypeBtn,
                  orderType === type && { backgroundColor: colors.accent },
                ]}
                onPress={() => setOrderType(type)}
              >
                <Text
                  style={{
                    fontSize: FontSizes.small,
                    fontWeight: '600',
                    color:
                      orderType === type
                        ? isDark
                          ? '#0f1219'
                          : '#fff'
                        : colors.textSecondary,
                  }}
                >
                  {type === 'limit' ? '限价单' : '市价单'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price input */}
        {orderType === 'limit' && (
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>价格</Text>
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={[styles.stepButton, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}
                onPress={() => setPrice((parseFloat(price) - 0.01).toFixed(2))}
              >
                <Text style={{ fontSize: 18, color: colors.text }}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.priceInput, { color: colors.text, borderBottomColor: colors.border }]}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={[styles.stepButton, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}
                onPress={() => setPrice((parseFloat(price) + 0.01).toFixed(2))}
              >
                <Text style={{ fontSize: 18, color: colors.text }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quantity input */}
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>数量</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={[styles.stepButton, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}
              onPress={() => {
                const lot = selectedStock.market === 'HK' ? 100 : 1;
                setQuantity(String(Math.max(lot, parseInt(quantity || '0') - lot)));
              }}
            >
              <Text style={{ fontSize: 18, color: colors.text }}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.priceInput, { color: colors.text, borderBottomColor: colors.border }]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.stepButton, { backgroundColor: isDark ? colors.bgCard : '#f0ede8' }]}
              onPress={() => {
                const lot = selectedStock.market === 'HK' ? 100 : 1;
                setQuantity(String(parseInt(quantity || '0') + lot));
              }}
            >
              <Text style={{ fontSize: 18, color: colors.text }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <View
          style={[
            styles.totalCard,
            { backgroundColor: colors.bgCardTranslucent, borderColor: colors.border },
          ]}
        >
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>预估金额</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              {currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>结算方式</Text>
            <Text style={{ fontSize: FontSizes.small, color: colors.textMuted }}>
              {selectedStock.market === 'HK' ? 'T+2 结算' : 'T+1 结算'}
            </Text>
          </View>
        </View>

        {/* Quick stocks */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>快速选股</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickStocks}>
          {MOCK_STOCKS.slice(0, 8).map((stock) => (
            <TouchableOpacity
              key={stock.symbol}
              style={[
                styles.quickStockChip,
                {
                  backgroundColor: colors.bgCardTranslucent,
                  borderColor:
                    selectedStock.symbol === stock.symbol
                      ? colors.accent
                      : colors.border,
                },
              ]}
              onPress={() => {
                setSelectedStock(stock);
                setPrice(stock.price?.toFixed(2) || '0');
              }}
            >
              <Text
                style={{
                  fontSize: FontSizes.small,
                  fontWeight: '600',
                  color:
                    selectedStock.symbol === stock.symbol
                      ? colors.accent
                      : colors.text,
                }}
              >
                {stock.name}
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{stock.symbol}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Submit button */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor:
                tradeType === 'buy' ? colors.stockUp : colors.stockDown,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>
            {tradeType === 'buy' ? '买入' : '卖出'} {selectedStock.name}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  stockSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  stockName: {
    fontSize: FontSizes.subtitle,
    fontWeight: '600',
  },
  stockSymbol: {
    fontSize: FontSizes.small,
    marginTop: 2,
  },
  stockPrice: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  tradeToggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  tradeToggleBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tradeToggleText: {
    fontSize: FontSizes.body,
    fontWeight: '700',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    width: 80,
  },
  orderTypePills: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: BorderRadius.sm,
  },
  orderTypeBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'flex-end',
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInput: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    textAlign: 'center',
    width: 100,
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  totalCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSizes.body,
  },
  totalAmount: {
    fontSize: FontSizes.large,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  quickStocks: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  quickStockChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: 36,
    borderTopWidth: 0.5,
  },
  submitButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitText: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
    color: '#fff',
  },
});
