'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealCard } from '@/components/dashboard/deal-card';
import { cn } from '@/lib/utils';

type Tab = 'acquisitions' | 'sales';

const acquisitionColumns = [
  {
    title: 'Lead',
    deals: [
      { title: 'Cantina privata Verona — 12 bottiglie Barolo', sellerOrBuyer: 'Giovanni Bianchi', bottleCount: 12, value: 18000, type: 'acquisition' as const, daysInStage: 2 },
      { title: 'Eredità Milano — Collezione mista', sellerOrBuyer: 'Maria Conti', bottleCount: 35, value: 42000, type: 'acquisition' as const, daysInStage: 5 },
    ],
  },
  {
    title: 'Valutazione',
    deals: [
      { title: 'Ristorante Roma — Whisky premium', sellerOrBuyer: 'Trattoria Da Enzo', bottleCount: 8, value: 12500, type: 'acquisition' as const, daysInStage: 3 },
    ],
  },
  {
    title: 'Offerta',
    deals: [
      { title: 'Cantina Toscana — Sassicaia verticale', sellerOrBuyer: 'Paolo Rossi', bottleCount: 6, value: 28000, type: 'acquisition' as const, daysInStage: 1 },
      { title: 'Collezione Cognac — Lotto speciale', sellerOrBuyer: 'Henri Dupont', bottleCount: 4, value: 15000, type: 'acquisition' as const, daysInStage: 7 },
    ],
  },
  {
    title: 'Chiusura',
    deals: [
      { title: 'Rum collezione Jamaica', sellerOrBuyer: 'Carlo Verdi', bottleCount: 3, value: 9600, type: 'acquisition' as const, daysInStage: 1 },
    ],
  },
];

const salesColumns = [
  {
    title: 'Richiesta',
    deals: [
      { title: 'Romanée-Conti 1998 — Buyer premium', sellerOrBuyer: 'Alexander Schmidt', bottleCount: 1, value: 14500, type: 'sale' as const, daysInStage: 1 },
    ],
  },
  {
    title: 'Negoziazione',
    deals: [
      { title: 'Macallan 25yo + Highland Park 30', sellerOrBuyer: 'Tanaka Yuki', bottleCount: 2, value: 7000, type: 'sale' as const, daysInStage: 4 },
      { title: 'Lotto Bordeaux 2000-2005', sellerOrBuyer: 'James Williams', bottleCount: 6, value: 22000, type: 'sale' as const, daysInStage: 6 },
    ],
  },
  {
    title: 'Pagamento',
    deals: [
      { title: 'Petrus 2005', sellerOrBuyer: 'Chen Wei', bottleCount: 1, value: 8200, type: 'sale' as const, daysInStage: 2 },
    ],
  },
  {
    title: 'Spedizione',
    deals: [
      { title: 'Opus One 2018 + Sassicaia 2015', sellerOrBuyer: 'Robert Johnson', bottleCount: 2, value: 3200, type: 'sale' as const, daysInStage: 1 },
    ],
  },
];

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('acquisitions');
  const columns = activeTab === 'acquisitions' ? acquisitionColumns : salesColumns;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Deals</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Pipeline acquisizioni e vendite
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Nuovo deal
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-md border border-border-subtle bg-bg-secondary p-1 w-fit">
        <button
          onClick={() => setActiveTab('acquisitions')}
          className={cn(
            'rounded-md px-4 py-2 text-body-sm font-medium transition-all',
            activeTab === 'acquisitions'
              ? 'bg-accent-wine/10 text-accent-wine-light'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Acquisizioni
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={cn(
            'rounded-md px-4 py-2 text-body-sm font-medium transition-all',
            activeTab === 'sales'
              ? 'bg-accent-primary/10 text-accent-secondary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Vendite
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[60vh]">
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-overline uppercase text-text-tertiary tracking-wider">
                {column.title}
              </h3>
              <span className="text-caption text-text-disabled">
                {column.deals.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-bg-secondary/50 p-3 min-h-[200px]">
              {column.deals.map((deal, i) => (
                <DealCard key={i} {...deal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
