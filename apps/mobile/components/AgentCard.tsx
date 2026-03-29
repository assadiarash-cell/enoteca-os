import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bot } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

type AgentStatus = 'active' | 'idle' | 'error';

interface AgentCardProps {
  name: string;
  description: string;
  status: AgentStatus;
  lastRun?: string;
  onPress?: () => void;
}

const statusConfig: Record<
  AgentStatus,
  { label: string; variant: 'success' | 'neutral' | 'danger'; pulseColor: string }
> = {
  active: {
    label: 'Active',
    variant: 'success',
    pulseColor: Colors.semantic.success,
  },
  idle: {
    label: 'Idle',
    variant: 'neutral',
    pulseColor: Colors.text.tertiary,
  },
  error: {
    label: 'Error',
    variant: 'danger',
    pulseColor: Colors.semantic.danger,
  },
};

export function AgentCard({
  name,
  description,
  status,
  lastRun,
  onPress,
}: AgentCardProps) {
  const cfg = statusConfig[status];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <GlassCard>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Bot size={20} color={Colors.accent.copperLight} />
          </View>
          <Badge label={cfg.label} variant={cfg.variant} small />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>
        {lastRun && (
          <Text style={styles.lastRun}>Last run: {lastRun}</Text>
        )}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  desc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  lastRun: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
  },
});
