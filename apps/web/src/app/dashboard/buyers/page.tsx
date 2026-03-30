'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Globe, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';
import { formatCurrency } from '@/lib/utils';

interface Buyer {
  id: string;
  org_id: string;
  full_name: string;
  company_name: string | null;
  buyer_type: 'dealer_international' | 'dealer_domestic' | 'collector' | 'restaurant' | 'bar';
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  preferences: Record<string, unknown> | null;
  total_purchases: number;
  total_spent: number;
  avg_deal_value: number;
  payment_reliability: number | null;
  last_purchase_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const segmentConfig: Record<string, { label: string; variant: 'wine' | 'premium' | 'neutral' }> = {
  enterprise: { label: 'Enterprise', variant: 'wine' },
  premium: { label: 'Premium', variant: 'premium' },
  standard: { label: 'Standard', variant: 'neutral' },
};

function getBuyerSegment(buyer: Buyer): string {
  if (buyer.total_spent > 300000) return 'enterprise';
  if (buyer.total_spent > 100000) return 'premium';
  return 'standard';
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-bg-tertiary" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-32 rounded bg-bg-tertiary" />
            <div className="h-3 w-36 rounded bg-bg-tertiary" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-24 rounded bg-bg-tertiary" /></td>
      <td className="px-4 py-3 text-right"><div className="h-4 w-8 rounded bg-bg-tertiary ml-auto" /></td>
      <td className="px-4 py-3 text-right hidden sm:table-cell"><div className="h-4 w-16 rounded bg-bg-tertiary ml-auto" /></td>
      <td className="px-4 py-3 text-right hidden lg:table-cell"><div className="h-4 w-16 rounded bg-bg-tertiary ml-auto" /></td>
      <td className="px-4 py-3 text-center"><div className="h-5 w-16 rounded-full bg-bg-tertiary mx-auto" /></td>
    </tr>
  );
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchBuyers() {
      try {
        const res = await fetch(`/api/buyers?org_id=${DEMO_ORG_ID}`);
        if (!res.ok) throw new Error('Failed to fetch buyers');
        const json = await res.json();
        setBuyers(json.data ?? []);
      } catch (err) {
        console.error('Error fetching buyers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBuyers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return buyers;
    const q = search.toLowerCase();
    return buyers.filter(
      (b) =>
        b.full_name.toLowerCase().includes(q) ||
        b.company_name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.country?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q),
    );
  }, [buyers, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Buyers</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {loading ? '...' : `${buyers.length} buyer nel CRM`}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Aggiungi buyer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Cerca buyer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-md border border-border-medium bg-bg-tertiary pl-10 pr-4 text-body-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 transition-colors"
        />
      </div>

      {/* Buyers table */}
      <div className="rounded-md border border-border-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-secondary">
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Buyer
              </th>
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden md:table-cell">
                Paese
              </th>
              <th className="text-right text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Acquisti
              </th>
              <th className="text-right text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden sm:table-cell">
                Totale speso
              </th>
              <th className="text-right text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden lg:table-cell">
                Ordine medio
              </th>
              <th className="text-center text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Segmento
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-body-sm text-text-tertiary">
                    Nessun buyer trovato
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((buyer) => {
                const segment = getBuyerSegment(buyer);
                const config = segmentConfig[segment] || segmentConfig.standard;
                return (
                  <tr
                    key={buyer.id}
                    className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-tertiary text-caption text-text-secondary shrink-0">
                          {buyer.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-body-sm font-medium text-text-primary truncate">
                              {buyer.full_name}
                            </span>
                            {segment === 'enterprise' && (
                              <Star className="h-3 w-3 text-accent-primary fill-accent-primary shrink-0" />
                            )}
                          </div>
                          <span className="text-caption text-text-tertiary flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {buyer.email ?? '—'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-body-sm text-text-secondary flex items-center gap-1">
                        <Globe className="h-3 w-3 text-text-tertiary" /> {buyer.country ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-body-sm text-text-primary">{buyer.total_purchases}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className="text-body-sm font-medium text-accent-secondary">
                        {formatCurrency(buyer.total_spent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-body-sm text-text-primary">
                        {formatCurrency(buyer.avg_deal_value)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
