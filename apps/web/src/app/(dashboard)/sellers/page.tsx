import { Plus, Search, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sellers = [
  {
    name: 'Giovanni Bianchi',
    email: 'g.bianchi@email.it',
    phone: '+39 333 1234567',
    province: 'Verona',
    type: 'Cantina privata',
    totalDeals: 3,
    totalValue: 42000,
    status: 'active',
    lastContact: '2 giorni fa',
  },
  {
    name: 'Maria Conti',
    email: 'm.conti@email.it',
    phone: '+39 347 9876543',
    province: 'Milano',
    type: 'Eredità',
    totalDeals: 1,
    totalValue: 18500,
    status: 'active',
    lastContact: '5 giorni fa',
  },
  {
    name: 'Paolo Rossi',
    email: 'p.rossi@email.it',
    phone: '+39 329 5551234',
    province: 'Firenze',
    type: 'Cantina privata',
    totalDeals: 7,
    totalValue: 128000,
    status: 'vip',
    lastContact: '1 giorno fa',
  },
  {
    name: 'Trattoria Da Enzo',
    email: 'info@trattoriadaenzo.it',
    phone: '+39 06 5551234',
    province: 'Roma',
    type: 'Ristorante/Bar',
    totalDeals: 2,
    totalValue: 15600,
    status: 'active',
    lastContact: '1 settimana fa',
  },
  {
    name: 'Carlo Verdi',
    email: 'c.verdi@email.it',
    phone: '+39 340 1112233',
    province: 'Torino',
    type: 'Cantina privata',
    totalDeals: 1,
    totalValue: 9600,
    status: 'new',
    lastContact: '3 giorni fa',
  },
  {
    name: 'Elena Marchetti',
    email: 'e.marchetti@email.it',
    phone: '+39 338 4445566',
    province: 'Bologna',
    type: 'Eredità',
    totalDeals: 0,
    totalValue: 0,
    status: 'lead',
    lastContact: '10 giorni fa',
  },
  {
    name: 'Ristorante Belvedere',
    email: 'info@belvedere.it',
    phone: '+39 045 7778899',
    province: 'Verona',
    type: 'Ristorante/Bar',
    totalDeals: 4,
    totalValue: 56000,
    status: 'active',
    lastContact: '4 giorni fa',
  },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'premium' | 'info' | 'neutral' }> = {
  active: { label: 'Attivo', variant: 'success' },
  vip: { label: 'VIP', variant: 'premium' },
  new: { label: 'Nuovo', variant: 'info' },
  lead: { label: 'Lead', variant: 'neutral' },
};

export default function SellersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Sellers</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {sellers.length} venditori nel CRM
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
            {sellers.map((seller) => {
              const config = statusConfig[seller.status] || statusConfig.active;
              return (
                <tr
                  key={seller.email}
                  className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-tertiary text-caption text-text-secondary shrink-0">
                        {seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-body-sm font-medium text-text-primary truncate">
                          {seller.name}
                        </span>
                        <span className="text-caption text-text-tertiary">
                          {seller.lastContact}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-caption text-text-secondary flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {seller.email}
                      </span>
                      <span className="text-caption text-text-tertiary flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {seller.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-body-sm text-text-secondary flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-text-tertiary" /> {seller.province}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-caption text-text-secondary">{seller.type}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-body-sm text-text-primary">{seller.totalDeals}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="text-body-sm text-text-primary">
                      €{(seller.totalValue / 1000).toFixed(0)}K
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
