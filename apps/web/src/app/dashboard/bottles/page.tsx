'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Wine, Grape, Martini } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
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
  { id: 'all', label: 'All' },
  { id: 'wine', label: 'Wine' },
  { id: 'whisky', label: 'Whisky' },
  { id: 'cognac', label: 'Cognac' },
  { id: 'rum', label: 'Rum' },
  { id: 'listed', label: 'Listed' },
  { id: 'acquired', label: 'Acquired' },
  { id: 'pending_valuation', label: 'Pending' },
];

const categoryFilters = ['wine', 'whisky', 'cognac', 'rum'] as const;
const statusFilters = ['listed', 'acquired', 'pending_valuation'] as const;

/* ── Status badge config ── */
const statusConfig: Record<string, { label: string; color: string }> = {
  pending_valuation: { label: 'Pending', color: '#E5A832' },
  valued: { label: 'Valued', color: '#C9843A' },
  acquired: { label: 'Acquired', color: '#3B7FD9' },
  in_inventory: { label: 'In Stock', color: '#22C68A' },
  listed: { label: 'Listed', color: '#22C68A' },
  reserved: { label: 'Reserved', color: '#E5A832' },
  sold: { label: 'Sold', color: '#6B6963' },
  rejected: { label: 'Rejected', color: '#E54B4B' },
};

/* ── Sort field mapping ── */
const sortFieldMap: Record<string, string> = {
  price_high: 'target_sell_price',
  price_low: 'target_sell_price',
  name: 'name',
  margin: 'purchase_price',
  date: 'created_at',
};

const sortOptions = [
  { id: 'date', label: 'Date added' },
  { id: 'price_high', label: 'Price: High \u2192 Low' },
  { id: 'price_low', label: 'Price: Low \u2192 High' },
  { id: 'name', label: 'Name' },
  { id: 'margin', label: 'Margin' },
] as const;

type SortId = (typeof sortOptions)[number]['id'];

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

function getCategoryIcon(category: string) {
  switch (category) {
    case 'wine': return <Wine className="w-4 h-4" strokeWidth={1.5} />;
    case 'whisky': return <Martini className="w-4 h-4" strokeWidth={1.5} />;
    case 'cognac': return <Grape className="w-4 h-4" strokeWidth={1.5} />;
    default: return <Wine className="w-4 h-4" strokeWidth={1.5} />;
  }
}

export default function BottlesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortId>('date');
  const [showSort, setShowSort] = useState(false);

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
      params.set('sort', sortFieldMap[sortBy] || 'created_at');
      params.set('order', sortBy === 'name' || sortBy === 'price_low' ? 'asc' : 'desc');

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
      const allJson: BottlesResponse = allRes.ok ? await allRes.json() : { count: 0, data: [], limit: 0, offset: 0 };

      /* Fetch category and status counts in parallel */
      const countPromises = [...categoryFilters, ...statusFilters].map(async (filterId) => {
        const p = new URLSearchParams(baseParams);
        if ((categoryFilters as readonly string[]).includes(filterId)) {
          p.set('category', filterId);
        } else {
          p.set('status', filterId);
        }
        const r = await fetch(`/api/bottles?${p.toString()}`);
        const j: BottlesResponse = r.ok ? await r.json() : { count: 0, data: [], limit: 0, offset: 0 };
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

  return (
    <div className="min-h-screen bg-[#07070D] pb-24">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-[28px] font-bold text-[#EEECE7] mb-4">Inventory</h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6963]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search bottles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl pl-12 pr-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {filterDefs.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 h-8 rounded-full text-[12px] font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${
                  activeFilter === filter.id
                    ? 'bg-[#C9843A] text-[#07070D]'
                    : 'bg-[#0D0D15] text-[#A09E96] border border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/50'
                }`}
              >
                {filter.label}
                {filterCounts[filter.id] !== undefined && (
                  <span className={`text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${
                    activeFilter === filter.id
                      ? 'bg-[#07070D]/20 text-[#07070D]'
                      : 'bg-[rgba(255,255,255,0.06)] text-[#6B6963]'
                  }`}>
                    {filterCounts[filter.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Row */}
        <div className="max-w-md mx-auto px-6 pb-3 flex items-center justify-between">
          <span className="text-[12px] text-[#6B6963]">
            {loading ? '...' : `${totalCount} bottles`}
          </span>
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 text-[12px] text-[#C9843A] font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            Sort
          </button>
        </div>
      </div>

      {/* ── Bottle Cards ── */}
      <div className="max-w-md mx-auto px-6 py-4 space-y-3">
        {loading ? (
          /* Loading Skeletons */
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#14141F] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-[#14141F] rounded mb-2" />
                      <div className="h-3.5 w-44 bg-[#14141F] rounded" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="h-5 w-16 bg-[#14141F] rounded mb-1" />
                      <div className="h-3 w-12 bg-[#14141F] rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-5 w-14 bg-[#14141F] rounded-full" />
                    <div className="h-5 w-14 bg-[#14141F] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : bottles.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14141F] mb-4">
              <Wine className="h-7 w-7 text-[#6B6963]" />
            </div>
            <p className="text-[16px] text-[#A09E96]">No bottles found</p>
            <p className="text-[14px] text-[#6B6963] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          /* Bottle List */
          bottles.map((bottle) => {
            const margin = computeMargin(bottle);
            const status = statusConfig[bottle.status] || statusConfig.pending_valuation;
            return (
              <Link
                key={bottle.id}
                href={`/dashboard/bottles/${bottle.id}`}
                className="block bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg bg-[#14141F] border border-[rgba(255,255,255,0.06)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {bottle.primary_photo ? (
                      <Image
                        src={bottle.primary_photo}
                        alt={`${bottle.producer} ${bottle.name}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-2 rounded-sm bg-[#C9843A]/20" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-[#EEECE7] truncate">
                          {bottle.producer}
                        </h3>
                        <p className="text-[14px] text-[#A09E96] truncate">
                          {bottle.name} {bottle.vintage && `${bottle.vintage}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <p className="text-[16px] font-semibold text-[#C9843A] font-mono">
                          {formatCurrency(displayPrice(bottle))}
                        </p>
                        {margin !== null ? (
                          <p className={`text-[11px] font-medium ${
                            margin > 20 ? 'text-[#22C68A]' : margin < 10 ? 'text-[#E5A832]' : 'text-[#A09E96]'
                          }`}>
                            {margin}% margin
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#6B6963]">N/A</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ backgroundColor: `${status.color}15`, color: status.color }}
                      >
                        {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#14141F] text-[#A09E96]">
                        {getCategoryIcon(bottle.category)}
                        {bottle.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* ── Sort Bottom Sheet ── */}
      {showSort && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowSort(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 glass-bg rounded-t-[20px] border-t border-[rgba(255,255,255,0.06)] animate-in slide-in-from-bottom duration-300">
            <div className="max-w-md mx-auto">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[rgba(255,255,255,0.2)] rounded-full" />
              </div>

              <div className="px-6 pb-8">
                <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-4">Sort by</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full h-12 border rounded-xl px-4 text-left text-[14px] transition-all ${
                        sortBy === option.id
                          ? 'bg-[#C9843A]/10 border-[#C9843A]/30 text-[#C9843A]'
                          : 'bg-[#0D0D15] hover:bg-[#14141F] border-[rgba(255,255,255,0.06)] text-[#EEECE7]'
                      }`}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSort(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
