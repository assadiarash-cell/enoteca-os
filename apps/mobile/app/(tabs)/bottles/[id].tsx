import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Wine,
  Shield,
  TrendingUp,
  Clock,
  Share2,
  Edit3,
  Trash2,
} from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius, TOUCH_TARGET } from '@/constants/spacing';
import { useBottle } from '@/hooks/useBottles';

// ── Mock history timeline ──

const TIMELINE = [
  { id: '1', event: 'Added to inventory', date: 'Mar 20, 2026', detail: 'Scanned and catalogued' },
  { id: '2', event: 'AI authenticity check', date: 'Mar 20, 2026', detail: 'Score: 97/100 — Passed' },
  { id: '3', event: 'Price estimate updated', date: 'Mar 22, 2026', detail: 'Market value adjusted +5%' },
  { id: '4', event: 'Photo uploaded', date: 'Mar 23, 2026', detail: '3 photos added' },
];

export default function BottleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: bottle } = useBottle(id!);

  if (!bottle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const formattedPrice = (v: number) =>
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v);

  const marketLow = Math.round(bottle.estimatedValue * 0.85);
  const marketHigh = Math.round(bottle.estimatedValue * 1.2);
  const markerPct =
    ((bottle.estimatedValue - marketLow) / (marketHigh - marketLow)) * 100;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroPlaceholder}>
            <Wine size={80} color={Colors.accent.copperMuted} strokeWidth={0.7} />
          </View>
          {/* Overlay header */}
          <SafeAreaView style={styles.heroHeader} edges={['top']}>
            <Pressable
              style={styles.heroBtn}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color={Colors.white} />
            </Pressable>
            <Pressable style={styles.heroBtn}>
              <Share2 size={20} color={Colors.white} />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {/* Identity Card */}
          <GlassCard style={styles.identityCard}>
            <Text style={styles.producer}>{bottle.producer}</Text>
            <Text style={styles.bottleName}>{bottle.name}</Text>
            <View style={styles.metaRow}>
              <Badge label={String(bottle.vintage)} variant="premium" />
              <Badge label={bottle.region} variant="neutral" />
              <Badge label={bottle.denomination} variant="neutral" />
              <Badge label={bottle.format} variant="neutral" />
            </View>
            {bottle.notes && (
              <Text style={styles.notes}>{bottle.notes}</Text>
            )}
          </GlassCard>

          {/* AI Authenticity Card */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={18} color={Colors.accent.copper} />
              <Text style={styles.sectionTitle}>AI AUTHENTICITY</Text>
            </View>
            {/* Gauge */}
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeTrack}>
                <View
                  style={[
                    styles.gaugeFill,
                    {
                      width: `${bottle.authenticityScore}%`,
                      backgroundColor:
                        bottle.authenticityScore >= 90
                          ? Colors.semantic.success
                          : bottle.authenticityScore >= 70
                          ? Colors.semantic.warning
                          : Colors.semantic.danger,
                    },
                  ]}
                />
              </View>
              <Text style={styles.gaugeValue}>{bottle.authenticityScore}/100</Text>
            </View>
            <Text style={styles.gaugeLabel}>
              {bottle.authenticityScore >= 90
                ? 'High confidence — all checks passed'
                : bottle.authenticityScore >= 70
                ? 'Moderate confidence — review recommended'
                : 'Low confidence — manual verification required'}
            </Text>
          </GlassCard>

          {/* Pricing Card */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={18} color={Colors.accent.copper} />
              <Text style={styles.sectionTitle}>PRICING</Text>
            </View>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Purchase</Text>
                <Text style={styles.priceValue}>
                  {formattedPrice(bottle.purchasePrice)}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.priceLabel}>Est. Value</Text>
                <Text style={[styles.priceValue, { color: Colors.accent.copperLight }]}>
                  {formattedPrice(bottle.estimatedValue)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.priceLabel}>Margin</Text>
                <Text
                  style={[
                    styles.priceValue,
                    {
                      color:
                        bottle.margin >= 50
                          ? Colors.semantic.successLight
                          : Colors.semantic.warningLight,
                    },
                  ]}
                >
                  +{bottle.margin.toFixed(1)}%
                </Text>
              </View>
            </View>
            {/* Market range bar */}
            <Text style={styles.rangeTitle}>Market Range</Text>
            <View style={styles.rangeBar}>
              <View style={styles.rangeTrack}>
                <View
                  style={[
                    styles.rangeMarker,
                    { left: `${Math.min(Math.max(markerPct, 5), 95)}%` },
                  ]}
                />
              </View>
              <View style={styles.rangeLabels}>
                <Text style={styles.rangeLabel}>{formattedPrice(marketLow)}</Text>
                <Text style={styles.rangeLabel}>{formattedPrice(marketHigh)}</Text>
              </View>
            </View>
          </GlassCard>

          {/* History Timeline */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={18} color={Colors.accent.copper} />
              <Text style={styles.sectionTitle}>HISTORY</Text>
            </View>
            {TIMELINE.map((item, idx) => (
              <View key={item.id} style={styles.timelineRow}>
                <View style={styles.timelineLine}>
                  <View style={styles.timelineDot} />
                  {idx < TIMELINE.length - 1 && (
                    <View style={styles.timelineConnector} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineEvent}>{item.event}</Text>
                  <Text style={styles.timelineDetail}>{item.detail}</Text>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Spacer */}
          <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <SafeAreaView style={styles.actionBar} edges={['bottom']}>
        <Button title="Edit" variant="ghost" icon={<Edit3 size={16} color={Colors.text.primary} />} onPress={() => {}} />
        <Button title="Sell" variant="primary" style={{ flex: 1 }} onPress={() => {}} />
        <Pressable style={styles.deleteBtn}>
          <Trash2 size={20} color={Colors.semantic.dangerLight} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 100,
  },
  // Hero
  hero: {
    height: 320,
    backgroundColor: Colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholder: {
    opacity: 0.5,
  },
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  heroBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: Spacing.base,
    marginTop: -Spacing['2xl'],
  },
  // Identity
  identityCard: {
    marginBottom: Spacing.md,
  },
  producer: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  bottleName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  notes: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  // Sections
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
  },
  // Gauge
  gaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  gaugeTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bg.elevated,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 8,
    borderRadius: 4,
  },
  gaugeValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    minWidth: 56,
    textAlign: 'right',
  },
  gaugeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // Pricing
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  priceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  rangeTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  rangeBar: {
    marginBottom: Spacing.xs,
  },
  rangeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bg.elevated,
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  rangeMarker: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent.copper,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  // Timeline
  timelineRow: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineLine: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent.copper,
    marginTop: 4,
  },
  timelineConnector: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border.default,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  timelineEvent: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.primary,
  },
  timelineDetail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  timelineDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  deleteBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: Radius.md,
    backgroundColor: Colors.semantic.dangerMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
