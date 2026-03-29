import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { BottleCard } from '@/components/BottleCard';
import { Colors } from '@/constants/colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from '@/constants/typography';
import { Spacing, Radius } from '@/constants/spacing';
import { useBottles } from '@/hooks/useBottles';
import { useAppStore, BottleFilterRegion, BottleFilterStatus } from '@/lib/store';

const REGION_CHIPS: { label: string; value: BottleFilterRegion }[] = [
  { label: 'All', value: 'all' },
  { label: 'Piemonte', value: 'piemonte' },
  { label: 'Toscana', value: 'toscana' },
  { label: 'Veneto', value: 'veneto' },
  { label: 'Campania', value: 'campania' },
  { label: 'Sicilia', value: 'sicilia' },
];

const STATUS_CHIPS: { label: string; value: BottleFilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Sold', value: 'sold' },
];

export default function BottlesScreen() {
  const router = useRouter();
  const { data: bottles, isLoading } = useBottles();
  const {
    bottleFilters,
    setBottleSearch,
    setBottleRegion,
    setBottleStatus,
  } = useAppStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bottles</Text>
        <Pressable style={styles.filterBtn}>
          <SlidersHorizontal size={20} color={Colors.text.secondary} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={18} color={Colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bottles, producers..."
          placeholderTextColor={Colors.text.tertiary}
          value={bottleFilters.search}
          onChangeText={setBottleSearch}
        />
      </View>

      {/* Region chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {REGION_CHIPS.map((chip) => (
          <Pressable
            key={chip.value}
            style={[
              styles.chip,
              bottleFilters.region === chip.value && styles.chipActive,
            ]}
            onPress={() => setBottleRegion(chip.value)}
          >
            <Text
              style={[
                styles.chipText,
                bottleFilters.region === chip.value && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        ))}
        <View style={styles.chipDivider} />
        {STATUS_CHIPS.map((chip) => (
          <Pressable
            key={chip.value}
            style={[
              styles.chip,
              bottleFilters.status === chip.value && styles.chipActive,
            ]}
            onPress={() => setBottleStatus(chip.value)}
          >
            <Text
              style={[
                styles.chipText,
                bottleFilters.status === chip.value && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Bottle count */}
      <Text style={styles.count}>
        {bottles?.length ?? 0} bottles
      </Text>

      {/* List */}
      <View style={styles.listContainer}>
        <FlashList
          data={bottles ?? []}
          keyExtractor={(item) => item.id}
          estimatedItemSize={90}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <BottleCard
              bottle={item}
              onPress={() => router.push(`/(tabs)/bottles/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {isLoading ? 'Loading...' : 'No bottles found'}
              </Text>
            </View>
          }
        />
      </View>
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
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  chips: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  chipActive: {
    backgroundColor: Colors.accent.copperMuted,
    borderColor: Colors.accent.copper,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  chipTextActive: {
    color: Colors.accent.copperLight,
  },
  chipDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border.default,
    alignSelf: 'center',
    marginHorizontal: Spacing.xs,
  },
  count: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  list: {
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.tertiary,
  },
});
