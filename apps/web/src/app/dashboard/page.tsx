'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Trophy,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bot,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';

/* ── Types ── */
interface Bottle {
  id: string;
  status: string;
  purchase_price: number | null;
  target_sell_price: number | null;
  market_price_high: number | null;
}

interface Alert {
  id: string;
  alert_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface Acquisition {
  id: string;
  status: string;
  total_bottles: number | null;
  total_offer: number | null;
  total_final: number | null;
}

interface Sale {
  id: string;
  status: string;
  total_amount: number | null;
  margin_amount: number | null;
  margin_percent: number | null;
}

/* ── Alert type → icon & accent color mapping ── */
const alertTypeConfig: Record<string, { icon: typeof Trophy; accent: string }> = {
  trophy_bottle:      { icon: Trophy,        accent: '#C9843A' },
  stagnant_inventory: { icon: AlertTriangle, accent: '#E5A832' },
  price_change:       { icon: TrendingDown,  accent: '#3B7FD9' },
  new_lead:           { icon: Bot,           accent: '#22C68A' },
  deal_pending:       { icon: Clock,         accent: '#E5A832' },
  authenticity_flag:  { icon: AlertCircle,   accent: '#DC2626' },
};

const priorityAccent: Record<string, string> = {
  critical: '#C9843A',
  high:     '#E5A832',
  medium:   '#3B7FD9',
  low:      '#22C68A',
};

/* ── Placeholder activities (no endpoint yet) ── */
const activities = [
  {
    time: '14:32',
    agent: 'Pricing',
    color: '#C9843A',
    action: 'Updated pricing for Château Margaux 2015',
    bottle: null,
  },
  {
    time: '13:18',
    agent: 'Scout',
    color: '#3B7FD9',
    action: 'Found undervalued Macallan 18yr on marketplace',
    bottle: null,
  },
  {
    time: '12:45',
    agent: 'Valuation',
    color: '#22C68A',
    action: 'Completed analysis for Barolo Riserva 1967',
    bottle: null,
  },
  {
    time: '11:30',
    agent: 'Outreach',
    color: '#E5A832',
    action: 'Contacted 3 new potential sellers via WhatsApp',
    bottle: null,
  },
  {
    time: '10:15',
    agent: 'Inventory',
    color: '#8B1A32',
    action: 'Added Hennessy Paradis to warehouse 2',
    bottle: null,
  },
];

/* ── Helpers ── */
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(1)}K`.replace('.0K', 'K');
  return `€${value.toFixed(0)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── Skeleton loaders ── */
function KpiSkeleton() {
  return (
    <div className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] animate-pulse">
      <div className="h-3 w-20 rounded bg-[#14141F] mb-3" />
      <div className="h-7 w-16 rounded bg-[#14141F]" />
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div
      className="bg-[#14141F] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] w-[248px] flex-shrink-0 animate-pulse"
      style={{ borderLeftWidth: 3, borderLeftColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#0D0D15] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-[#0D0D15]" />
          <div className="h-3 w-full rounded bg-[#0D0D15]" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [showFAB, setShowFAB] = useState(false);

  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orgId = DEMO_ORG_ID;
    let cancelled = false;

    async function fetchAll() {
      try {
        const [bottlesRes, alertsRes, salesRes, acqRes] = await Promise.all([
          fetch(`/api/bottles?org_id=${orgId}`),
          fetch(`/api/alerts?org_id=${orgId}`),
          fetch(`/api/sales?org_id=${orgId}`),
          fetch(`/api/acquisitions?org_id=${orgId}`),
        ]);

        if (!bottlesRes.ok || !alertsRes.ok || !salesRes.ok || !acqRes.ok) {
          throw new Error('Errore nel caricamento dei dati');
        }

        const [bottlesJson, alertsJson, salesJson, acqJson] = await Promise.all([
          bottlesRes.json(),
          alertsRes.json(),
          salesRes.json(),
          acqRes.json(),
        ]);

        if (cancelled) return;

        setBottles(bottlesJson.data ?? []);
        setAlerts(alertsJson.data ?? []);
        setSales(salesJson.data ?? []);
        setAcquisitions(acqJson.data ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /* ── Compute KPIs ── */
  const bottleCount = bottles.filter(
    (b) => b.status !== 'sold' && b.status !== 'rejected'
  ).length;

  const revenueMtd = sales
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + (s.total_amount ?? 0), 0);

  const dealsInAttesa =
    acquisitions.filter((a) => a.status === 'negotiating').length +
    sales.filter((s) => s.status === 'negotiating').length;

  const inventoryStatuses = new Set(['in_inventory', 'listed', 'valued', 'acquired']);
  const inventoryValue = bottles
    .filter((b) => inventoryStatuses.has(b.status))
    .reduce((sum, b) => sum + (b.target_sell_price ?? b.market_price_high ?? 0), 0);

  const unreadAlertCount = alerts.filter((a) => !a.is_read).length;

  const kpis = [
    { label: 'Bottles today', value: String(bottleCount), delta: null as string | null, positive: true, warning: false },
    { label: 'Revenue MTD', value: formatCurrency(revenueMtd), delta: null, positive: true, warning: false },
    { label: 'Pending deals', value: String(dealsInAttesa), delta: null, positive: false, warning: dealsInAttesa > 0 },
    { label: 'Inventory value', value: formatCurrency(inventoryValue), delta: null, positive: true, warning: false },
  ];

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#07070D] flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-12 w-12 text-[#DC4545]" />
        <h2 className="text-[18px] font-semibold text-[#EEECE7]">Errore</h2>
        <p className="text-[14px] text-[#A09E96] max-w-md text-center">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
          className="text-[14px] font-medium text-[#C9843A] hover:text-[#D4A05A] transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070D] pb-24 overflow-x-hidden">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9843A]/10 border border-[#C9843A]/20 flex items-center justify-center">
              <span className="text-[12px] font-bold text-[#C9843A]">EO</span>
            </div>
            <div>
              <p className="text-[11px] text-[#6B6963]">Good morning</p>
              <p className="text-[14px] font-semibold text-[#EEECE7]">Emanuele</p>
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-[#0D0D15] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[#14141F] transition-colors">
            <Bell className="w-5 h-5 text-[#A09E96]" strokeWidth={1.5} />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC4545] rounded-full border border-[#07070D]" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto py-6 space-y-6">
        {/* KPIs */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
              : kpis.map((kpi, i) => (
                  <div key={i} className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
                    <p className="text-overline text-[#6B6963] mb-2 whitespace-nowrap">{kpi.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-[24px] font-bold ${kpi.warning ? 'text-[#E5A832]' : 'text-[#EEECE7]'} font-mono truncate`}>
                        {kpi.value}
                      </p>
                      {kpi.delta && (
                        <span className={`text-[12px] font-medium flex items-center gap-0.5 ${
                          kpi.positive ? 'text-[#22C68A]' : 'text-[#DC4545]'
                        }`}>
                          {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {kpi.delta}
                        </span>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4">
          <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-3">Alerts</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 pl-4 pr-4 scrollbar-hide -mt-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <AlertSkeleton key={i} />)
          ) : alerts.length === 0 ? (
            <div className="bg-[#14141F] rounded-xl p-6 border border-[rgba(255,255,255,0.06)] w-full text-center">
              <CheckCircle className="h-8 w-8 text-[#22C68A] mx-auto mb-2" />
              <p className="text-[13px] text-[#A09E96]">Nessun avviso</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const config = alertTypeConfig[alert.alert_type];
              const Icon = config?.icon ?? AlertCircle;
              const accent = config?.accent ?? priorityAccent[alert.priority] ?? '#3B7FD9';

              return (
                <div
                  key={alert.id}
                  className="bg-[#14141F] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] w-[248px] flex-shrink-0 overflow-hidden"
                  style={{ borderLeftColor: accent, borderLeftWidth: '3px' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[14px] font-semibold text-[#EEECE7] truncate">{alert.title}</h4>
                        <span className="text-[11px] text-[#6B6963] font-mono flex-shrink-0 ml-2">
                          {timeAgo(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#A09E96] truncate">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Activity Feed */}
        <div className="px-4">
          <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-4 w-4 animate-spin text-[#6B6963]" />
                <span className="text-[13px] text-[#A09E96]">Caricamento...</span>
              </div>
            ) : (
              activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-mono text-[#6B6963] w-10 flex-shrink-0">
                    {activity.time}
                  </span>
                  <div className="flex-1 min-w-0 bg-[#0D0D15] rounded-xl p-3 border border-[rgba(255,255,255,0.06)] flex items-center gap-2 overflow-hidden">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-medium block" style={{ color: activity.color }}>
                        {activity.agent}
                      </span>
                      <p className="text-[13px] text-[#A09E96] truncate">{activity.action}</p>
                    </div>
                    {activity.bottle && (
                      <img
                        src={activity.bottle}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowFAB(!showFAB)}
        className="fixed bottom-28 right-4 w-14 h-14 bg-[#C9843A] hover:bg-[#D4A05A] rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 z-30"
      >
        <Plus className={`w-6 h-6 text-[#07070D] transition-transform ${showFAB ? 'rotate-45' : ''}`} strokeWidth={2} />
      </button>

      {showFAB && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setShowFAB(false)}
          />
          <div className="fixed bottom-44 right-4 z-30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#EEECE7] bg-[#0D0D15] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.06)]">
                Scan Bottle
              </span>
              <div className="w-12 h-12 bg-[#14141F] hover:bg-[#1C1C2A] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-all cursor-pointer">
                <span className="text-[20px]">📸</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#EEECE7] bg-[#0D0D15] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.06)]">
                New Seller
              </span>
              <div className="w-12 h-12 bg-[#14141F] hover:bg-[#1C1C2A] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-all cursor-pointer">
                <span className="text-[20px]">👤</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#EEECE7] bg-[#0D0D15] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.06)]">
                New Listing
              </span>
              <div className="w-12 h-12 bg-[#14141F] hover:bg-[#1C1C2A] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-all cursor-pointer">
                <span className="text-[20px]">🏷️</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#EEECE7] bg-[#0D0D15] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.06)]">
                Manual Entry
              </span>
              <div className="w-12 h-12 bg-[#14141F] hover:bg-[#1C1C2A] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.06)] transition-all cursor-pointer">
                <span className="text-[20px]">✍️</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
