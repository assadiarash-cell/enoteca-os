import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight } from '@/constants/typography';
import { Radius, TOUCH_TARGET } from '@/constants/spacing';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const containerStyle: ViewStyle[] = [
    styles.base,
    size === 'lg' && styles.sizeLg,
    variantStyles[variant].container,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const textStyleArr: TextStyle[] = [
    styles.text,
    size === 'lg' && styles.textLg,
    variantStyles[variant].text,
    disabled && styles.textDisabled,
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...containerStyle,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.accent.copper}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyleArr}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  primary: {
    container: {
      backgroundColor: Colors.accent.copper,
    },
    text: {
      color: Colors.white,
    },
  },
  ghost: {
    container: {
      backgroundColor: Colors.transparent,
      borderWidth: 1,
      borderColor: Colors.border.strong,
    },
    text: {
      color: Colors.text.primary,
    },
  },
  danger: {
    container: {
      backgroundColor: Colors.semantic.dangerMuted,
      borderWidth: 1,
      borderColor: Colors.semantic.danger,
    },
    text: {
      color: Colors.semantic.dangerLight,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH_TARGET,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sizeLg: {
    minHeight: 56,
    paddingHorizontal: 32,
    borderRadius: Radius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
  },
  textLg: {
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  textDisabled: {
    color: Colors.text.disabled,
  },
});
