import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { DealCard } from '@/components/DealCard';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { useDeals, STAGE_ORDER, STAGE_LABELS, DealStage } from '@/hooks/useDeals';
import { useAppStore, DealTab } from '@/lib/store';

const TABS: { label: string; value: DealTab }[] = [
  { label: 'Acquisitions', value: 'acquisitions' },
  { label: 'Sales', value: 'sales' },
];

export default function DealsScreen() {
  const router = useRouter();
  const { ui, setDealTab } = useAppStore();
  const { data: deals } = useDeals();

  const dealsByStage = STAGE_ORDER.reduce<Record<DealStage, typeof deals>>((acc, stage) => {
    acc[stage] = deals?.filter((d) => d.stage === stage) ?? [];
    return acc;
  }, {} as Record<DealStage, typeof deals>);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Deals</Text>
        <Pressable style={styles.addBtn}>
          <Plus size={20} color={Colors.accent.copper} />
        </Pressable>
      </View>

      {/* Segment Control */}
      <View style={styles.segmentWrap}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.value}
            style={[
              styles.segment,
              ui.dealTab === tab.value && styles.segmentActive,
            ]}
            onPress={() => setDealTab(tab.value)}
          >
            <Text
              style={[
                styles.segmentText,
                ui.dealTab === tab.value && styles.segmentTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Kanban Pipeline */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanban}
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={240}
      >
        {STAGE_ORDER.map((stage) => {
          const stageDeals = dealsByStage[stage] ?? [];
          return (
            <View key={stage} style={styles.column}>
              {/* Column header */}
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>
                  {STAGE_LABELS[stage]}
                </Text>
                <View style={styles.columnCount}>
                  <Text style={styles.columnCountText}>
                    {stageDeals.length}
                  </Text>
                </View>
              </View>

              {/* Cards */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.columnCards}
              >
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal!.id}
                    deal={deal!}
                    onPress={() => router.push(`/(tabs)/deals/${deal!.id}`)}
                  />
                ))}
                {stageDeals.length === 0 && (
                  <View style={styles.emptyColumn}>
                    <Text style={styles.emptyText}>No deals</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    color: Colors.text.primary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.copperMuted,
    borderWidth: 1,
    borderColor: Colors.accent.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Segment
  segmentWrap: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.accent.copperMuted,
    borderWidth: 1,
    borderColor: Colors.accent.copper,
  },
  segmentText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  segmentTextActive: {
    color: Colors.accent.copperLight,
    fontFamily: FontFamily.semiBold,
  },
  // Kanban
  kanban: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    paddingBottom: 120,
  },
  column: {
    width: 230,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  columnTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase',
  },
  columnCount: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  columnCountText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  columnCards: {
    gap: Spacing.sm,
  },
  emptyColumn: {
    height: 80,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
});
