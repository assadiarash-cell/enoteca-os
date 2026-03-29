import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Wine } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';
import { Badge } from './Badge';
import type { Bottle } from '@/hooks/useBottles';

interface BottleCardProps {
  bottle: Bottle;
  onPress?: () => void;
}

const statusVariant = {
  in_stock: 'success' as const,
  reserved: 'warning' as const,
  sold: 'neutral' as const,
};

const statusLabel = {
  in_stock: 'In Stock',
  reserved: 'Reserved',
  sold: 'Sold',
};

export function BottleCard({ bottle, onPress }: BottleCardProps) {
  const formattedPrice = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(bottle.estimatedValue);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.thumb}>
        <Wine size={28} color={Colors.accent.copperLight} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.producer} numberOfLines={1}>
          {bottle.producer}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {bottle.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.vintage}>{bottle.vintage}</Text>
          <Text style={styles.dot}>{'  \u00B7  '}</Text>
          <Text style={styles.region}>{bottle.region}</Text>
          <Text style={styles.dot}>{'  \u00B7  '}</Text>
          <Text style={styles.qty}>x{bottle.quantity}</Text>
        </View>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text
          style={[
            styles.margin,
            {
              color:
                bottle.margin >= 50
                  ? Colors.semantic.successLight
                  : Colors.semantic.warningLight,
            },
          ]}
        >
          +{bottle.margin.toFixed(0)}%
        </Text>
        <Badge
          label={statusLabel[bottle.status]}
          variant={statusVariant[bottle.status]}
          small
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  producer: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vintage: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.accent.copperLight,
  },
  dot: {
    color: Colors.text.tertiary,
    fontSize: FontSize.sm,
  },
  region: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
  },
  qty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.primary,
  },
  margin: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
});
