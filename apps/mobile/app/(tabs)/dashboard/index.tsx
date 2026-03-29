import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Wine,
  TrendingUp,
  Banknote,
  ShoppingCart,
  Plus,
  ScanLine,
  Bell,
} from 'lucide-react-native';
import { KPICard } from '@/components/KPICard';
import { AlertCard } from '@/components/AlertCard';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { useAlerts, useUnreadAlertCount } from '@/hooks/useAlerts';

// ── Mock activity feed ──

const ACTIVITY = [
  { id: '1', text: 'Barolo Monfortino 2013 added to inventory', time: '2h ago', icon: 'bottle' },
  { id: '2', text: 'Famiglia Rossi accepted offer on Biondi-Santi lot', time: '4h ago', icon: 'deal' },
  { id: '3', text: 'AI scan completed for Amarone 2012', time: '6h ago', icon: 'scan' },
  { id: '4', text: 'Price alert: Masseto 2019 +8% this week', time: '1d ago', icon: 'price' },
  { id: '5', text: 'Luigi Ferrero pickup confirmed for March 30', time: '1d ago', icon: 'deal' },
];

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { data: alerts } = useAlerts();
  const unreadCount = useUnreadAlertCount();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Buongiorno</Text>
            <Text style={styles.name}>Marco</Text>
          </View>
          <Pressable
            style={styles.bellWrap}
            onPress={() => {}}
          >
            <Bell size={22} color={Colors.text.primary} />
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* KPI Grid */}
        <Text style={styles.sectionTitle}>OVERVIEW</Text>
        <View style={styles.kpiGrid}>
          <KPICard
            label="Bottles"
            value="142"
            change="8 this week"
            changePositive
            icon={<Wine size={16} color={Colors.accent.copper} />}
          />
          <KPICard
            label="Portfolio"
            value="€94.2k"
            change="12.4%"
            changePositive
            icon={<TrendingUp size={16} color={Colors.accent.copper} />}
          />
          <KPICard
            label="Revenue MTD"
            value="€18.6k"
            change="4.2%"
            changePositive
            icon={<Banknote size={16} color={Colors.accent.copper} />}
          />
          <KPICard
            label="Active Deals"
            value="7"
            change="3 new"
            changePositive
            icon={<ShoppingCart size={16} color={Colors.accent.copper} />}
          />
        </View>

        {/* Alerts */}
        <Text style={styles.sectionTitle}>ALERTS</Text>
        <FlatList
          data={alerts?.slice(0, 6)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.alertList}
          renderItem={({ item }) => (
            <AlertCard
              title={item.title}
              message={item.message}
              priority={item.priority}
              read={item.read}
              timeAgo={getTimeAgo(item.createdAt)}
              actionLabel={item.actionLabel}
              onPress={() => {}}
            />
          )}
        />

        {/* Activity Feed */}
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <GlassCard>
          {ACTIVITY.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                idx < ACTIVITY.length - 1 && styles.activityBorder,
              ]}
            >
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.fabSecondary,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <ScanLine size={20} color={Colors.accent.copper} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.fabPrimary,
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
          onPress={() => {}}
        >
          <Plus size={24} color={Colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.secondary,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    color: Colors.text.primary,
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.semantic.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.white,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  alertList: {
    paddingRight: Spacing.base,
  },
  // Activity feed
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.copper,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
  },
  // FABs
  fabContainer: {
    position: 'absolute',
    right: Spacing.base,
    bottom: 110,
    alignItems: 'center',
    gap: Spacing.md,
  },
  fabSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent.copper,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.copper,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
