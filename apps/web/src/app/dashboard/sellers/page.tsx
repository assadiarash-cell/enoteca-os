'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';
import { formatCurrency } from '@/lib/utils';

interface Seller {
  id: string;
  org_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  seller_type: 'inheritance' | 'collector' | 'restaurant_closure' | 'liquidation' | 'private';
  source_channel: 'whatsapp' | 'email' | 'website' | 'facebook' | 'instagram' | 'phone' | 'referral';
  notes: string | null;
  total_transactions: number;
  total_value: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

const sellerTypeLabels: Record<Seller['seller_type'], string> = {
  inheritance: 'Eredità',
  collector: 'Collezionista',
  restaurant_closure: 'Ristorante/Bar',
  liquidation: 'Liquidazione',
  private: 'Cantina privata',
};

const statusConfig: Record<string, { label: string; variant: 'success' | 'premium' | 'info' | 'neutral' }> = {
  active: { label: 'Attivo', variant: 'success' },
  vip: { label: 'VIP', variant: 'premium' },
  new: { label: 'Nuovo', variant: 'info' },
  lead: { label: 'Lead', variant: 'neutral' },
};

function getSellerStatus(seller: Seller): string {
  if (seller.total_value > 100000) return 'vip';
  if (seller.total_transactions > 0) return 'active';
  const createdAt = new Date(seller.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (seller.total_transactions === 0 && createdAt > thirtyDaysAgo) return 'new';
  return 'lead';
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-bg-tertiary" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-32 rounded bg-bg-tertiary" />
            <div className="h-3 w-20 rounded bg-bg-tertiary" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-36 rounded bg-bg-tertiary" />
          <div className="h-3 w-28 rounded bg-bg-tertiary" />
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-20 rounded bg-bg-tertiary" /></td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-24 rounded bg-bg-tertiary" /></td>
      <td className="px-4 py-3 text-right"><div className="h-4 w-8 rounded bg-bg-tertiary ml-auto" /></td>
      <td className="px-4 py-3 text-right hidden sm:table-cell"><div className="h-4 w-16 rounded bg-bg-tertiary ml-auto" /></td>
      <td className="px-4 py-3 text-center"><div className="h-5 w-14 rounded-full bg-bg-tertiary mx-auto" /></td>
    </tr>
  );
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSellers() {
      try {
        const res = await fetch(`/api/sellers?org_id=${DEMO_ORG_ID}`);
        if (!res.ok) throw new Error('Failed to fetch sellers');
        const json = await res.json();
        setSellers(json.data ?? []);
      } catch (err) {
        console.error('Error fetching sellers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSellers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return sellers;
    const q = search.toLowerCase();
    return sellers.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.province?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q),
    );
  }, [sellers, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Sellers</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {loading ? '...' : `${sellers.length} venditori nel CRM`}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Aggiungi venditore
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Cerca venditori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-md border border-border-medium bg-bg-tertiary pl-10 pr-4 text-body-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 transition-colors"
        />
      </div>

      {/* Sellers table */}
      <div className="rounded-md border border-border-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-secondary">
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Nome
              </th>
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden md:table-cell">
                Contatto
              </th>
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden lg:table-cell">
                Provincia
              </th>
              <th className="text-left text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden lg:table-cell">
                Tipo
              </th>
              <th className="text-right text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Deals
              </th>
              <th className="text-right text-overline uppercase text-text-tertiary tracking-wider px-4 py-3 hidden sm:table-cell">
                Valore totale
              </th>
              <th className="text-center text-overline uppercase text-text-tertiary tracking-wider px-4 py-3">
                Status
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
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-body-sm text-text-tertiary">
                    Nessun venditore trovato
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((seller) => {
                const status = getSellerStatus(seller);
                const config = statusConfig[status] || statusConfig.lead;
                return (
                  <tr
                    key={seller.id}
                    className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-tertiary text-caption text-text-secondary shrink-0">
                          {seller.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-body-sm font-medium text-text-primary truncate">
                            {seller.full_name}
                          </span>
                          <span className="text-caption text-text-tertiary">
                            {sellerTypeLabels[seller.seller_type] ?? seller.seller_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        {seller.email && (
                          <span className="text-caption text-text-secondary flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {seller.email}
                          </span>
                        )}
                        {seller.phone && (
                          <span className="text-caption text-text-tertiary flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {seller.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-body-sm text-text-secondary flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-text-tertiary" /> {seller.province ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-caption text-text-secondary">
                        {sellerTypeLabels[seller.seller_type] ?? seller.seller_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-body-sm text-text-primary">{seller.total_transactions}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className="text-body-sm text-text-primary">
                        {formatCurrency(seller.total_value)}
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
