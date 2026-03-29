import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Radius, Spacing } from '@/constants/spacing';
import { AlertPriority } from '@/hooks/useAlerts';

interface AlertCardProps {
  title: string;
  message: string;
  priority: AlertPriority;
  read: boolean;
  timeAgo: string;
  actionLabel?: string;
  onPress?: () => void;
}

const priorityBorder: Record<AlertPriority, string> = {
  high: Colors.semantic.danger,
  medium: Colors.semantic.warning,
  low: Colors.semantic.info,
};

const priorityBg: Record<AlertPriority, string> = {
  high: Colors.semantic.dangerMuted,
  medium: Colors.semantic.warningMuted,
  low: Colors.semantic.infoMuted,
};

export function AlertCard({
  title,
  message,
  priority,
  read,
  timeAgo,
  actionLabel,
  onPress,
}: AlertCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderLeftColor: priorityBorder[priority],
          backgroundColor: read ? Colors.bg.card : priorityBg[priority],
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.top}>
        <Text style={[styles.title, !read && styles.unread]} numberOfLines={1}>
          {title}
        </Text>
        {!read && <View style={styles.dot} />}
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{timeAgo}</Text>
        {actionLabel && <Text style={styles.action}>{actionLabel}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderLeftWidth: 3,
    padding: Spacing.md,
    marginRight: Spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.primary,
    flex: 1,
  },
  unread: {
    color: Colors.text.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.copper,
    marginLeft: Spacing.sm,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
  },
  action: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.accent.copper,
    letterSpacing: 0.3,
  },
});
