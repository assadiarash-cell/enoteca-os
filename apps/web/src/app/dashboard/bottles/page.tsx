'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';

/* ── Types ── */
interface Bottle {
  id: string;
  category: 'wine' | 'whisky' | 'cognac' | 'rum' | 'liqueur' | 'champagne' | 'other';
  producer: string;
  name: string;
  vintage: number | null;
  denomination: string;
  region: string;
  country: string;
  format: '375ml' | '750ml' | '1500ml' | '3000ml';
  status: 'pending_valuation' | 'valued' | 'acquired' | 'in_inventory' | 'listed' | 'reserved' | 'sold' | 'rejected';
  purchase_price: number | null;
  target_sell_price: number | null;
  market_price_low: number | null;
  market_price_high: number | null;
  authenticity_score: number | null;
  label_condition: string | null;
  liquid_level: string | null;
  overall_condition: string | null;
  primary_photo: string | null;
  photos: string[];
  seller: { full_name: string } | null;
  created_at: string;
}

interface BottlesResponse {
  data: Bottle[];
  count: number;
  limit: number;
  offset: number;
}

/* ── Filter chip definitions ── */
type FilterId = 'all' | 'wine' | 'whisky' | 'cognac' | 'rum' | 'listed' | 'acquired' | 'pending_valuation';

const filterDefs: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Tutte' },
  { id: 'wine', label: 'Vino' },
  { id: 'whisky', label: 'Whisky' },
  { id: 'cognac', label: 'Cognac' },
  { id: 'rum', label: 'Rum' },
  { id: 'listed', label: 'In vendita' },
  { id: 'acquired', label: 'Acquisite' },
  { id: 'pending_valuation', label: 'In attesa' },
];

const categoryFilters = ['wine', 'whisky', 'cognac', 'rum'] as const;
const statusFilters = ['listed', 'acquired', 'pending_valuation'] as const;

/* ── Category labels (API value → Italian) ── */
const categoryLabel: Record<string, string> = {
  wine: 'Vino',
  whisky: 'Whisky',
  cognac: 'Cognac',
  rum: 'Rum',
  liqueur: 'Liquore',
  champagne: 'Champagne',
  other: 'Altro',
};

/* ── Category icon map ── */
const categoryIcon: Record<string, typeof Wine> = {
  wine: Wine,
  whisky: GlassWater,
  cognac: Martini,
  rum: Flame,
};

/* ── Status badge config (API status value → display) ── */
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending_valuation: { label: 'In attesa', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  valued: { label: 'Valutata', bg: 'bg-accent-copper/10', text: 'text-accent-copper', dot: 'bg-accent-copper' },
  acquired: { label: 'Acquisita', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  in_inventory: { label: 'In magazzino', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  listed: { label: 'In vendita', bg: 'bg-accent-copper/10', text: 'text-accent-copper', dot: 'bg-accent-copper' },
  reserved: { label: 'Riservata', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  sold: { label: 'Venduta', bg: 'bg-text-tertiary/10', text: 'text-text-tertiary', dot: 'bg-text-tertiary' },
  rejected: { label: 'Rifiutata', bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
};

/* ── Sort field mapping ── */
const sortFieldMap: Record<string, string> = {
  price: 'target_sell_price',
  name: 'name',
  margin: 'purchase_price',
};

/* ── Helpers ── */
function computeMargin(bottle: Bottle): number | null {
  if (bottle.target_sell_price && bottle.purchase_price && bottle.purchase_price > 0) {
    return Math.round(((bottle.target_sell_price - bottle.purchase_price) / bottle.purchase_price) * 100);
  }
  return null;
}

function displayPrice(bottle: Bottle): number {
  return bottle.target_sell_price ?? bottle.purchase_price ?? 0;
}

export default function BottlesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'margin'>('price');

  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* Count per filter chip (fetched once on mount + when search changes) */
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});

  const fetchBottles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('org_id', DEMO_ORG_ID);
      params.set('limit', '50');
      params.set('offset', '0');
      params.set('sort', sortFieldMap[sortBy] || 'target_sell_price');
      params.set('order', sortBy === 'name' ? 'asc' : 'desc');

      if (search) params.set('search', search);

      if (activeFilter !== 'all') {
        if ((categoryFilters as readonly string[]).includes(activeFilter)) {
          params.set('category', activeFilter);
        } else if ((statusFilters as readonly string[]).includes(activeFilter)) {
          params.set('status', activeFilter);
        }
      }

      const res = await fetch(`/api/bottles?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch bottles');
      const json: BottlesResponse = await res.json();
      setBottles(json.data);
      setTotalCount(json.count);
    } catch (err) {
      console.error('Error fetching bottles:', err);
      setBottles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, sortBy]);

  /* Fetch filter counts */
  const fetchFilterCounts = useCallback(async () => {
    try {
      const baseParams = new URLSearchParams();
      baseParams.set('org_id', DEMO_ORG_ID);
      baseParams.set('limit', '0');
      baseParams.set('offset', '0');
      if (search) baseParams.set('search', search);

      /* Fetch all count */
      const allRes = await fetch(`/api/bottles?${baseParams.toString()}`);
      const allJson: BottlesResponse = allRes.ok ? await allRes.json() : { count: 0 };

      /* Fetch category and status counts in parallel */
      const countPromises = [...categoryFilters, ...statusFilters].map(async (filterId) => {
        const p = new URLSearchParams(baseParams);
        if ((categoryFilters as readonly string[]).includes(filterId)) {
          p.set('category', filterId);
        } else {
          p.set('status', filterId);
        }
        const r = await fetch(`/api/bottles?${p.toString()}`);
        const j: BottlesResponse = r.ok ? await r.json() : { count: 0 };
        return [filterId, j.count] as [string, number];
      });

      const results = await Promise.all(countPromises);
      const counts: Record<string, number> = { all: allJson.count };
      results.forEach(([id, count]) => { counts[id] = count; });
      setFilterCounts(counts);
    } catch (err) {
      console.error('Error fetching filter counts:', err);
    }
  }, [search]);

  useEffect(() => {
    fetchBottles();
  }, [fetchBottles]);

  useEffect(() => {
    fetchFilterCounts();
  }, [fetchFilterCounts]);

  /* ── Computed totals ── */
  const totalValue = bottles.reduce((sum, b) => sum + displayPrice(b), 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Bottiglie</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {totalCount} bottigli{totalCount === 1 ? 'a' : 'e'} in inventario &middot; valore totale{' '}
            <span className="text-accent-copper font-medium">
              {formatCurrency(totalValue)}
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
          {filterDefs.map((filter) => (
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
                {filterCounts[filter.id] ?? '—'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-tertiary">
          {loading ? '…' : `${totalCount} risultat${totalCount === 1 ? 'o' : 'i'}`}
        </span>
      </div>

      {/* ── Loading skeleton ── */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border border-border-subtle bg-bg-secondary overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-bg-tertiary" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="h-3 w-24 bg-bg-tertiary rounded" />
                  <div className="h-4 w-40 bg-bg-tertiary rounded" />
                  <div className="h-3 w-28 bg-bg-tertiary rounded" />
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-border-subtle">
                    <div className="h-4 w-16 bg-bg-tertiary rounded" />
                    <div className="h-3 w-10 bg-bg-tertiary rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 px-4 py-3 bg-bg-tertiary border-b border-border-subtle">
              <span className="text-overline text-text-tertiary">BOTTIGLIA</span>
              <span className="text-overline text-text-tertiary text-right">PREZZO</span>
              <span className="text-overline text-text-tertiary text-right">MARGINE</span>
              <span className="text-overline text-text-tertiary text-center">CATEGORIA</span>
              <span className="text-overline text-text-tertiary text-center">STATO</span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 items-center px-4 py-3.5 border-b border-border-subtle bg-bg-secondary animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-8 rounded-md bg-bg-tertiary" />
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-36 bg-bg-tertiary rounded" />
                    <div className="h-3 w-24 bg-bg-tertiary rounded" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-bg-tertiary rounded ml-auto" />
                <div className="h-4 w-10 bg-bg-tertiary rounded ml-auto" />
                <div className="h-4 w-14 bg-bg-tertiary rounded mx-auto" />
                <div className="h-5 w-16 bg-bg-tertiary rounded-full mx-auto" />
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {/* ── Bottle Grid / List ── */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bottles.map((bottle) => {
                const CatIcon = categoryIcon[bottle.category] || Wine;
                const status = statusConfig[bottle.status] || statusConfig.pending_valuation;
                const margin = computeMargin(bottle);
                const catLabel = categoryLabel[bottle.category] || bottle.category;
                return (
                  <Link
                    key={bottle.id}
                    href={`/dashboard/bottles/${bottle.id}`}
                    className="group flex flex-col rounded-lg border border-border-subtle bg-bg-secondary overflow-hidden transition-all duration-200 hover:border-border-medium hover:bg-bg-tertiary hover-lift"
                  >
                    {/* Card image area */}
                    <div className="relative aspect-[4/3] bg-bg-tertiary flex items-center justify-center overflow-hidden">
                      {bottle.primary_photo ? (
                        <Image
                          src={bottle.primary_photo}
                          alt={`${bottle.producer} ${bottle.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-text-disabled">
                          <div className="h-20 w-6 rounded-sm bg-accent-wine/20 group-hover:bg-accent-wine/30 transition-colors" />
                        </div>
                      )}
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
                        <span>{catLabel}</span>
                        <span className="text-text-disabled">&middot;</span>
                        <span>{bottle.region}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-border-subtle">
                        <span className="text-body-sm font-semibold text-accent-copper">
                          {formatCurrency(displayPrice(bottle))}
                        </span>
                        {margin !== null ? (
                          <span className={cn(
                            'text-caption font-medium flex items-center gap-0.5',
                            margin >= 15 ? 'text-success' : margin >= 10 ? 'text-warning' : 'text-danger'
                          )}>
                            {margin >= 15 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {margin}%
                          </span>
                        ) : (
                          <span className="text-caption text-text-disabled">N/A</span>
                        )}
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
              {bottles.map((bottle) => {
                const CatIcon = categoryIcon[bottle.category] || Wine;
                const status = statusConfig[bottle.status] || statusConfig.pending_valuation;
                const margin = computeMargin(bottle);
                const catLabel = categoryLabel[bottle.category] || bottle.category;
                return (
                  <Link
                    key={bottle.id}
                    href={`/dashboard/bottles/${bottle.id}`}
                    className="grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 items-center px-4 py-3.5 border-b border-border-subtle bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
                  >
                    {/* Name + producer */}
                    <div className="flex items-center gap-3 min-w-0">
                      {bottle.primary_photo ? (
                        <div className="relative flex h-10 w-8 shrink-0 items-center justify-center rounded-md overflow-hidden bg-bg-tertiary">
                          <Image
                            src={bottle.primary_photo}
                            alt={`${bottle.producer} ${bottle.name}`}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md bg-bg-tertiary group-hover:bg-bg-quaternary transition-colors">
                          <div className="h-7 w-2 rounded-sm bg-accent-wine/25" />
                        </div>
                      )}
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
                      {formatCurrency(displayPrice(bottle))}
                    </span>

                    {/* Margin */}
                    {margin !== null ? (
                      <span className={cn(
                        'text-body-sm font-medium text-right flex items-center justify-end gap-1',
                        margin >= 15 ? 'text-success' : margin >= 10 ? 'text-warning' : 'text-danger'
                      )}>
                        {margin >= 15 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {margin}%
                      </span>
                    ) : (
                      <span className="text-body-sm text-text-disabled text-right">N/A</span>
                    )}

                    {/* Category */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-1.5 text-caption text-text-secondary">
                        <CatIcon className="h-3.5 w-3.5" />
                        {catLabel}
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
          {bottles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary mb-4">
                <Wine className="h-7 w-7 text-text-disabled" />
              </div>
              <p className="text-body-lg text-text-secondary">Nessuna bottiglia trovata</p>
              <p className="text-body-sm text-text-tertiary mt-1">Prova a modificare i filtri di ricerca</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
