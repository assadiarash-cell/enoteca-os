'use client';

import { useState } from 'react';
import {
  Wine,
  DollarSign,
  Clock,
  Package,
  Bell,
  TrendingUp,
  TrendingDown,
  Trophy,
  AlertCircle,
  Bot,
  CheckCircle,
  Plus,
  Sparkles,
  Send,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { AlertCard } from '@/components/dashboard/alert-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ── KPI data with icons & trends (Figma-style) ── */
const kpis = [
  { label: 'Bottiglie oggi', value: '23', delta: 12.5, icon: Wine },
  { label: 'Revenue MTD', value: '€148.200', delta: 8.3, icon: DollarSign },
  { label: 'Deal in attesa', value: '14', delta: -2.1, icon: Clock },
  { label: 'Valore inventario', value: '€2.4M', delta: 5.7, icon: Package },
];

/* ── Alerts with Figma-style accent colors & icons ── */
const alerts = [
  {
    icon: Trophy,
    title: 'Romanée-Conti 1998 — Offerta ricevuta',
    message: 'Buyer premium ha inviato offerta di €12.500. Scadenza risposta: 2 ore.',
    priority: 'critical' as const,
    accent: '#C9843A',
    timestamp: '10 min fa',
    actions: [{ label: 'Vedi offerta' }, { label: 'Rispondi' }],
  },
  {
    icon: AlertCircle,
    title: 'Nuove 8 bottiglie da valutare',
    message: 'Richiesta valutazione da cantina privata a Verona. Foto caricate.',
    priority: 'high' as const,
    accent: '#E5A832',
    timestamp: '32 min fa',
    actions: [{ label: 'Valuta ora' }],
  },
  {
    icon: Bot,
    title: 'Margine basso su Macallan 25',
    message: 'Il prezzo di mercato è sceso del 4%. Margine attuale: 8%. Considerare aggiornamento listino.',
    priority: 'medium' as const,
    accent: '#3B7FD9',
    timestamp: '1 ora fa',
    actions: [{ label: 'Aggiorna prezzo' }],
  },
  {
    icon: CheckCircle,
    title: 'Backup inventario completato',
    message: 'Export CSV e foto completato con successo. 1.847 bottiglie esportate.',
    priority: 'low' as const,
    accent: '#22C68A',
    timestamp: '3 ore fa',
  },
];

/* ── Activity feed with agent color dots (Figma-style) ── */
const activities = [
  { time: '14:32', agent: 'Pricing', color: '#C9843A', action: 'Aggiornato prezzo Château Margaux 2015' },
  { time: '13:18', agent: 'Scout', color: '#3B7FD9', action: 'Trovato Macallan 18yr sottovalutato' },
  { time: '12:45', agent: 'Valuation', color: '#22C68A', action: 'Completata analisi Barolo Riserva 1967' },
  { time: '11:30', agent: 'Outreach', color: '#E5A832', action: 'Contattati 3 nuovi venditori via WhatsApp' },
  { time: '10:15', agent: 'Inventory', color: '#8B1A32', action: 'Aggiunto Hennessy Paradis al magazzino 2' },
  { time: '09:40', agent: 'Pricing', color: '#C9843A', action: 'Report margini settimanale generato' },
];

/* ── Quick action definitions ── */
const quickActions = [
  { label: 'Nuova bottiglia', icon: Wine, accent: 'bg-accent-wine/10 text-accent-wine-light' },
  { label: 'Nuovo deal', icon: Send, accent: 'bg-accent-copper/10 text-accent-copper' },
  { label: 'Valutazione AI', icon: Sparkles, accent: 'bg-info/10 text-info' },
  { label: 'Report veloce', icon: BarChart3, accent: 'bg-success/10 text-success' },
];

export default function DashboardPage() {
  const [fabOpen, setFabOpen] = useState(false);

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
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Main content: Alerts (2/3) + Activity Feed (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title-3 text-text-primary flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent-copper" />
              Avvisi
            </h2>
            <button className="text-caption text-accent-copper hover:text-accent-gold transition-colors flex items-center gap-1">
              Vedi tutti <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Horizontal-scrollable alert cards on smaller screens, stacked on lg */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.title}
                  className="min-w-[320px] lg:min-w-0 snap-start rounded-lg border border-border-subtle bg-bg-secondary p-4 transition-all duration-200 hover:border-border-medium hover:bg-bg-tertiary group"
                  style={{ borderLeftWidth: 3, borderLeftColor: alert.accent }}
                >
                  <div className="flex gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${alert.accent}15` }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: alert.accent }} />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-body-sm font-medium text-text-primary leading-snug">
                          {alert.title}
                        </h4>
                        <span className="text-caption text-text-tertiary whitespace-nowrap shrink-0">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-caption text-text-secondary leading-relaxed">
                        {alert.message}
                      </p>
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {alert.actions.map((action) => (
                            <button
                              key={action.label}
                              className="text-caption font-medium px-2.5 py-1 rounded-md transition-colors"
                              style={{ color: alert.accent, backgroundColor: `${alert.accent}10` }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
              {activities.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 transition-colors hover:bg-bg-tertiary/50"
                >
                  {/* Agent color dot */}
                  <div className="mt-1.5 shrink-0">
                    <div
                      className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 2px ${item.color}30`,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-caption font-semibold uppercase tracking-wide"
                        style={{ color: item.color }}
                      >
                        {item.agent}
                      </span>
                      <span className="text-[10px] text-text-disabled">{item.time}</span>
                    </div>
                    <span className="text-body-sm text-text-secondary leading-snug">
                      {item.action}
                    </span>
                  </div>
                </div>
              ))}
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
