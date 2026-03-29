import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Camera,
  ImagePlus,
  X,
  CheckCircle2,
  Search,
  Shield,
  Tag,
} from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius, TOUCH_TARGET } from '@/constants/spacing';

type ScanState = 'idle' | 'processing' | 'result';

interface ProcessingStep {
  label: string;
  icon: React.ReactNode;
  done: boolean;
}

export default function ScanScreen() {
  const router = useRouter();
  const [state, setState] = useState<ScanState>('idle');
  const [processingStep, setProcessingStep] = useState(0);

  const steps: ProcessingStep[] = [
    { label: 'Analyzing label...', icon: <Search size={18} color={Colors.accent.copper} />, done: processingStep > 0 },
    { label: 'Verifying authenticity...', icon: <Shield size={18} color={Colors.accent.copper} />, done: processingStep > 1 },
    { label: 'Estimating price...', icon: <Tag size={18} color={Colors.accent.copper} />, done: processingStep > 2 },
  ];

  const handleCapture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setState('processing');

    // Simulate processing steps
    for (let i = 0; i <= 3; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      setProcessingStep(i);
    }

    setState('result');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleReset = () => {
    setState('idle');
    setProcessingStep(0);
  };

  return (
    <View style={styles.container}>
      {/* Camera placeholder */}
      <View style={styles.cameraView}>
        <View style={styles.cameraPlaceholder}>
          <Camera size={48} color={Colors.text.tertiary} strokeWidth={1} />
          <Text style={styles.cameraText}>Camera Preview</Text>
        </View>

        {/* Overlay guides */}
        {state === 'idle' && (
          <View style={styles.overlay}>
            {/* Corner guides */}
            <View style={styles.guideFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.guideText}>
              Align the bottle label within the frame
            </Text>
          </View>
        )}

        {/* Close button */}
        <SafeAreaView style={styles.closeWrap} edges={['top']}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <X size={22} color={Colors.white} />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Bottom panel */}
      <SafeAreaView style={styles.panel} edges={['bottom']}>
        {state === 'idle' && (
          <View style={styles.idlePanel}>
            {/* Gallery button */}
            <Pressable style={styles.galleryBtn}>
              <ImagePlus size={22} color={Colors.text.secondary} />
            </Pressable>

            {/* Capture button */}
            <Pressable
              onPress={handleCapture}
              style={({ pressed }) => [
                styles.captureOuter,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <View style={styles.captureInner} />
            </Pressable>

            {/* Spacer for symmetry */}
            <View style={{ width: 56 }} />
          </View>
        )}

        {state === 'processing' && (
          <View style={styles.processingPanel}>
            <ActivityIndicator size="small" color={Colors.accent.copper} />
            <Text style={styles.processingTitle}>Analyzing bottle...</Text>
            <View style={styles.stepsList}>
              {steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  {step.done ? (
                    <CheckCircle2 size={18} color={Colors.semantic.success} />
                  ) : (
                    step.icon
                  )}
                  <Text
                    style={[
                      styles.stepLabel,
                      step.done && { color: Colors.semantic.successLight },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {state === 'result' && (
          <View style={styles.resultPanel}>
            <GlassCard>
              <View style={styles.resultHeader}>
                <CheckCircle2 size={24} color={Colors.semantic.success} />
                <Text style={styles.resultTitle}>Bottle Identified</Text>
              </View>
              <Text style={styles.resultProducer}>GIACOMO CONTERNO</Text>
              <Text style={styles.resultName}>
                Barolo Monfortino Riserva 2013
              </Text>
              <View style={styles.resultMeta}>
                <Badge label="97/100" variant="success" small />
                <Badge label="Piemonte" variant="neutral" small />
                <Badge label="Barolo DOCG" variant="neutral" small />
              </View>
              <View style={styles.resultPricing}>
                <View>
                  <Text style={styles.resultPriceLabel}>Est. Value</Text>
                  <Text style={styles.resultPrice}>€1,420</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.resultPriceLabel}>Market Trend</Text>
                  <Text
                    style={[
                      styles.resultPrice,
                      { color: Colors.semantic.successLight },
                    ]}
                  >
                    +12%
                  </Text>
                </View>
              </View>
            </GlassCard>
            <View style={styles.resultActions}>
              <Button
                title="Add to Inventory"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => router.push('/(tabs)/bottles')}
              />
              <Button
                title="Scan Another"
                variant="ghost"
                onPress={handleReset}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  // Camera
  cameraView: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  cameraText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  closeWrap: {
    position: 'absolute',
    top: 0,
    right: Spacing.base,
  },
  closeBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideFrame: {
    width: 260,
    height: 340,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.accent.copper,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  guideText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xl,
  },
  // Panels
  panel: {
    backgroundColor: Colors.bg.primary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  idlePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing['2xl'],
  },
  galleryBtn: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.accent.copper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent.copper,
  },
  // Processing
  processingPanel: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  processingTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  stepsList: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  // Result
  resultPanel: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.semantic.successLight,
  },
  resultProducer: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
    marginBottom: 4,
  },
  resultName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  resultMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  resultPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  resultPriceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  resultPrice: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
  },
  resultActions: {
    gap: Spacing.md,
    alignItems: 'center',
  },
});
