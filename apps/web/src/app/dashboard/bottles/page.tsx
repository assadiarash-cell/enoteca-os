'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  SlidersHorizontal,
  Wine,
  GlassWater,
  Martini,
  Flame,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';

/* ── Filter chips ── */
const filters = [
  { id: 'all', label: 'Tutte', count: 12 },
  { id: 'wine', label: 'Vino', count: 6 },
  { id: 'whisky', label: 'Whisky', count: 3 },
  { id: 'cognac', label: 'Cognac', count: 2 },
  { id: 'rum', label: 'Rum', count: 1 },
  { id: 'listed', label: 'In vendita', count: 6 },
  { id: 'acquired', label: 'Acquisite', count: 4 },
  { id: 'pending', label: 'In attesa', count: 2 },
];

/* ── Category icon map ── */
const categoryIcon: Record<string, typeof Wine> = {
  Vino: Wine,
  Whisky: GlassWater,
  Cognac: Martini,
  Rum: Flame,
};

/* ── Status badge config ── */
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  listed: { label: 'In vendita', bg: 'bg-accent-copper/10', text: 'text-accent-copper', dot: 'bg-accent-copper' },
  acquired: { label: 'Acquisita', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  pending: { label: 'In attesa', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  sold: { label: 'Venduta', bg: 'bg-text-tertiary/10', text: 'text-text-tertiary', dot: 'bg-text-tertiary' },
};

/* ── Bottle data ── */
const bottles = [
  { id: 'romanee-conti-1998', name: 'Romanée-Conti', producer: 'Domaine de la Romanée-Conti', vintage: '1998', category: 'Vino', region: 'Borgogna', price: 14500, margin: 22, status: 'listed' as const },
  { id: 'petrus-2005', name: 'Petrus', producer: 'Château Pétrus', vintage: '2005', category: 'Vino', region: 'Pomerol', price: 8200, margin: 18, status: 'listed' as const },
  { id: 'macallan-25', name: 'Macallan 25 Year', producer: 'The Macallan', vintage: undefined, category: 'Whisky', region: 'Speyside', price: 3200, margin: 8, status: 'acquired' as const },
  { id: 'sassicaia-1985', name: 'Sassicaia', producer: 'Tenuta San Guido', vintage: '1985', category: 'Vino', region: 'Bolgheri', price: 4800, margin: 25, status: 'pending' as const },
  { id: 'opus-one-2018', name: 'Opus One', producer: 'Opus One Winery', vintage: '2018', category: 'Vino', region: 'Napa Valley', price: 1200, margin: 15, status: 'listed' as const },
  { id: 'highland-park-30', name: 'Highland Park 30yo', producer: 'Highland Park', vintage: undefined, category: 'Whisky', region: 'Orkney', price: 3800, margin: 20, status: 'acquired' as const },
  { id: 'remy-martin-louis-xiii', name: 'Rémy Martin Louis XIII', producer: 'Rémy Martin', vintage: undefined, category: 'Cognac', region: 'Cognac', price: 5600, margin: 12, status: 'listed' as const },
  { id: 'barolo-monfortino-2010', name: 'Barolo Monfortino', producer: 'Giacomo Conterno', vintage: '2010', category: 'Vino', region: 'Piemonte', price: 2400, margin: 30, status: 'acquired' as const },
  { id: 'appleton-50', name: 'Appleton Estate 50yo', producer: 'Appleton Estate', vintage: undefined, category: 'Rum', region: 'Jamaica', price: 7200, margin: 16, status: 'pending' as const },
  { id: 'chateau-margaux-2000', name: 'Château Margaux', producer: 'Château Margaux', vintage: '2000', category: 'Vino', region: 'Bordeaux', price: 3500, margin: 19, status: 'listed' as const },
  { id: 'yamazaki-18', name: 'Yamazaki 18', producer: 'Suntory', vintage: undefined, category: 'Whisky', region: 'Japan', price: 1800, margin: 14, status: 'acquired' as const },
  { id: 'hennessy-paradis', name: 'Hennessy Paradis', producer: 'Hennessy', vintage: undefined, category: 'Cognac', region: 'Cognac', price: 2200, margin: 11, status: 'listed' as const },
];

export default function BottlesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'margin'>('price');

  const filtered = bottles
    .filter((b) => {
      if (activeFilter === 'all') return true;
      if (['wine', 'whisky', 'cognac', 'rum'].includes(activeFilter)) {
        const categoryMap: Record<string, string> = { wine: 'Vino', whisky: 'Whisky', cognac: 'Cognac', rum: 'Rum' };
        return b.category === categoryMap[activeFilter];
      }
      return b.status === activeFilter;
    })
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.producer.toLowerCase().includes(q) || b.region.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'margin') return b.margin - a.margin;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Bottiglie</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {bottles.length} bottiglie in inventario &middot; valore totale{' '}
            <span className="text-accent-copper font-medium">
              {formatCurrency(bottles.reduce((sum, b) => sum + b.price, 0))}
            </span>
          </p>
        </div>
        <Button className="bg-copper-gradient text-bg-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Aggiungi bottiglia
        </Button>
      </div>

      {/* ── Search & Controls ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Cerca per nome, produttore o regione..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border-medium bg-bg-tertiary pl-10 pr-4 text-body-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper/40 focus-visible:border-accent-copper/30 transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'margin')}
              className="h-10 appearance-none rounded-lg border border-border-medium bg-bg-tertiary pl-3 pr-8 text-caption text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper/40 cursor-pointer"
            >
              <option value="price">Prezzo</option>
              <option value="name">Nome</option>
              <option value="margin">Margine</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary pointer-events-none" />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-border-medium overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                viewMode === 'list'
                  ? 'bg-accent-copper/10 text-accent-copper'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                viewMode === 'grid'
                  ? 'bg-accent-copper/10 text-accent-copper'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary'
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
                'rounded-full px-3.5 py-1.5 text-caption font-medium transition-all duration-200 flex items-center gap-1.5',
                activeFilter === filter.id
                  ? 'bg-accent-copper/10 text-accent-copper border border-accent-copper/20'
                  : 'text-text-secondary border border-border-medium hover:border-border-strong hover:text-text-primary'
              )}
            >
              {filter.label}
              <span className={cn(
                'text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full',
                activeFilter === filter.id
                  ? 'bg-accent-copper/20 text-accent-copper'
                  : 'bg-bg-tertiary text-text-tertiary'
              )}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-tertiary">
          {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'}
        </span>
      </div>

      {/* ── Bottle Grid / List ── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((bottle) => {
            const CatIcon = categoryIcon[bottle.category] || Wine;
            const status = statusConfig[bottle.status];
            return (
              <Link
                key={bottle.id}
                href={`/dashboard/bottles/${bottle.id}`}
                className="group flex flex-col rounded-lg border border-border-subtle bg-bg-secondary overflow-hidden transition-all duration-200 hover:border-border-medium hover:bg-bg-tertiary hover-lift"
              >
                {/* Card image area */}
                <div className="relative aspect-[4/3] bg-bg-tertiary flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-2 text-text-disabled">
                    <div className="h-20 w-6 rounded-sm bg-accent-wine/20 group-hover:bg-accent-wine/30 transition-colors" />
                  </div>
                  {/* Status pill */}
                  <div className={cn('absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1', status.bg)}>
                    <div className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wide', status.text)}>
                      {status.label}
                    </span>
                  </div>
                  {/* Category icon */}
                  <div className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-md bg-bg-primary/60 backdrop-blur-sm">
                    <CatIcon className="h-3.5 w-3.5 text-text-tertiary" />
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-overline text-text-tertiary">{bottle.producer}</span>
                    <h4 className="text-body-sm font-medium text-text-primary truncate">
                      {bottle.name}
                      {bottle.vintage && <span className="text-text-secondary ml-1">{bottle.vintage}</span>}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-caption text-text-secondary">
                    <span>{bottle.category}</span>
                    <span className="text-text-disabled">&middot;</span>
                    <span>{bottle.region}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-border-subtle">
                    <span className="text-body-sm font-semibold text-accent-copper">
                      {formatCurrency(bottle.price)}
                    </span>
                    <span className={cn(
                      'text-caption font-medium flex items-center gap-0.5',
                      bottle.margin >= 15 ? 'text-success' : bottle.margin >= 10 ? 'text-warning' : 'text-danger'
                    )}>
                      {bottle.margin >= 15 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {bottle.margin}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* ── List View ── */
        <div className="rounded-lg border border-border-subtle overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 px-4 py-3 bg-bg-tertiary border-b border-border-subtle">
            <span className="text-overline text-text-tertiary">BOTTIGLIA</span>
            <span className="text-overline text-text-tertiary text-right">PREZZO</span>
            <span className="text-overline text-text-tertiary text-right">MARGINE</span>
            <span className="text-overline text-text-tertiary text-center">CATEGORIA</span>
            <span className="text-overline text-text-tertiary text-center">STATO</span>
          </div>
          {/* Table rows */}
          {filtered.map((bottle) => {
            const CatIcon = categoryIcon[bottle.category] || Wine;
            const status = statusConfig[bottle.status];
            return (
              <Link
                key={bottle.id}
                href={`/dashboard/bottles/${bottle.id}`}
                className="grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 items-center px-4 py-3.5 border-b border-border-subtle bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
              >
                {/* Name + producer */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md bg-bg-tertiary group-hover:bg-bg-quaternary transition-colors">
                    <div className="h-7 w-2 rounded-sm bg-accent-wine/25" />
                  </div>
                  <div className="flex flex-col gap-0 min-w-0">
                    <span className="text-body-sm font-medium text-text-primary truncate">
                      {bottle.name}{bottle.vintage ? ` ${bottle.vintage}` : ''}
                    </span>
                    <span className="text-caption text-text-tertiary truncate">
                      {bottle.producer} &middot; {bottle.region}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <span className="text-body-sm font-semibold text-accent-copper text-right">
                  {formatCurrency(bottle.price)}
                </span>

                {/* Margin */}
                <span className={cn(
                  'text-body-sm font-medium text-right flex items-center justify-end gap-1',
                  bottle.margin >= 15 ? 'text-success' : bottle.margin >= 10 ? 'text-warning' : 'text-danger'
                )}>
                  {bottle.margin >= 15 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {bottle.margin}%
                </span>

                {/* Category */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1.5 text-caption text-text-secondary">
                    <CatIcon className="h-3.5 w-3.5" />
                    {bottle.category}
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', status.bg)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wide', status.text)}>
                      {status.label}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary mb-4">
            <Wine className="h-7 w-7 text-text-disabled" />
          </div>
          <p className="text-body-lg text-text-secondary">Nessuna bottiglia trovata</p>
          <p className="text-body-sm text-text-tertiary mt-1">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  );
}
