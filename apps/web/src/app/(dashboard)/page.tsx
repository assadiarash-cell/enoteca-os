import { Wine, DollarSign, Clock, Package } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { AlertCard } from '@/components/dashboard/alert-card';
import { Badge } from '@/components/ui/badge';

const kpis = [
  { label: 'Bottiglie oggi', value: '23', delta: 12.5, icon: Wine },
  { label: 'Revenue MTD', value: '€148.200', delta: 8.3, icon: DollarSign },
  { label: 'Deal in attesa', value: '14', delta: -2.1, icon: Clock },
  { label: 'Valore inventario', value: '€2.4M', delta: 5.7, icon: Package },
];

const alerts = [
  {
    title: 'Romanée-Conti 1998 — Offerta ricevuta',
    message: 'Buyer premium ha inviato offerta di €12.500. Scadenza risposta: 2 ore.',
    priority: 'critical' as const,
    timestamp: '10 min fa',
    actions: [{ label: 'Vedi offerta' }, { label: 'Rispondi' }],
  },
  {
    title: 'Nuove 8 bottiglie da valutare',
    message: 'Richiesta valutazione da cantina privata a Verona. Foto caricate.',
    priority: 'high' as const,
    timestamp: '32 min fa',
    actions: [{ label: 'Valuta ora' }],
  },
  {
    title: 'Margine basso su Macallan 25',
    message: 'Il prezzo di mercato è sceso del 4%. Margine attuale: 8%. Considerare aggiornamento listino.',
    priority: 'medium' as const,
    timestamp: '1 ora fa',
    actions: [{ label: 'Aggiorna prezzo' }],
  },
  {
    title: 'Backup inventario completato',
    message: 'Export CSV e foto completato con successo. 1.847 bottiglie esportate.',
    priority: 'low' as const,
    timestamp: '3 ore fa',
  },
];

const activityFeed = [
  { action: 'Vendita completata', detail: 'Petrus 2005 — €8.200', time: '5 min fa', type: 'success' as const },
  { action: 'Nuova acquisizione', detail: 'Lotto 12 bottiglie Barolo', time: '22 min fa', type: 'premium' as const },
  { action: 'Valutazione AI completata', detail: 'Sassicaia 1985 — €4.500-5.200', time: '45 min fa', type: 'info' as const },
  { action: 'Contatto buyer', detail: 'Richiesta info su Cognac Hennessy XO', time: '1 ora fa', type: 'neutral' as const },
  { action: 'Prezzo aggiornato', detail: 'Opus One 2018 — +€200', time: '2 ore fa', type: 'warning' as const },
  { action: 'Deal chiuso', detail: 'Whisky Highland Park 30yo — €3.800', time: '3 ore fa', type: 'success' as const },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Dashboard</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Buongiorno, Marco. Ecco il riepilogo di oggi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">Sistema operativo</Badge>
          <span className="text-caption text-text-tertiary">
            Ultimo aggiornamento: 2 min fa
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-title-3 text-text-primary">Avvisi</h2>
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.title} {...alert} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex flex-col gap-4">
          <h2 className="text-title-3 text-text-primary">Attività recente</h2>
          <div className="rounded-md border border-border-subtle bg-bg-secondary">
            <div className="flex flex-col divide-y divide-border-subtle">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <div className="mt-1">
                    <Badge variant={item.type} className="text-[10px] px-1.5 py-0">
                      &bull;
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-body-sm text-text-primary">
                      {item.action}
                    </span>
                    <span className="text-caption text-text-secondary truncate">
                      {item.detail}
                    </span>
                  </div>
                  <span className="text-caption text-text-tertiary whitespace-nowrap shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4">
        <h2 className="text-title-3 text-text-primary">Azioni rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Nuova bottiglia', icon: '🍷' },
            { label: 'Nuovo deal', icon: '🤝' },
            { label: 'Valutazione AI', icon: '🤖' },
            { label: 'Report veloce', icon: '📊' },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-secondary p-4 text-body-sm text-text-secondary hover:text-text-primary hover:border-border-medium hover:bg-bg-tertiary transition-all"
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
