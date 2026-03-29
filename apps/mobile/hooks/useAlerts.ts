import { useQuery } from '@tanstack/react-query';

// ── Types ──────────────────────────────────────────────

export type AlertPriority = 'high' | 'medium' | 'low';
export type AlertCategory = 'price' | 'deal' | 'auth' | 'inventory' | 'market';

export interface Alert {
  id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  category: AlertCategory;
  read: boolean;
  createdAt: string;
  actionLabel?: string;
  actionRoute?: string;
}

// ── Mock Data ──────────────────────────────────────────

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Price Spike Detected',
    message: 'Barolo Monfortino 2013 up 12% on secondary market in the last 48h.',
    priority: 'high',
    category: 'price',
    read: false,
    createdAt: '2026-03-29T08:00:00Z',
    actionLabel: 'View Bottle',
    actionRoute: '/bottles/1',
  },
  {
    id: 'a2',
    title: 'Deal Update',
    message: 'Famiglia Rossi accepted your offer on the Biondi-Santi lot.',
    priority: 'high',
    category: 'deal',
    read: false,
    createdAt: '2026-03-28T16:30:00Z',
    actionLabel: 'View Deal',
    actionRoute: '/deals/d2',
  },
  {
    id: 'a3',
    title: 'Authenticity Flag',
    message: 'AI flagged Amarone 2012 capsule anomaly — manual review recommended.',
    priority: 'medium',
    category: 'auth',
    read: false,
    createdAt: '2026-03-28T11:15:00Z',
    actionLabel: 'Review',
    actionRoute: '/bottles/3',
  },
  {
    id: 'a4',
    title: 'Low Stock Alert',
    message: 'Masseto 2019 inventory below threshold (4 remaining, min 6).',
    priority: 'medium',
    category: 'inventory',
    read: true,
    createdAt: '2026-03-27T09:00:00Z',
    actionLabel: 'View Bottle',
    actionRoute: '/bottles/5',
  },
  {
    id: 'a5',
    title: 'Market Insight',
    message: 'Etna DOC wines trending +8% among collectors in Northern Europe.',
    priority: 'low',
    category: 'market',
    read: true,
    createdAt: '2026-03-26T14:00:00Z',
  },
  {
    id: 'a6',
    title: 'Pickup Reminder',
    message: 'Scheduled pickup from Luigi Ferrero in Verona tomorrow at 10:00.',
    priority: 'high',
    category: 'deal',
    read: false,
    createdAt: '2026-03-29T07:00:00Z',
    actionLabel: 'View Deal',
    actionRoute: '/deals/d4',
  },
];

// ── Hook ───────────────────────────────────────────────

async function fetchAlerts(): Promise<Alert[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_ALERTS;
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 30_000, // Poll every 30s (realtime via Supabase in production)
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
  });
}

export function useUnreadAlertCount() {
  const { data } = useAlerts();
  return data?.filter((a) => !a.read).length ?? 0;
}
