import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-blur';
import { Wine } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Dark cellar background placeholder */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay} />
        {/* Decorative icon in place of hero image */}
        <View style={styles.heroIcon}>
          <Wine size={120} color={Colors.accent.copperMuted} strokeWidth={0.8} />
        </View>
      </View>

      {/* Content */}
      <SafeAreaView style={styles.content} edges={['bottom']}>
        <View style={styles.brand}>
          <Text style={styles.logoText}>ENOTECA</Text>
          <Text style={styles.logoAccent}>OS</Text>
        </View>

        <Text style={styles.subtitle}>
          The operating system{'\n'}for rare bottles
        </Text>

        <Text style={styles.description}>
          Inventory, authentication, pricing, and deal management
          — built for collectible bottle dealers.
        </Text>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
          />
          <Text style={styles.terms}>
            By continuing you agree to our Terms of Service
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  hero: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 12, 0.65)',
  },
  heroIcon: {
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: LineHeight['3xl'],
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.widest,
  },
  logoAccent: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: LineHeight['3xl'],
    color: Colors.accent.copper,
    letterSpacing: LetterSpacing.widest,
    marginLeft: 6,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing['3xl'],
  },
  actions: {
    gap: Spacing.md,
  },
  terms: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
