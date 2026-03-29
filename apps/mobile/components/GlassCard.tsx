import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  noPadding = false,
}: GlassCardProps) {
  return (
    <View style={[styles.outer, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.inner, noPadding && styles.noPad]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surface.glassBorder,
    backgroundColor: Colors.surface.glass,
    overflow: 'hidden',
  },
  inner: {
    padding: Spacing.base,
  },
  noPad: {
    padding: 0,
  },
});
