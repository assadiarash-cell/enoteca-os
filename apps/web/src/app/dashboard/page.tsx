'use client';

import { useState, useEffect } from 'react';
import {
  Wine,
  DollarSign,
  Clock,
  Package,
  Bell,
  Trophy,
  AlertCircle,
  AlertTriangle,
  TrendingDown,
  Bot,
  CheckCircle,
  Plus,
  Sparkles,
  Send,
  BarChart3,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { cn } from '@/lib/utils';
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

/* ── Quick action definitions ── */
const quickActions = [
  { label: 'Nuova bottiglia', icon: Wine, accent: 'bg-accent-wine/10 text-accent-wine-light' },
  { label: 'Nuovo deal', icon: Send, accent: 'bg-accent-copper/10 text-accent-copper' },
  { label: 'Valutazione AI', icon: Sparkles, accent: 'bg-info/10 text-info' },
  { label: 'Report veloce', icon: BarChart3, accent: 'bg-success/10 text-success' },
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
  if (mins < 1) return 'adesso';
  if (mins < 60) return `${mins} min fa`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ${hrs === 1 ? 'ora' : 'ore'} fa`;
  const days = Math.floor(hrs / 24);
  return `${days} ${days === 1 ? 'giorno' : 'giorni'} fa`;
}

/* ── Skeleton loaders ── */
function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-secondary p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-bg-tertiary" />
        <div className="h-8 w-8 rounded-md bg-bg-tertiary" />
      </div>
      <div className="h-8 w-24 rounded bg-bg-tertiary" />
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-secondary p-4 animate-pulse" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--border-subtle)' }}>
      <div className="flex gap-3">
        <div className="h-9 w-9 rounded-lg bg-bg-tertiary shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-4 w-3/4 rounded bg-bg-tertiary" />
          <div className="h-3 w-full rounded bg-bg-tertiary" />
          <div className="h-3 w-1/2 rounded bg-bg-tertiary" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [fabOpen, setFabOpen] = useState(false);

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

  const kpis = [
    { label: 'Bottiglie oggi', value: String(bottleCount), icon: Wine },
    { label: 'Revenue MTD', value: formatCurrency(revenueMtd), icon: DollarSign },
    { label: 'Deal in attesa', value: String(dealsInAttesa), icon: Clock },
    { label: 'Valore inventario', value: formatCurrency(inventoryValue), icon: Package },
  ];

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
        <AlertCircle className="h-12 w-12 text-semantic-danger" />
        <h2 className="text-title-3 text-text-primary">Errore</h2>
        <p className="text-body-sm text-text-secondary max-w-md text-center">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
          className="text-body-sm font-medium text-accent-copper hover:text-accent-gold transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Dashboard</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Buongiorno, Marco. Ecco il riepilogo di oggi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-caption font-medium text-success">Sistema operativo</span>
          </div>
          <span className="text-caption text-text-tertiary">
            Ultimo aggiornamento: 2 min fa
          </span>
        </div>
      </div>

      {/* ── KPI Grid (4 columns) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)
        }
      </div>

      {/* ── Main content: Alerts (2/3) + Activity Feed (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title-3 text-text-primary flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent-copper" />
              Avvisi
              {!loading && alerts.length > 0 && (
                <span className="text-caption font-medium text-text-tertiary">({alerts.length})</span>
              )}
            </h2>
            <button className="text-caption text-accent-copper hover:text-accent-gold transition-colors flex items-center gap-1">
              Vedi tutti <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Horizontal-scrollable alert cards on smaller screens, stacked on lg */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <AlertSkeleton key={i} />)
            ) : alerts.length === 0 ? (
              <div className="rounded-lg border border-border-subtle bg-bg-secondary p-6 text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-body-sm text-text-secondary">Nessun avviso</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const config = alertTypeConfig[alert.alert_type];
                const Icon = config?.icon ?? AlertCircle;
                const accent = config?.accent ?? priorityAccent[alert.priority] ?? '#3B7FD9';

                return (
                  <div
                    key={alert.id}
                    className="min-w-[320px] lg:min-w-0 snap-start rounded-lg border border-border-subtle bg-bg-secondary p-4 transition-all duration-200 hover:border-border-medium hover:bg-bg-tertiary group"
                    style={{ borderLeftWidth: 3, borderLeftColor: accent }}
                  >
                    <div className="flex gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${accent}15` }}
                      >
                        <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
                      </div>
                      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-body-sm font-medium text-text-primary leading-snug">
                            {alert.title}
                          </h4>
                          <span className="text-caption text-text-tertiary whitespace-nowrap shrink-0">
                            {timeAgo(alert.created_at)}
                          </span>
                        </div>
                        <p className="text-caption text-text-secondary leading-relaxed">
                          {alert.message}
                        </p>
                        {alert.action_url && (
                          <div className="flex gap-2 mt-1">
                            <button
                              className="text-caption font-medium px-2.5 py-1 rounded-md transition-colors"
                              style={{ color: accent, backgroundColor: `${accent}10` }}
                            >
                              Vedi dettagli
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Feed column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title-3 text-text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-gold" />
              Agent Activity
            </h2>
            <span className="text-caption text-text-tertiary">Oggi</span>
          </div>
          <div className="rounded-lg border border-border-subtle bg-bg-secondary overflow-hidden">
            <div className="flex flex-col divide-y divide-border-subtle">
              {loading ? (
                <div className="flex items-center justify-center gap-2 p-8">
                  <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
                  <span className="text-body-sm text-text-secondary">Caricamento...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <span className="text-body-sm text-text-tertiary">Nessuna attività</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions (desktop grid) ── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-title-3 text-text-primary">Azioni rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="group flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-secondary p-4 text-body-sm text-text-secondary hover:text-text-primary hover:border-border-medium hover:bg-bg-tertiary transition-all duration-200 hover-lift"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', action.accent)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAB (Floating Action Button) - desktop adaptation ── */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Expanded menu */}
          {fabOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-slide-up">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="flex items-center gap-3 rounded-lg bg-bg-tertiary border border-border-medium px-4 py-3 text-body-sm text-text-primary shadow-lg hover:bg-bg-quaternary transition-all whitespace-nowrap"
                    onClick={() => setFabOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-accent-copper" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
          {/* FAB button */}
          <button
            onClick={() => setFabOpen(!fabOpen)}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full bg-copper-gradient text-bg-primary shadow-lg shadow-accent-copper/25 transition-all duration-300 hover:shadow-accent-copper/40 hover:scale-105',
              fabOpen && 'rotate-45'
            )}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
