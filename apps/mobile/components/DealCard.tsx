import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { User, Package } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';
import type { Deal } from '@/hooks/useDeals';

interface DealCardProps {
  deal: Deal;
  onPress?: () => void;
}

export function DealCard({ deal, onPress }: DealCardProps) {
  const bottleCount = deal.bottles.reduce((sum, b) => sum + b.quantity, 0);
  const formattedValue = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(deal.totalValue);

  const timeAgo = getTimeAgo(deal.updatedAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.85 },
      ]}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <User size={20} color={Colors.text.secondary} />
      </View>

      {/* Counterparty */}
      <Text style={styles.name} numberOfLines={1}>
        {deal.counterpartyName}
      </Text>

      {/* Bottles summary */}
      <View style={styles.bottlesRow}>
        <Package size={14} color={Colors.text.tertiary} />
        <Text style={styles.bottleCount}>
          {bottleCount} {bottleCount === 1 ? 'bottle' : 'bottles'}
        </Text>
      </View>

      {/* First bottle name */}
      <Text style={styles.bottleName} numberOfLines={1}>
        {deal.bottles[0]?.name}
        {deal.bottles.length > 1 ? ` +${deal.bottles.length - 1}` : ''}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.value}>{formattedValue}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {deal.messageCount > 0 && (
        <View style={styles.msgBadge}>
          <Text style={styles.msgText}>{deal.messageCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.primary,
  },
  bottlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottleCount: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.tertiary,
  },
  bottleName: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  value: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.accent.copperLight,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
  },
  msgBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.accent.copper,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  msgText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.white,
  },
});
