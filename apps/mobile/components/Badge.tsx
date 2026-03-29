import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'premium';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  small?: boolean;
  style?: ViewStyle;
}

const variantColors: Record<
  BadgeVariant,
  { bg: string; text: string; border: string }
> = {
  success: {
    bg: Colors.semantic.successMuted,
    text: Colors.semantic.successLight,
    border: Colors.semantic.success,
  },
  warning: {
    bg: Colors.semantic.warningMuted,
    text: Colors.semantic.warningLight,
    border: Colors.semantic.warning,
  },
  danger: {
    bg: Colors.semantic.dangerMuted,
    text: Colors.semantic.dangerLight,
    border: Colors.semantic.danger,
  },
  neutral: {
    bg: Colors.surface.glass,
    text: Colors.text.secondary,
    border: Colors.border.default,
  },
  premium: {
    bg: Colors.accent.goldMuted,
    text: Colors.accent.goldLight,
    border: Colors.accent.gold,
  },
};

export function Badge({ label, variant = 'neutral', small = false, style }: BadgeProps) {
  const v = variantColors[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
        },
        small && styles.small,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: v.text },
          small && styles.textSmall,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  text: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: 9,
    lineHeight: 12,
  },
});
