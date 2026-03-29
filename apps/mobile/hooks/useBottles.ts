import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';

// ── Types ──────────────────────────────────────────────

export interface Bottle {
  id: string;
  producer: string;
  name: string;
  vintage: number;
  region: string;
  denomination: string;
  photoUrl: string | null;
  purchasePrice: number;
  estimatedValue: number;
  margin: number;
  status: 'in_stock' | 'reserved' | 'sold';
  quantity: number;
  format: string;
  addedAt: string;
  authenticityScore: number;
  notes?: string;
}

// ── Mock Data ──────────────────────────────────────────

const MOCK_BOTTLES: Bottle[] = [
  {
    id: '1',
    producer: 'Giacomo Conterno',
    name: 'Barolo Monfortino Riserva',
    vintage: 2013,
    region: 'Piemonte',
    denomination: 'Barolo DOCG',
    photoUrl: null,
    purchasePrice: 850,
    estimatedValue: 1420,
    margin: 67.1,
    status: 'in_stock',
    quantity: 2,
    format: '750ml',
    addedAt: '2025-12-15T10:30:00Z',
    authenticityScore: 97,
    notes: 'Acquired from private cellar in Alba',
  },
  {
    id: '2',
    producer: 'Biondi-Santi',
    name: 'Brunello di Montalcino Riserva',
    vintage: 2010,
    region: 'Toscana',
    denomination: 'Brunello di Montalcino DOCG',
    photoUrl: null,
    purchasePrice: 620,
    estimatedValue: 980,
    margin: 58.1,
    status: 'in_stock',
    quantity: 3,
    format: '750ml',
    addedAt: '2025-11-22T14:00:00Z',
    authenticityScore: 94,
  },
  {
    id: '3',
    producer: 'Giuseppe Quintarelli',
    name: 'Amarone della Valpolicella Classico',
    vintage: 2012,
    region: 'Veneto',
    denomination: 'Amarone DOCG',
    photoUrl: null,
    purchasePrice: 480,
    estimatedValue: 720,
    margin: 50.0,
    status: 'reserved',
    quantity: 1,
    format: '750ml',
    addedAt: '2025-10-05T09:15:00Z',
    authenticityScore: 92,
    notes: 'Reserved for collector in Milano',
  },
  {
    id: '4',
    producer: 'Bruno Giacosa',
    name: 'Barolo Falletto Vigna Le Rocche Riserva',
    vintage: 2016,
    region: 'Piemonte',
    denomination: 'Barolo DOCG',
    photoUrl: null,
    purchasePrice: 520,
    estimatedValue: 890,
    margin: 71.2,
    status: 'in_stock',
    quantity: 6,
    format: '750ml',
    addedAt: '2026-01-10T11:00:00Z',
    authenticityScore: 98,
  },
  {
    id: '5',
    producer: 'Masseto',
    name: 'Masseto',
    vintage: 2019,
    region: 'Toscana',
    denomination: 'Toscana IGT',
    photoUrl: null,
    purchasePrice: 680,
    estimatedValue: 1050,
    margin: 54.4,
    status: 'in_stock',
    quantity: 4,
    format: '750ml',
    addedAt: '2026-02-18T16:30:00Z',
    authenticityScore: 96,
  },
  {
    id: '6',
    producer: 'Mastroberardino',
    name: 'Taurasi Radici Riserva',
    vintage: 2015,
    region: 'Campania',
    denomination: 'Taurasi DOCG',
    photoUrl: null,
    purchasePrice: 95,
    estimatedValue: 165,
    margin: 73.7,
    status: 'in_stock',
    quantity: 12,
    format: '750ml',
    addedAt: '2026-03-01T08:45:00Z',
    authenticityScore: 89,
  },
  {
    id: '7',
    producer: 'Tenuta delle Terre Nere',
    name: 'Etna Rosso Prephylloxera',
    vintage: 2020,
    region: 'Sicilia',
    denomination: 'Etna DOC',
    photoUrl: null,
    purchasePrice: 140,
    estimatedValue: 210,
    margin: 50.0,
    status: 'sold',
    quantity: 0,
    format: '750ml',
    addedAt: '2025-09-12T13:20:00Z',
    authenticityScore: 91,
  },
  {
    id: '8',
    producer: 'Antiche Bottiglie',
    name: 'Barbaresco Santo Stefano Riserva',
    vintage: 2008,
    region: 'Piemonte',
    denomination: 'Barbaresco DOCG',
    photoUrl: null,
    purchasePrice: 360,
    estimatedValue: 580,
    margin: 61.1,
    status: 'in_stock',
    quantity: 2,
    format: '1500ml',
    addedAt: '2026-03-20T10:00:00Z',
    authenticityScore: 88,
    notes: 'Magnum format — excellent provenance',
  },
];

// ── Hook ───────────────────────────────────────────────

async function fetchBottles(): Promise<Bottle[]> {
  // In production this would call supabase; for now return mock data.
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_BOTTLES;
}

export function useBottles() {
  const filters = useAppStore((s) => s.bottleFilters);

  return useQuery({
    queryKey: ['bottles', filters],
    queryFn: fetchBottles,
    select: (data) => {
      let result = [...data];

      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.producer.toLowerCase().includes(q) ||
            b.denomination.toLowerCase().includes(q)
        );
      }

      // Region
      if (filters.region !== 'all') {
        result = result.filter(
          (b) => b.region.toLowerCase() === filters.region
        );
      }

      // Status
      if (filters.status !== 'all') {
        result = result.filter((b) => b.status === filters.status);
      }

      // Sort
      result.sort((a, b) => {
        let cmp = 0;
        switch (filters.sort) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'vintage':
            cmp = a.vintage - b.vintage;
            break;
          case 'price':
            cmp = a.estimatedValue - b.estimatedValue;
            break;
          case 'margin':
            cmp = a.margin - b.margin;
            break;
          case 'addedAt':
          default:
            cmp = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        }
        return filters.sortDesc ? -cmp : cmp;
      });

      return result;
    },
  });
}

export function useBottle(id: string) {
  return useQuery({
    queryKey: ['bottle', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_BOTTLES.find((b) => b.id === id) ?? null;
    },
  });
}
