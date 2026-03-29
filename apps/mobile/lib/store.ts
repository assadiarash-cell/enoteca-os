import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  businessName?: string;
}

export type BottleSortKey = 'name' | 'vintage' | 'price' | 'margin' | 'addedAt';
export type BottleFilterRegion = 'all' | 'piemonte' | 'toscana' | 'veneto' | 'campania' | 'sicilia';
export type BottleFilterStatus = 'all' | 'in_stock' | 'reserved' | 'sold';
export type DealTab = 'acquisitions' | 'sales';

interface BottleFilters {
  search: string;
  region: BottleFilterRegion;
  status: BottleFilterStatus;
  sort: BottleSortKey;
  sortDesc: boolean;
}

interface UIState {
  dealTab: DealTab;
  scanProcessing: boolean;
  onboardingComplete: boolean;
}

// ── Store ──────────────────────────────────────────────

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Bottle filters
  bottleFilters: BottleFilters;
  setBottleSearch: (search: string) => void;
  setBottleRegion: (region: BottleFilterRegion) => void;
  setBottleStatus: (status: BottleFilterStatus) => void;
  setBottleSort: (sort: BottleSortKey) => void;
  resetBottleFilters: () => void;

  // UI state
  ui: UIState;
  setDealTab: (tab: DealTab) => void;
  setScanProcessing: (processing: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
}

const defaultBottleFilters: BottleFilters = {
  search: '',
  region: 'all',
  status: 'all',
  sort: 'addedAt',
  sortDesc: true,
};

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Bottle filters
  bottleFilters: defaultBottleFilters,
  setBottleSearch: (search) =>
    set((s) => ({ bottleFilters: { ...s.bottleFilters, search } })),
  setBottleRegion: (region) =>
    set((s) => ({ bottleFilters: { ...s.bottleFilters, region } })),
  setBottleStatus: (status) =>
    set((s) => ({ bottleFilters: { ...s.bottleFilters, status } })),
  setBottleSort: (sort) =>
    set((s) => ({
      bottleFilters: {
        ...s.bottleFilters,
        sort,
        sortDesc: s.bottleFilters.sort === sort ? !s.bottleFilters.sortDesc : true,
      },
    })),
  resetBottleFilters: () => set({ bottleFilters: defaultBottleFilters }),

  // UI state
  ui: {
    dealTab: 'acquisitions',
    scanProcessing: false,
    onboardingComplete: false,
  },
  setDealTab: (tab) => set((s) => ({ ui: { ...s.ui, dealTab: tab } })),
  setScanProcessing: (processing) =>
    set((s) => ({ ui: { ...s.ui, scanProcessing: processing } })),
  setOnboardingComplete: (complete) =>
    set((s) => ({ ui: { ...s.ui, onboardingComplete: complete } })),
}));
