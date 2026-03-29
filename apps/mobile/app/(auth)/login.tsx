import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius, TOUCH_TARGET } from '@/constants/spacing';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    if (!email) return;
    setLoading(true);
    // Simulate sending magic link
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  const handleAppleSignIn = () => {
    // Navigate to tabs as demo
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </Pressable>

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.brand}>
            <Text style={styles.logoText}>ENOTECA</Text>
            <Text style={styles.logoAccent}>OS</Text>
          </View>

          {sent ? (
            /* Success state */
            <View style={styles.sentContainer}>
              <View style={styles.mailIcon}>
                <Mail size={40} color={Colors.accent.copper} />
              </View>
              <Text style={styles.sentTitle}>Check your inbox</Text>
              <Text style={styles.sentDesc}>
                We sent a magic link to{'\n'}
                <Text style={styles.sentEmail}>{email}</Text>
              </Text>
              <Button
                title="Open Mail App"
                variant="ghost"
                onPress={() => {}}
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          ) : (
            /* Form */
            <>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>
                Enter your email to receive a magic link
              </Text>

              {/* Email input */}
              <View style={styles.inputWrap}>
                <Mail
                  size={18}
                  color={Colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@enoteca.com"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <Button
                title="Send Magic Link"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleSendLink}
                disabled={!email.includes('@')}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Apple Sign In */}
              <Pressable style={styles.appleButton} onPress={handleAppleSignIn}>
                <Text style={styles.appleLogo}>{'\uF8FF'}</Text>
                <Text style={styles.appleText}>Continue with Apple</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  flex: {
    flex: 1,
  },
  back: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing['3xl'],
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    color: Colors.text.primary,
    letterSpacing: LetterSpacing.widest,
  },
  logoAccent: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    color: Colors.accent.copper,
    letterSpacing: LetterSpacing.widest,
    marginLeft: 4,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.secondary,
    marginBottom: Spacing['2xl'],
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    height: 56,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  dividerText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginHorizontal: Spacing.base,
    letterSpacing: LetterSpacing.wider,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    height: 56,
    gap: Spacing.sm,
  },
  appleLogo: {
    fontSize: 20,
    color: Colors.black,
  },
  appleText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.black,
  },
  // Sent state
  sentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  mailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  sentTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  sentDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  sentEmail: {
    fontFamily: FontFamily.semiBold,
    color: Colors.accent.copperLight,
  },
});
