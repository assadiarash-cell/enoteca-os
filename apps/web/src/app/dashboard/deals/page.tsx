'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Wine, MessageSquare, Clock, ChevronRight, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
  { title: 'Offerta', color: '#4CAF50' },
  { title: 'Chiusura', color: '#2196F3' },
];

const SALE_COLUMNS_DEF = [
  { title: 'Richiesta', color: '#A09E96' },
  { title: 'Negoziazione', color: '#C9843A' },
  { title: 'Pagamento', color: '#4CAF50' },
  { title: 'Spedizione', color: '#2196F3' },
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

const priorityDot: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-[#C9843A]',
  low: 'bg-[#A09E96]',
};

// --- Data mapping ---

function mapAcquisitions(data: any[]): Column[] {
  const columnMap = new Map<string, Deal[]>();
  ACQUISITION_COLUMNS_DEF.forEach((c) => columnMap.set(c.title, []));

  for (const acq of data) {
    const colTitle = ACQUISITION_COLUMN_MAP[acq.status];
    if (!colTitle) continue; // skip completed/cancelled

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
    if (!colTitle) continue; // skip completed/cancelled

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

  const totalValue = columns.reduce(
    (sum, col) => sum + col.deals.reduce((s, d) => s + d.value, 0),
    0
  );
  const totalDeals = columns.reduce((sum, col) => sum + col.deals.length, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#EEECE7]">Deals</h1>
          <p className="text-sm text-[#A09E96] mt-1">
            {loading ? '...' : <>{totalDeals} deal attivi &middot; {formatCurrency(totalValue)} pipeline</>}
          </p>
        </div>
        <Button className="bg-[#C9843A] hover:bg-[#B8753A] text-white">
          <Plus className="h-4 w-4 mr-1" />
          Nuovo deal
        </Button>
      </div>

      {/* Segment Control */}
      <div className="flex gap-1 rounded-lg bg-[#0D0D15] border border-[#1A1A24] p-1 w-fit">
        <button
          onClick={() => setActiveTab('acquisitions')}
          className={cn(
            'rounded-md px-5 py-2 text-sm font-medium transition-all',
            activeTab === 'acquisitions'
              ? 'bg-[#C9843A]/15 text-[#C9843A] border border-[#C9843A]/30'
              : 'text-[#A09E96] hover:text-[#EEECE7] border border-transparent'
          )}
        >
          Acquisizioni
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={cn(
            'rounded-md px-5 py-2 text-sm font-medium transition-all',
            activeTab === 'sales'
              ? 'bg-[#C9843A]/15 text-[#C9843A] border border-[#C9843A]/30'
              : 'text-[#A09E96] hover:text-[#EEECE7] border border-transparent'
          )}
        >
          Vendite
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#C9843A] animate-spin" />
        </div>
      )}

      {/* Kanban Board */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[60vh]">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex flex-col gap-2">
                <div
                  className="h-1 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-semibold uppercase text-[#A09E96] tracking-wider">
                    {column.title}
                  </h3>
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#1A1A24] text-[10px] text-[#A09E96]">
                    {column.deals.length}
                  </span>
                </div>
              </div>

              {/* Column Body */}
              <div className="flex flex-col gap-3 rounded-lg bg-[#0D0D15]/50 border border-[#1A1A24] p-3 min-h-[200px] flex-1">
                {column.deals.length === 0 && (
                  <div className="flex items-center justify-center flex-1 text-xs text-[#A09E96]/50">
                    Nessun deal
                  </div>
                )}
                {column.deals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="flex flex-col gap-3 rounded-lg border border-[#1A1A24] bg-[#0D0D15] p-4 hover:border-[#C9843A]/40 transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-[#EEECE7] line-clamp-2 group-hover:text-white transition-colors">
                        {deal.title}
                      </h4>
                      <div className={cn('h-2.5 w-2.5 rounded-full shrink-0 mt-1', priorityDot[deal.priority])} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#A09E96]">
                      <span>{deal.sellerOrBuyer}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1A1A24]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-[#A09E96]">
                          <Wine className="h-3 w-3" />
                          {deal.bottleCount}
                        </span>
                        <span className="text-sm font-medium text-[#C9843A]">
                          {formatCurrency(deal.value)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A09E96]/60">
                        {deal.timestamp}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deal Detail Sheet */}
      <Sheet open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
        <SheetContent side="bottom" className="bg-[#0D0D15] border-t border-[#1A1A24] max-h-[80vh] overflow-y-auto rounded-t-2xl">
          {selectedDeal && (
            <>
              <SheetHeader className="pb-4 border-b border-[#1A1A24]">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <SheetTitle className="text-[#EEECE7] text-lg">
                      {selectedDeal.title}
                    </SheetTitle>
                    <SheetDescription className="text-[#A09E96]">
                      {selectedDeal.sellerOrBuyer} &middot; {selectedDeal.bottleCount} bottiglie &middot; {selectedDeal.daysInStage}g in fase
                    </SheetDescription>
                  </div>
                  <span className="text-xl font-semibold text-[#C9843A]">
                    {formatCurrency(selectedDeal.value)}
                  </span>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-4">
                {/* Bottles List */}
                {selectedDeal.bottles && selectedDeal.bottles.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase text-[#A09E96] tracking-wider">
                      Bottiglie
                    </h4>
                    <div className="flex flex-col gap-2">
                      {selectedDeal.bottles.map((bottle, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]"
                        >
                          <div className="flex items-center gap-3">
                            <Wine className="h-4 w-4 text-[#C9843A]" />
                            <div>
                              <span className="text-sm text-[#EEECE7]">{bottle.name}</span>
                              {bottle.producer && (
                                <span className="text-xs text-[#A09E96] ml-2">{bottle.producer}</span>
                              )}
                              {bottle.vintage && (
                                <span className="text-xs text-[#A09E96] ml-2">{bottle.vintage}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {bottle.price != null && bottle.price > 0 && (
                              <span className="text-xs text-[#C9843A]">{formatCurrency(bottle.price)}</span>
                            )}
                            <span className="text-xs text-[#A09E96]">x{bottle.qty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedDeal.notes && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase text-[#A09E96] tracking-wider">
                      Note
                    </h4>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                      <MessageSquare className="h-4 w-4 text-[#A09E96] mt-0.5 shrink-0" />
                      <p className="text-sm text-[#EEECE7]/80">{selectedDeal.notes}</p>
                    </div>
                  </div>
                )}

                {/* Info Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                    <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Priorita</span>
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', priorityDot[selectedDeal.priority])} />
                      <span className="text-sm text-[#EEECE7] capitalize">{selectedDeal.priority}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                    <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Tempo in fase</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#A09E96]" />
                      <span className="text-sm text-[#EEECE7]">{selectedDeal.daysInStage}g</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                    <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Tipo</span>
                    <span className="text-sm text-[#EEECE7]">
                      {selectedDeal.type === 'acquisition' ? 'Acquisto' : 'Vendita'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button className="flex-1 bg-[#C9843A] hover:bg-[#B8753A] text-white">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Avanza fase
                  </Button>
                  <Button variant="outline" className="border-[#1A1A24] text-[#EEECE7] hover:bg-[#1A1A24]">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-[#1A1A24] text-[#EEECE7] hover:bg-[#1A1A24]">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
