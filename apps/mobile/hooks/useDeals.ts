import { useQuery } from '@tanstack/react-query';
import { useAppStore, DealTab } from '@/lib/store';

// ── Types ──────────────────────────────────────────────

export type DealStage =
  | 'negotiating'
  | 'offered'
  | 'accepted'
  | 'pickup'
  | 'completed';

export interface DealBottle {
  id: string;
  name: string;
  producer: string;
  vintage: number;
  quantity: number;
  unitPrice: number;
}

export interface Deal {
  id: string;
  type: 'acquisition' | 'sale';
  stage: DealStage;
  counterpartyName: string;
  counterpartyAvatar?: string;
  bottles: DealBottle[];
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  messageCount: number;
}

// ── Mock Data ──────────────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    type: 'acquisition',
    stage: 'negotiating',
    counterpartyName: 'Marco Bianchi',
    bottles: [
      { id: '1', name: 'Barolo Monfortino Riserva', producer: 'Giacomo Conterno', vintage: 2013, quantity: 2, unitPrice: 850 },
    ],
    totalValue: 1700,
    createdAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-28T14:30:00Z',
    notes: 'Seller wants cash only, meeting in Torino',
    messageCount: 5,
  },
  {
    id: 'd2',
    type: 'acquisition',
    stage: 'offered',
    counterpartyName: 'Famiglia Rossi',
    bottles: [
      { id: '2', name: 'Brunello di Montalcino Riserva', producer: 'Biondi-Santi', vintage: 2010, quantity: 6, unitPrice: 580 },
      { id: '3', name: 'Brunello di Montalcino Riserva', producer: 'Biondi-Santi', vintage: 2015, quantity: 3, unitPrice: 420 },
    ],
    totalValue: 4740,
    createdAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-03-27T16:00:00Z',
    messageCount: 12,
  },
  {
    id: 'd3',
    type: 'acquisition',
    stage: 'accepted',
    counterpartyName: 'Enoteca Vecchia Cantina',
    bottles: [
      { id: '4', name: 'Barbaresco Santo Stefano', producer: 'Bruno Giacosa', vintage: 2016, quantity: 6, unitPrice: 520 },
    ],
    totalValue: 3120,
    createdAt: '2026-03-15T11:30:00Z',
    updatedAt: '2026-03-26T10:00:00Z',
    messageCount: 8,
  },
  {
    id: 'd4',
    type: 'acquisition',
    stage: 'pickup',
    counterpartyName: 'Luigi Ferrero',
    bottles: [
      { id: '5', name: 'Amarone della Valpolicella', producer: 'Giuseppe Quintarelli', vintage: 2012, quantity: 3, unitPrice: 480 },
    ],
    totalValue: 1440,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-25T09:30:00Z',
    notes: 'Pickup scheduled March 30, Via Roma 42, Verona',
    messageCount: 15,
  },
  {
    id: 'd5',
    type: 'acquisition',
    stage: 'completed',
    counterpartyName: 'Cantina del Borgo',
    bottles: [
      { id: '6', name: 'Taurasi Radici Riserva', producer: 'Mastroberardino', vintage: 2015, quantity: 12, unitPrice: 95 },
    ],
    totalValue: 1140,
    createdAt: '2026-02-28T14:00:00Z',
    updatedAt: '2026-03-18T12:00:00Z',
    messageCount: 20,
  },
  {
    id: 'd6',
    type: 'sale',
    stage: 'negotiating',
    counterpartyName: 'Alessandro Conti',
    bottles: [
      { id: '7', name: 'Masseto', producer: 'Masseto', vintage: 2019, quantity: 2, unitPrice: 1050 },
    ],
    totalValue: 2100,
    createdAt: '2026-03-27T15:00:00Z',
    updatedAt: '2026-03-28T18:00:00Z',
    notes: 'Buyer is a restaurateur in Firenze',
    messageCount: 3,
  },
  {
    id: 'd7',
    type: 'sale',
    stage: 'accepted',
    counterpartyName: 'Ristorante Il Palagio',
    bottles: [
      { id: '8', name: 'Etna Rosso Prephylloxera', producer: 'Terre Nere', vintage: 2020, quantity: 6, unitPrice: 210 },
    ],
    totalValue: 1260,
    createdAt: '2026-03-22T10:00:00Z',
    updatedAt: '2026-03-27T11:00:00Z',
    messageCount: 7,
  },
  {
    id: 'd8',
    type: 'sale',
    stage: 'completed',
    counterpartyName: 'Wine Club Firenze',
    bottles: [
      { id: '9', name: 'Barolo Falletto Riserva', producer: 'Bruno Giacosa', vintage: 2014, quantity: 1, unitPrice: 780 },
    ],
    totalValue: 780,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-15T16:00:00Z',
    messageCount: 22,
  },
];

// ── Hook ───────────────────────────────────────────────

async function fetchDeals(): Promise<Deal[]> {
  await new Promise((r) => setTimeout(r, 350));
  return MOCK_DEALS;
}

export function useDeals(tab?: DealTab) {
  const storeTab = useAppStore((s) => s.ui.dealTab);
  const activeTab = tab ?? storeTab;

  return useQuery({
    queryKey: ['deals', activeTab],
    queryFn: fetchDeals,
    select: (data) =>
      data.filter((d) =>
        activeTab === 'acquisitions' ? d.type === 'acquisition' : d.type === 'sale'
      ),
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_DEALS.find((d) => d.id === id) ?? null;
    },
  });
}

export const STAGE_ORDER: DealStage[] = [
  'negotiating',
  'offered',
  'accepted',
  'pickup',
  'completed',
];

export const STAGE_LABELS: Record<DealStage, string> = {
  negotiating: 'Negotiating',
  offered: 'Offered',
  accepted: 'Accepted',
  pickup: 'Pickup',
  completed: 'Completed',
};
