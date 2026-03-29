import { Plus, Search, Globe, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const buyers = [
  {
    name: 'Alexander Schmidt',
    email: 'a.schmidt@weinhaus.de',
    country: 'Germania',
    segment: 'Premium',
    totalPurchases: 12,
    totalSpent: 186000,
    avgOrder: 15500,
    lastPurchase: '1 giorno fa',
    status: 'premium',
  },
  {
    name: 'Tanaka Yuki',
    email: 'yuki@sake-imports.jp',
    country: 'Giappone',
    segment: 'Enterprise',
    totalPurchases: 28,
    totalSpent: 342000,
    avgOrder: 12214,
    lastPurchase: '4 giorni fa',
    status: 'enterprise',
  },
  {
    name: 'James Williams',
    email: 'j.williams@londonwines.uk',
    country: 'Regno Unito',
    segment: 'Premium',
    totalPurchases: 8,
    totalSpent: 94000,
    avgOrder: 11750,
    lastPurchase: '6 giorni fa',
    status: 'premium',
  },
  {
    name: 'Chen Wei',
    email: 'chen.wei@hkfinearts.hk',
    country: 'Hong Kong',
    segment: 'Enterprise',
    totalPurchases: 45,
    totalSpent: 520000,
    avgOrder: 11555,
    lastPurchase: '2 giorni fa',
    status: 'enterprise',
  },
  {
    name: 'Robert Johnson',
    email: 'rjohnson@collector.us',
    country: 'Stati Uniti',
    segment: 'Standard',
    totalPurchases: 3,
    totalSpent: 18600,
    avgOrder: 6200,
    lastPurchase: '1 settimana fa',
    status: 'standard',
  },
  {
    name: 'Sophie Dubois',
    email: 's.dubois@caviste.fr',
    country: 'Francia',
    segment: 'Premium',
    totalPurchases: 15,
    totalSpent: 198000,
    avgOrder: 13200,
    lastPurchase: '3 giorni fa',
    status: 'premium',
  },
  {
    name: 'Marco Ferrero',
    email: 'm.ferrero@enoteca.it',
    country: 'Italia',
    segment: 'Standard',
    totalPurchases: 6,
    totalSpent: 32000,
    avgOrder: 5333,
    lastPurchase: '2 settimane fa',
    status: 'standard',
  },
];

const statusConfig: Record<string, { label: string; variant: 'premium' | 'wine' | 'neutral' }> = {
  enterprise: { label: 'Enterprise', variant: 'wine' },
  premium: { label: 'Premium', variant: 'premium' },
  standard: { label: 'Standard', variant: 'neutral' },
};

export default function BuyersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Buyers</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {buyers.length} buyer nel CRM
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
            {buyers.map((buyer) => {
              const config = statusConfig[buyer.status] || statusConfig.standard;
              return (
                <tr
                  key={buyer.email}
                  className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-tertiary text-caption text-text-secondary shrink-0">
                        {buyer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-body-sm font-medium text-text-primary truncate">
                            {buyer.name}
                          </span>
                          {buyer.status === 'enterprise' && (
                            <Star className="h-3 w-3 text-accent-primary fill-accent-primary shrink-0" />
                          )}
                        </div>
                        <span className="text-caption text-text-tertiary flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {buyer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-body-sm text-text-secondary flex items-center gap-1">
                      <Globe className="h-3 w-3 text-text-tertiary" /> {buyer.country}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-body-sm text-text-primary">{buyer.totalPurchases}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="text-body-sm font-medium text-accent-secondary">
                      €{(buyer.totalSpent / 1000).toFixed(0)}K
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-body-sm text-text-primary">
                      €{buyer.avgOrder.toLocaleString('it-IT')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
