import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import { getFavorites } from '../../data/favorites';
import { BorderRadius, FontSizes, Spacing } from '../../constants/theme';

export default function AccountScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    getFavorites().then((favs) => setFavCount(favs.length));
  }, []);

  const menuItems = [
    { icon: 'trending-up-outline' as const, label: '自选', color: '#5B8FA8' },
    { icon: 'swap-horizontal-outline' as const, label: '换汇', color: '#27ae60' },
    { icon: 'receipt-outline' as const, label: '订单', color: '#C9A55C' },
    { icon: 'settings-outline' as const, label: '设置', color: isDark ? 'rgba(237,240,245,0.6)' : 'rgba(26,29,35,0.6)' },
  ];

  const settingsItems = [
    { icon: 'lock-closed-outline' as const, label: '账户安全' },
    { icon: 'notifications-outline' as const, label: '消息通知' },
    { icon: 'help-circle-outline' as const, label: '帮助与反馈' },
    { icon: 'information-circle-outline' as const, label: '关于我们' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>我的</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: isDark ? colors.cardGradientFrom : '#fff',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.userRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isDark ? colors.cardGradientFrom : '#f0ede8' },
              ]}
            >
              <Ionicons name="person" size={32} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.text }]}>同舟证券用户</Text>
              <Text style={{ fontSize: FontSizes.body, color: colors.textSecondary }}>
                ID: 30000079
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            {[
              { label: '关注', value: '0' },
              { label: '粉丝', value: '0' },
              { label: '收藏', value: String(favCount), highlight: true },
              { label: '足迹', value: '0' },
            ].map((stat, idx) => (
              <View key={idx} style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: stat.highlight ? colors.accent : colors.text,
                    },
                  ]}
                >
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick menu */}
        <View style={styles.quickMenu}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickMenuItem}>
              <View
                style={[
                  styles.quickMenuIcon,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={{ fontSize: FontSizes.small, color: colors.textSecondary, marginTop: 6 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings list */}
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: colors.bgCardTranslucent,
              borderColor: colors.border,
            },
          ]}
        >
          {settingsItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.settingsItem,
                idx > 0 && { borderTopColor: colors.borderLight, borderTopWidth: 1 },
              ]}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
                <Text style={[styles.settingsItemLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme toggle */}
        <View
          style={[
            styles.themeCard,
            {
              backgroundColor: colors.bgCardTranslucent,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.themeTitle, { color: colors.textSecondary }]}>外观主题</Text>
          <View style={styles.themeRow}>
            {[
              { key: 'dark', label: '深黑' },
              { key: 'light', label: '浅白' },
            ].map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor:
                      (isDark && t.key === 'dark') || (!isDark && t.key === 'light')
                        ? '#27ae60'
                        : isDark
                        ? colors.bgCard
                        : '#f0ede8',
                  },
                ]}
                onPress={toggleTheme}
              >
                <Text
                  style={{
                    fontSize: FontSizes.body,
                    fontWeight: '600',
                    color:
                      (isDark && t.key === 'dark') || (!isDark && t.key === 'light')
                        ? '#fff'
                        : colors.textSecondary,
                  }}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>同舟证券 v1.0.0</Text>
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
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconButton: { padding: Spacing.sm },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
  },
  userCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: FontSizes.subtitle,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.large,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: FontSizes.small,
    marginTop: 2,
  },
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xxl,
  },
  quickMenuItem: {
    alignItems: 'center',
  },
  quickMenuIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsItemLabel: {
    fontSize: FontSizes.body,
  },
  themeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  themeTitle: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  version: {
    textAlign: 'center',
    fontSize: FontSizes.body,
    paddingVertical: Spacing.xxl,
  },
});
