'use client';

import { useState } from 'react';
import { Search, LayoutGrid, List, Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottleCard } from '@/components/dashboard/bottle-card';
import { cn } from '@/lib/utils';

const filters = [
  { id: 'all', label: 'Tutte' },
  { id: 'wine', label: 'Vino' },
  { id: 'whisky', label: 'Whisky' },
  { id: 'cognac', label: 'Cognac' },
  { id: 'rum', label: 'Rum' },
  { id: 'listed', label: 'In vendita' },
  { id: 'acquired', label: 'Acquisite' },
  { id: 'pending', label: 'In attesa' },
];

const bottles = [
  { name: 'Romanée-Conti', vintage: '1998', category: 'Vino', region: 'Borgogna', price: 14500, margin: 22, status: 'listed' as const },
  { name: 'Petrus', vintage: '2005', category: 'Vino', region: 'Pomerol', price: 8200, margin: 18, status: 'listed' as const },
  { name: 'Macallan 25 Year', vintage: undefined, category: 'Whisky', region: 'Speyside', price: 3200, margin: 8, status: 'acquired' as const },
  { name: 'Sassicaia', vintage: '1985', category: 'Vino', region: 'Bolgheri', price: 4800, margin: 25, status: 'pending' as const },
  { name: 'Opus One', vintage: '2018', category: 'Vino', region: 'Napa Valley', price: 1200, margin: 15, status: 'listed' as const },
  { name: 'Highland Park 30yo', vintage: undefined, category: 'Whisky', region: 'Orkney', price: 3800, margin: 20, status: 'acquired' as const },
  { name: 'Rémy Martin Louis XIII', vintage: undefined, category: 'Cognac', region: 'Cognac', price: 5600, margin: 12, status: 'listed' as const },
  { name: 'Barolo Monfortino', vintage: '2010', category: 'Vino', region: 'Piemonte', price: 2400, margin: 30, status: 'acquired' as const },
  { name: 'Appleton Estate 50yo', vintage: undefined, category: 'Rum', region: 'Jamaica', price: 7200, margin: 16, status: 'pending' as const },
  { name: 'Château Margaux', vintage: '2000', category: 'Vino', region: 'Bordeaux', price: 3500, margin: 19, status: 'listed' as const },
  { name: 'Yamazaki 18', vintage: undefined, category: 'Whisky', region: 'Japan', price: 1800, margin: 14, status: 'acquired' as const },
  { name: 'Hennessy Paradis', vintage: undefined, category: 'Cognac', region: 'Cognac', price: 2200, margin: 11, status: 'listed' as const },
];

export default function BottlesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  const filtered = bottles.filter((b) => {
    if (activeFilter === 'all') return true;
    if (['wine', 'whisky', 'cognac', 'rum'].includes(activeFilter)) {
      const categoryMap: Record<string, string> = { wine: 'Vino', whisky: 'Whisky', cognac: 'Cognac', rum: 'Rum' };
      return b.category === categoryMap[activeFilter];
    }
    return b.status === activeFilter;
  }).filter((b) => {
    if (!search) return true;
    return b.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Bottiglie</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {bottles.length} bottiglie in inventario
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Aggiungi bottiglia
        </Button>
      </div>

      {/* Search & filters bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Cerca bottiglie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border-medium bg-bg-tertiary pl-10 pr-4 text-body-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 transition-colors"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="flex items-center rounded-md border border-border-medium overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                viewMode === 'list' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                viewMode === 'grid' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-caption font-medium transition-all',
                activeFilter === filter.id
                  ? 'bg-accent-primary/10 text-accent-secondary border border-accent-primary/20'
                  : 'text-text-secondary border border-border-medium hover:border-border-strong hover:text-text-primary'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottle list */}
      <div className={cn(
        viewMode === 'list'
          ? 'flex flex-col gap-2'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
      )}>
        {filtered.map((bottle, i) => (
          <BottleCard key={`${bottle.name}-${i}`} {...bottle} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-body-lg text-text-secondary">Nessuna bottiglia trovata</p>
          <p className="text-body-sm text-text-tertiary mt-1">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  );
}
