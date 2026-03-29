import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: React.ReactNode;
}

export function KPICard({
  label,
  value,
  change,
  changePositive,
  icon,
}: KPICardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {change && (
        <Text
          style={[
            styles.change,
            {
              color: changePositive
                ? Colors.semantic.successLight
                : Colors.semantic.dangerLight,
            },
          ]}
        >
          {changePositive ? '+' : ''}
          {change}
        </Text>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  value: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  change: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
});
