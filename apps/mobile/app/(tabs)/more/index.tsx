import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BarChart3,
  Users,
  UserCheck,
  Newspaper,
  Globe,
  Bot,
  UsersRound,
  Settings,
  UserCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius, TOUCH_TARGET } from '@/constants/spacing';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  badge?: string;
  section: string;
}

const MENU_ITEMS: MenuItem[] = [
  // Tools
  { label: 'Analytics', icon: <BarChart3 size={20} color={Colors.accent.copperLight} />, section: 'TOOLS' },
  { label: 'Sellers CRM', icon: <Users size={20} color={Colors.accent.copperLight} />, badge: '24', section: 'TOOLS' },
  { label: 'Buyers CRM', icon: <UserCheck size={20} color={Colors.accent.copperLight} />, badge: '18', section: 'TOOLS' },
  { label: 'Content Hub', icon: <Newspaper size={20} color={Colors.accent.copperLight} />, section: 'TOOLS' },
  { label: 'Market Intelligence', icon: <Globe size={20} color={Colors.accent.copperLight} />, section: 'TOOLS' },
  { label: 'AI Agents', icon: <Bot size={20} color={Colors.accent.copperLight} />, badge: '3 active', section: 'TOOLS' },
  // Account
  { label: 'Team', icon: <UsersRound size={20} color={Colors.text.secondary} />, section: 'ACCOUNT' },
  { label: 'Settings', icon: <Settings size={20} color={Colors.text.secondary} />, section: 'ACCOUNT' },
  { label: 'Profile', icon: <UserCircle size={20} color={Colors.text.secondary} />, section: 'ACCOUNT' },
];

export default function MoreScreen() {
  const sections = ['TOOLS', 'ACCOUNT'] as const;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <Text style={styles.title}>More</Text>

        {/* User card */}
        <Pressable style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>M</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Marco Verdi</Text>
            <Text style={styles.userBusiness}>Antiche Bottiglie SRL</Text>
          </View>
          <ChevronRight size={20} color={Colors.text.tertiary} />
        </Pressable>

        {/* Menu sections */}
        {sections.map((section) => (
          <View key={section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            <View style={styles.menuGroup}>
              {MENU_ITEMS.filter((item) => item.section === section).map(
                (item, idx, arr) => (
                  <Pressable
                    key={item.label}
                    style={({ pressed }) => [
                      styles.menuItem,
                      idx < arr.length - 1 && styles.menuItemBorder,
                      pressed && { backgroundColor: Colors.surface.glassHover },
                    ]}
                  >
                    <View style={styles.menuIconWrap}>{item.icon}</View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.badge && (
                      <View style={styles.menuBadge}>
                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <ChevronRight size={16} color={Colors.text.tertiary} />
                  </Pressable>
                )
              )}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <Pressable style={styles.signOut}>
          <LogOut size={18} color={Colors.semantic.dangerLight} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.version}>ENOTECA OS v0.1.0</Text>

        <View style={{ height: 120 }} />
      </ScrollView>
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
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    color: Colors.text.primary,
    paddingTop: Spacing.base,
    marginBottom: Spacing.lg,
  },
  // User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.copperMuted,
    borderWidth: 1,
    borderColor: Colors.accent.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitial: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.accent.copperLight,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  userBusiness: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // Sections
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  menuGroup: {
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    minHeight: TOUCH_TARGET,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  menuBadge: {
    backgroundColor: Colors.accent.copperMuted,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  menuBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.accent.copperLight,
  },
  // Sign out
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing['2xl'],
    paddingVertical: Spacing.md,
  },
  signOutText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.semantic.dangerLight,
  },
  // Version
  version: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
