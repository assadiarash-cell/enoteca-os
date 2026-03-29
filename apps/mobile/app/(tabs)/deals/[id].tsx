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
  User,
  Phone,
  MessageSquare,
  Wine,
  Send,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius, TOUCH_TARGET } from '@/constants/spacing';
import { useDeal, STAGE_LABELS } from '@/hooks/useDeals';

// ── Mock conversation ──

const MESSAGES = [
  { id: '1', from: 'them', text: 'Ho due casse di Monfortino 2013, interessato?', time: 'Mar 25, 10:15' },
  { id: '2', from: 'me', text: 'Molto interessato. Posso vedere le foto delle etichette?', time: 'Mar 25, 10:32' },
  { id: '3', from: 'them', text: 'Certo, le invio subito. Sono conservate in cantina climatizzata.', time: 'Mar 25, 11:00' },
  { id: '4', from: 'me', text: 'Perfetto. La mia offerta: €850 a bottiglia per il lotto completo.', time: 'Mar 26, 09:15' },
  { id: '5', from: 'them', text: 'Accetto. Quando possiamo organizzare il ritiro?', time: 'Mar 28, 14:30' },
];

const stageVariant: Record<string, 'warning' | 'neutral' | 'success' | 'premium'> = {
  negotiating: 'warning',
  offered: 'neutral',
  accepted: 'success',
  pickup: 'premium',
  completed: 'success',
};

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: deal } = useDeal(id!);

  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const formattedValue = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(deal.totalValue);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {deal.type === 'acquisition' ? 'Acquisition' : 'Sale'}
          </Text>
          <Badge
            label={STAGE_LABELS[deal.stage]}
            variant={stageVariant[deal.stage] ?? 'neutral'}
            small
          />
        </View>
        <View style={{ width: TOUCH_TARGET }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Counterparty Card */}
        <GlassCard>
          <View style={styles.contactRow}>
            <View style={styles.avatar}>
              <User size={24} color={Colors.text.secondary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{deal.counterpartyName}</Text>
              <Text style={styles.contactRole}>
                {deal.type === 'acquisition' ? 'Seller' : 'Buyer'}
              </Text>
            </View>
            <Pressable style={styles.contactAction}>
              <Phone size={18} color={Colors.accent.copper} />
            </Pressable>
            <Pressable style={styles.contactAction}>
              <MessageSquare size={18} color={Colors.accent.copper} />
            </Pressable>
          </View>
        </GlassCard>

        {/* Bottles */}
        <Text style={styles.sectionTitle}>BOTTLES</Text>
        <GlassCard>
          {deal.bottles.map((bottle, idx) => (
            <View
              key={bottle.id}
              style={[
                styles.bottleRow,
                idx < deal.bottles.length - 1 && styles.bottleBorder,
              ]}
            >
              <View style={styles.bottleIcon}>
                <Wine size={18} color={Colors.accent.copperLight} />
              </View>
              <View style={styles.bottleInfo}>
                <Text style={styles.bottleProducer}>{bottle.producer}</Text>
                <Text style={styles.bottleName}>
                  {bottle.name} {bottle.vintage}
                </Text>
              </View>
              <View style={styles.bottleRight}>
                <Text style={styles.bottlePrice}>
                  {new Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(bottle.unitPrice)}
                </Text>
                <Text style={styles.bottleQty}>x{bottle.quantity}</Text>
              </View>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formattedValue}</Text>
          </View>
        </GlassCard>

        {/* Notes */}
        {deal.notes && (
          <>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <GlassCard>
              <Text style={styles.notesText}>{deal.notes}</Text>
            </GlassCard>
          </>
        )}

        {/* Conversation */}
        <Text style={styles.sectionTitle}>CONVERSATION</Text>
        <GlassCard>
          {MESSAGES.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.msgBubble,
                msg.from === 'me' ? styles.msgMe : styles.msgThem,
              ]}
            >
              <Text style={styles.msgText}>{msg.text}</Text>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Action buttons */}
      <SafeAreaView style={styles.actionBar} edges={['bottom']}>
        {deal.stage !== 'completed' && (
          <>
            <Button
              title="Decline"
              variant="danger"
              icon={<XCircle size={16} color={Colors.semantic.dangerLight} />}
              onPress={() => {}}
            />
            <Button
              title={
                deal.stage === 'negotiating'
                  ? 'Send Offer'
                  : deal.stage === 'accepted'
                  ? 'Schedule Pickup'
                  : 'Advance'
              }
              variant="primary"
              style={{ flex: 1 }}
              icon={
                deal.stage === 'negotiating' ? (
                  <Send size={16} color={Colors.white} />
                ) : (
                  <CheckCircle2 size={16} color={Colors.white} />
                )
              }
              onPress={() => {}}
            />
          </>
        )}
        {deal.stage === 'completed' && (
          <Badge label="Completed" variant="success" />
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  loading: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  // Contact
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  contactRole: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  contactAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: LetterSpacing.widest,
    marginTop: Spacing.sm,
  },
  // Bottles
  bottleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  bottleBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  bottleIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleInfo: {
    flex: 1,
  },
  bottleProducer: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bottleName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  bottleRight: {
    alignItems: 'flex-end',
  },
  bottlePrice: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  bottleQty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.strong,
  },
  totalLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.accent.copperLight,
  },
  // Notes
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  // Messages
  msgBubble: {
    maxWidth: '85%',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  msgMe: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent.copperMuted,
    borderBottomRightRadius: 4,
  },
  msgThem: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bg.elevated,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    color: Colors.text.primary,
  },
  msgTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'right',
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
});
