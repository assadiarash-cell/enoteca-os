'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Clock, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';

type Tab = 'acquisitions' | 'sales';
type Priority = 'high' | 'medium' | 'low';

interface DealBottle {
  name: string;
  producer?: string;
  vintage: number | null;
  qty: number;
  price?: number;
}

interface Deal {
  id: string;
  title: string;
  sellerOrBuyer: string;
  bottleCount: number;
  value: number;
  type: 'acquisition' | 'sale';
  daysInStage: number;
  priority: Priority;
  timestamp: string;
  bottles?: DealBottle[];
  notes?: string;
}

interface Column {
  title: string;
  color: string;
  deals: Deal[];
}

// --- Status-to-column mappings ---

const ACQUISITION_COLUMN_MAP: Record<string, string> = {
  negotiating: 'Lead',
  offered: 'Valutazione',
  accepted: 'Offerta',
  scheduled_pickup: 'Chiusura',
  picked_up: 'Chiusura',
  verified: 'Chiusura',
  paid: 'Chiusura',
};

const SALE_COLUMN_MAP: Record<string, string> = {
  negotiating: 'Richiesta',
  agreed: 'Negoziazione',
  invoiced: 'Pagamento',
  paid: 'Pagamento',
  shipped: 'Spedizione',
  delivered: 'Spedizione',
};

const ACQUISITION_COLUMNS_DEF = [
  { title: 'Lead', color: '#A09E96' },
  { title: 'Valutazione', color: '#C9843A' },
  { title: 'Offerta', color: '#22C68A' },
  { title: 'Chiusura', color: '#3B7FD9' },
];

const SALE_COLUMNS_DEF = [
  { title: 'Richiesta', color: '#A09E96' },
  { title: 'Negoziazione', color: '#C9843A' },
  { title: 'Pagamento', color: '#22C68A' },
  { title: 'Spedizione', color: '#3B7FD9' },
];

// --- Helpers ---

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  return `${days}g fa`;
}

function derivePriority(value: number): Priority {
  if (value > 10000) return 'high';
  if (value > 5000) return 'medium';
  return 'low';
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return '#DC4545';
    case 'medium': return '#E5A832';
    case 'low': return '#3B7FD9';
    default: return '#6B6963';
  }
};

// --- Data mapping ---

function mapAcquisitions(data: any[]): Column[] {
  const columnMap = new Map<string, Deal[]>();
  ACQUISITION_COLUMNS_DEF.forEach((c) => columnMap.set(c.title, []));

  for (const acq of data) {
    const colTitle = ACQUISITION_COLUMN_MAP[acq.status];
    if (!colTitle) continue;

    const bottles: DealBottle[] = (acq.bottles ?? []).map((b: any) => ({
      name: b.name || 'Bottiglia',
      producer: b.producer,
      vintage: b.vintage,
      qty: 1,
      price: b.purchase_price,
    }));

    const value = acq.total_final ?? acq.total_offer ?? 0;
    const bottleNames = bottles.slice(0, 2).map((b) => b.name).join(', ');
    const title = bottleNames
      ? `${acq.seller?.full_name ?? 'Venditore'} — ${bottleNames}${bottles.length > 2 ? ` +${bottles.length - 2}` : ''}`
      : acq.seller?.full_name ?? 'Acquisizione';

    const deal: Deal = {
      id: acq.id,
      title,
      sellerOrBuyer: acq.seller?.full_name ?? '—',
      bottleCount: acq.total_bottles ?? bottles.length,
      value,
      type: 'acquisition',
      daysInStage: daysAgo(acq.updated_at ?? acq.created_at),
      priority: derivePriority(value),
      timestamp: relativeTime(acq.updated_at ?? acq.created_at),
      bottles,
      notes: acq.notes,
    };

    columnMap.get(colTitle)!.push(deal);
  }

  return ACQUISITION_COLUMNS_DEF.map((def) => ({
    ...def,
    deals: columnMap.get(def.title) ?? [],
  }));
}

function mapSales(data: any[]): Column[] {
  const columnMap = new Map<string, Deal[]>();
  SALE_COLUMNS_DEF.forEach((c) => columnMap.set(c.title, []));

  for (const sale of data) {
    const colTitle = SALE_COLUMN_MAP[sale.status];
    if (!colTitle) continue;

    const bottles: DealBottle[] = (sale.sale_items ?? []).map((item: any) => ({
      name: item.bottle?.name || 'Bottiglia',
      producer: item.bottle?.producer,
      vintage: item.bottle?.vintage,
      qty: item.quantity ?? 1,
      price: item.unit_price,
    }));

    const value = sale.total_amount ?? 0;
    const buyerName = sale.buyer?.company_name || sale.buyer?.full_name || 'Compratore';
    const bottleNames = bottles.slice(0, 2).map((b) => b.name).join(', ');
    const title = bottleNames
      ? `${bottleNames}${bottles.length > 2 ? ` +${bottles.length - 2}` : ''}`
      : buyerName;

    const bottleCount = bottles.reduce((sum, b) => sum + b.qty, 0);

    const deal: Deal = {
      id: sale.id,
      title,
      sellerOrBuyer: sale.buyer?.full_name || sale.buyer?.company_name || '—',
      bottleCount,
      value,
      type: 'sale',
      daysInStage: daysAgo(sale.updated_at ?? sale.created_at),
      priority: derivePriority(value),
      timestamp: relativeTime(sale.updated_at ?? sale.created_at),
      bottles,
      notes: sale.notes,
    };

    columnMap.get(colTitle)!.push(deal);
  }

  return SALE_COLUMNS_DEF.map((def) => ({
    ...def,
    deals: columnMap.get(def.title) ?? [],
  }));
}

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('acquisitions');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [acquisitionColumns, setAcquisitionColumns] = useState<Column[]>(
    ACQUISITION_COLUMNS_DEF.map((d) => ({ ...d, deals: [] }))
  );
  const [salesColumns, setSalesColumns] = useState<Column[]>(
    SALE_COLUMNS_DEF.map((d) => ({ ...d, deals: [] }))
  );
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [acqRes, salesRes] = await Promise.all([
        fetch(`/api/acquisitions?org_id=${DEMO_ORG_ID}`),
        fetch(`/api/sales?org_id=${DEMO_ORG_ID}`),
      ]);

      if (acqRes.ok) {
        const acqJson = await acqRes.json();
        setAcquisitionColumns(mapAcquisitions(acqJson.data ?? []));
      }
      if (salesRes.ok) {
        const salesJson = await salesRes.json();
        setSalesColumns(mapSales(salesJson.data ?? []));
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = activeTab === 'acquisitions' ? acquisitionColumns : salesColumns;

  return (
    <div className="min-h-screen bg-[#07070D] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-[28px] font-bold text-[#EEECE7] mb-4">Deals</h1>

          {/* Segment Control */}
          <div className="inline-flex bg-[#0D0D15] rounded-lg p-1 border border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => setActiveTab('acquisitions')}
              className={`px-6 h-9 rounded-md text-[14px] font-medium transition-all ${
                activeTab === 'acquisitions'
                  ? 'bg-[#C9843A] text-[#07070D]'
                  : 'text-[#A09E96] hover:text-[#EEECE7]'
              }`}
            >
              Acquisitions
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 h-9 rounded-md text-[14px] font-medium transition-all ${
                activeTab === 'sales'
                  ? 'bg-[#C9843A] text-[#07070D]'
                  : 'text-[#A09E96] hover:text-[#EEECE7]'
              }`}
            >
              Sales
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#C9843A] animate-spin" />
        </div>
      )}

      {/* Pipeline Kanban */}
      {!loading && (
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 px-6 py-6 min-w-full">
            {columns.map((column) => (
              <div key={column.title} className="w-72 flex-shrink-0">
                {/* Column Header */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-[14px] font-semibold uppercase tracking-wider"
                      style={{ color: column.color }}
                    >
                      {column.title}
                    </h3>
                    <span className="text-[12px] text-[#6B6963] font-medium">
                      {column.deals.length}
                    </span>
                  </div>
                  <div className="h-1 rounded-full" style={{ backgroundColor: `${column.color}40` }} />
                </div>

                {/* Deal Cards */}
                <div className="space-y-3">
                  {column.deals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/30 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-[14px] font-semibold text-[#EEECE7]">
                          {deal.sellerOrBuyer}
                        </h4>
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: getPriorityColor(deal.priority) }}
                        />
                      </div>

                      <p className="text-[12px] text-[#A09E96] mb-3">
                        {deal.bottleCount} bottles &bull; {formatCurrency(deal.value)} offer
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] text-[#6B6963] font-mono">
                          <Clock className="w-3 h-3" strokeWidth={1.5} />
                          {deal.timestamp}
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#6B6963]" strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}

                  {column.deals.length === 0 && (
                    <div className="bg-[#0D0D15]/50 rounded-xl p-6 border border-dashed border-[rgba(255,255,255,0.06)] text-center">
                      <p className="text-[12px] text-[#6B6963]">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deal Detail Modal (Bottom Sheet) */}
      {selectedDeal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelectedDeal(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 glass-bg rounded-t-[20px] border-t border-[rgba(255,255,255,0.06)] max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="max-w-md mx-auto">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[rgba(255,255,255,0.2)] rounded-full" />
              </div>

              <div className="px-6 pb-8">
                {/* Seller Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-[22px] font-bold text-[#EEECE7] mb-1">
                        {selectedDeal.sellerOrBuyer}
                      </h2>
                      <p className="text-[14px] text-[#A09E96]">
                        {selectedDeal.bottleCount} bottiglie &middot; {selectedDeal.daysInStage}g in fase
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#3B7FD9]/10 text-[#3B7FD9] border border-[#3B7FD9]/20">
                        {selectedDeal.type === 'acquisition' ? 'Acquisto' : 'Vendita'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#C9843A]/10 text-[#C9843A] border border-[#C9843A]/20">
                        {selectedDeal.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottles List */}
                {selectedDeal.bottles && selectedDeal.bottles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-3">Bottles</h3>
                    <div className="space-y-2">
                      {selectedDeal.bottles.map((bottle, i) => (
                        <div
                          key={i}
                          className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)] flex items-center justify-between"
                        >
                          <span className="text-[14px] text-[#EEECE7]">
                            {bottle.name}
                            {bottle.vintage ? ` ${bottle.vintage}` : ''}
                            {bottle.producer ? ` — ${bottle.producer}` : ''}
                          </span>
                          <div className="flex items-center gap-3">
                            {bottle.price != null && bottle.price > 0 && (
                              <span className="text-[14px] font-semibold text-[#C9843A] font-mono">
                                {formatCurrency(bottle.price)}
                              </span>
                            )}
                            {bottle.qty > 1 && (
                              <span className="text-[12px] text-[#A09E96]">x{bottle.qty}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Summary */}
                <div className="bg-[#14141F] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-[#A09E96]">Total bottles</span>
                    <span className="text-[14px] font-semibold text-[#EEECE7]">
                      {selectedDeal.bottleCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-[#A09E96]">Total offer</span>
                    <span className="text-[16px] font-bold text-[#C9843A] font-mono">
                      {formatCurrency(selectedDeal.value)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="text-[13px] text-[#A09E96]">Est. margin</span>
                    <span className="text-[14px] font-semibold text-[#22C68A]">
                      ~{formatCurrency(Math.round(selectedDeal.value * 0.25))} (25%)
                    </span>
                  </div>
                </div>

                {/* Conversation Preview */}
                {selectedDeal.notes && (
                  <div className="mb-6">
                    <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-3">Conversation</h3>
                    <div className="bg-[#0D0D15] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] space-y-3">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#3B7FD9]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[12px] text-[#3B7FD9]">AI</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-[#14141F] rounded-lg rounded-tl-sm p-3 mb-1">
                            <p className="text-[13px] text-[#EEECE7]">
                              {selectedDeal.notes}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#6B6963] font-mono">{selectedDeal.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="h-11 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[13px] transition-all active:scale-[0.98]">
                    Adjust Price
                  </button>
                  <button className="h-11 bg-[#22C68A] hover:bg-[#22C68A]/90 text-[#07070D] rounded-xl font-medium text-[13px] transition-all active:scale-[0.98]">
                    Approve Offer
                  </button>
                  <button className="h-11 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[13px] transition-all active:scale-[0.98]">
                    Schedule Pickup
                  </button>
                  <button className="h-11 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[13px] transition-all active:scale-[0.98]">
                    Mark Paid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
