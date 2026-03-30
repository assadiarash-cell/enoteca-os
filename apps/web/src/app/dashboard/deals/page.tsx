'use client';

import { useState } from 'react';
import { Plus, Wine, MessageSquare, Clock, ChevronRight, Phone, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

type Tab = 'acquisitions' | 'sales';
type Priority = 'high' | 'medium' | 'low';

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
  bottles?: { name: string; vintage: number; qty: number }[];
  lastMessage?: string;
}

interface Column {
  title: string;
  color: string;
  deals: Deal[];
}

const acquisitionColumns: Column[] = [
  {
    title: 'Lead',
    color: '#A09E96',
    deals: [
      {
        id: 'a1',
        title: 'Cantina privata Verona — 12 bottiglie Barolo',
        sellerOrBuyer: 'Giovanni Bianchi',
        bottleCount: 12,
        value: 18000,
        type: 'acquisition',
        daysInStage: 2,
        priority: 'high',
        timestamp: '2h fa',
        bottles: [
          { name: 'Barolo Monfortino', vintage: 2010, qty: 4 },
          { name: 'Barolo Cannubi', vintage: 2012, qty: 4 },
          { name: 'Barolo Bussia', vintage: 2015, qty: 4 },
        ],
        lastMessage: 'Buongiorno, ho ereditato queste bottiglie e vorrei una valutazione.',
      },
      {
        id: 'a2',
        title: 'Eredita Milano — Collezione mista',
        sellerOrBuyer: 'Maria Conti',
        bottleCount: 35,
        value: 42000,
        type: 'acquisition',
        daysInStage: 5,
        priority: 'medium',
        timestamp: '5h fa',
        bottles: [
          { name: 'Sassicaia', vintage: 2008, qty: 6 },
          { name: 'Tignanello', vintage: 2010, qty: 8 },
          { name: 'Ornellaia', vintage: 2012, qty: 6 },
          { name: 'Brunello Biondi-Santi', vintage: 2006, qty: 5 },
          { name: 'Barbaresco Gaja', vintage: 2009, qty: 10 },
        ],
        lastMessage: 'Le foto le invio domani mattina, sono troppe bottiglie.',
      },
    ],
  },
  {
    title: 'Valutazione',
    color: '#C9843A',
    deals: [
      {
        id: 'a3',
        title: 'Ristorante Roma — Whisky premium',
        sellerOrBuyer: 'Trattoria Da Enzo',
        bottleCount: 8,
        value: 12500,
        type: 'acquisition',
        daysInStage: 3,
        priority: 'medium',
        timestamp: '1g fa',
        bottles: [
          { name: 'Macallan 18yo', vintage: 2004, qty: 3 },
          { name: 'Highland Park 25', vintage: 1998, qty: 2 },
          { name: 'Lagavulin 16', vintage: 2006, qty: 3 },
        ],
        lastMessage: 'Agent Scout ha completato la valutazione preliminare.',
      },
    ],
  },
  {
    title: 'Offerta',
    color: '#4CAF50',
    deals: [
      {
        id: 'a4',
        title: 'Cantina Toscana — Sassicaia verticale',
        sellerOrBuyer: 'Paolo Rossi',
        bottleCount: 6,
        value: 28000,
        type: 'acquisition',
        daysInStage: 1,
        priority: 'high',
        timestamp: '3h fa',
        bottles: [
          { name: 'Sassicaia', vintage: 2000, qty: 1 },
          { name: 'Sassicaia', vintage: 2004, qty: 1 },
          { name: 'Sassicaia', vintage: 2006, qty: 1 },
          { name: 'Sassicaia', vintage: 2010, qty: 1 },
          { name: 'Sassicaia', vintage: 2015, qty: 1 },
          { name: 'Sassicaia', vintage: 2016, qty: 1 },
        ],
        lastMessage: 'Offerta inviata, in attesa di risposta del venditore.',
      },
      {
        id: 'a5',
        title: 'Collezione Cognac — Lotto speciale',
        sellerOrBuyer: 'Henri Dupont',
        bottleCount: 4,
        value: 15000,
        type: 'acquisition',
        daysInStage: 7,
        priority: 'low',
        timestamp: '7g fa',
        bottles: [
          { name: 'Hennessy Paradis', vintage: 1990, qty: 1 },
          { name: 'Remy Martin Louis XIII', vintage: 1985, qty: 1 },
          { name: 'Courvoisier XO', vintage: 2000, qty: 2 },
        ],
        lastMessage: 'Il venditore ha chiesto tempo per considerare.',
      },
    ],
  },
  {
    title: 'Chiusura',
    color: '#2196F3',
    deals: [
      {
        id: 'a6',
        title: 'Rum collezione Jamaica',
        sellerOrBuyer: 'Carlo Verdi',
        bottleCount: 3,
        value: 9600,
        type: 'acquisition',
        daysInStage: 1,
        priority: 'high',
        timestamp: '30m fa',
        bottles: [
          { name: 'Appleton Estate 21', vintage: 2001, qty: 1 },
          { name: 'Hampden Estate LROK', vintage: 2010, qty: 1 },
          { name: 'Worthy Park 12', vintage: 2012, qty: 1 },
        ],
        lastMessage: 'Contratto firmato, in attesa di ricevere le bottiglie.',
      },
    ],
  },
];

const salesColumns: Column[] = [
  {
    title: 'Richiesta',
    color: '#A09E96',
    deals: [
      {
        id: 's1',
        title: 'Romanee-Conti 1998 — Buyer premium',
        sellerOrBuyer: 'Alexander Schmidt',
        bottleCount: 1,
        value: 14500,
        type: 'sale',
        daysInStage: 1,
        priority: 'high',
        timestamp: '1h fa',
        bottles: [{ name: 'Romanee-Conti Grand Cru', vintage: 1998, qty: 1 }],
        lastMessage: 'Buyer verificato, interessato ad acquisto immediato.',
      },
    ],
  },
  {
    title: 'Negoziazione',
    color: '#C9843A',
    deals: [
      {
        id: 's2',
        title: 'Macallan 25yo + Highland Park 30',
        sellerOrBuyer: 'Tanaka Yuki',
        bottleCount: 2,
        value: 7000,
        type: 'sale',
        daysInStage: 4,
        priority: 'medium',
        timestamp: '4g fa',
        bottles: [
          { name: 'Macallan 25yo Sherry Oak', vintage: 1996, qty: 1 },
          { name: 'Highland Park 30', vintage: 1990, qty: 1 },
        ],
        lastMessage: 'Negoziazione in corso, il buyer ha proposto uno sconto del 5%.',
      },
      {
        id: 's3',
        title: 'Lotto Bordeaux 2000-2005',
        sellerOrBuyer: 'James Williams',
        bottleCount: 6,
        value: 22000,
        type: 'sale',
        daysInStage: 6,
        priority: 'high',
        timestamp: '6g fa',
        bottles: [
          { name: 'Petrus', vintage: 2000, qty: 2 },
          { name: 'Lafite Rothschild', vintage: 2003, qty: 2 },
          { name: 'Margaux', vintage: 2005, qty: 2 },
        ],
        lastMessage: 'Il buyer ha accettato il prezzo, procediamo con il pagamento.',
      },
    ],
  },
  {
    title: 'Pagamento',
    color: '#4CAF50',
    deals: [
      {
        id: 's4',
        title: 'Petrus 2005',
        sellerOrBuyer: 'Chen Wei',
        bottleCount: 1,
        value: 8200,
        type: 'sale',
        daysInStage: 2,
        priority: 'medium',
        timestamp: '2g fa',
        bottles: [{ name: 'Petrus', vintage: 2005, qty: 1 }],
        lastMessage: 'Pagamento ricevuto via bonifico bancario.',
      },
    ],
  },
  {
    title: 'Spedizione',
    color: '#2196F3',
    deals: [
      {
        id: 's5',
        title: 'Opus One 2018 + Sassicaia 2015',
        sellerOrBuyer: 'Robert Johnson',
        bottleCount: 2,
        value: 3200,
        type: 'sale',
        daysInStage: 1,
        priority: 'low',
        timestamp: '12h fa',
        bottles: [
          { name: 'Opus One', vintage: 2018, qty: 1 },
          { name: 'Sassicaia', vintage: 2015, qty: 1 },
        ],
        lastMessage: 'Spedizione assicurata programmata per domani.',
      },
    ],
  },
];

const priorityDot: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-[#C9843A]',
  low: 'bg-[#A09E96]',
};

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('acquisitions');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
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
            {totalDeals} deal attivi &middot; {formatCurrency(totalValue)} pipeline
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

      {/* Kanban Board */}
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
                              <span className="text-xs text-[#A09E96] ml-2">{bottle.vintage}</span>
                            </div>
                          </div>
                          <span className="text-xs text-[#A09E96]">x{bottle.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Preview */}
                {selectedDeal.lastMessage && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase text-[#A09E96] tracking-wider">
                      Ultimo messaggio
                    </h4>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                      <MessageSquare className="h-4 w-4 text-[#A09E96] mt-0.5 shrink-0" />
                      <p className="text-sm text-[#EEECE7]/80">{selectedDeal.lastMessage}</p>
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
