'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bell, CreditCard, Globe, Plug, Save } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'Generale', icon: Globe },
  { id: 'notifications', label: 'Notifiche', icon: Bell },
  { id: 'integrations', label: 'Integrazioni', icon: Plug },
  { id: 'billing', label: 'Fatturazione', icon: CreditCard },
];

const integrations = [
  { name: 'Supabase', description: 'Database e autenticazione', connected: true },
  { name: 'Stripe', description: 'Pagamenti e fatturazione', connected: true },
  { name: 'Resend', description: 'Email transazionali', connected: true },
  { name: 'PostHog', description: 'Analytics e tracking', connected: false },
  { name: 'WhatsApp Business', description: 'Messaggistica clienti', connected: false },
  { name: 'WineSearcher', description: 'Database prezzi vini', connected: true },
  { name: 'Vivino', description: 'Marketplace vini', connected: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-title-1 text-text-primary">Impostazioni</h1>
        <p className="text-body-sm text-text-secondary mt-1">
          Configura il tuo account e le integrazioni
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-body-sm font-medium transition-all border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-accent-secondary border-accent-primary'
                : 'text-text-secondary hover:text-text-primary border-transparent'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-3xl">
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profilo azienda</CardTitle>
                <CardDescription>Informazioni della tua attività</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Nome azienda</label>
                  <Input id="company" defaultValue="Vini Antichi S.r.l." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="vat" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">P.IVA</label>
                  <Input id="vat" defaultValue="IT12345678901" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Città</label>
                    <Input id="city" defaultValue="Milano" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="province" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Provincia</label>
                    <Input id="province" defaultValue="MI" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Indirizzo</label>
                  <Input id="address" defaultValue="Via Monte Napoleone 42" />
                </div>
                <Button className="w-fit">
                  <Save className="h-4 w-4" />
                  Salva modifiche
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account operatore</CardTitle>
                <CardDescription>Le tue credenziali di accesso</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="op-name" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Nome completo</label>
                  <Input id="op-name" defaultValue="Marco Albertini" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="op-email" className="text-[12px] text-[#A09E96] uppercase tracking-wider font-medium">Email</label>
                  <Input id="op-email" type="email" defaultValue="marco@viniantichi.it" />
                </div>
                <Button variant="outline" className="w-fit">
                  Cambia password
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Preferenze notifiche</CardTitle>
              <CardDescription>Scegli come ricevere le notifiche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col divide-y divide-border-subtle">
                {[
                  { title: 'Nuove richieste di valutazione', desc: 'Quando un venditore invia una richiesta', email: true, push: true },
                  { title: 'Offerte ricevute', desc: 'Quando un buyer fa un\'offerta', email: true, push: true },
                  { title: 'Deal completati', desc: 'Conferma completamento acquisizioni/vendite', email: true, push: false },
                  { title: 'Alert margini', desc: 'Quando un margine scende sotto soglia', email: false, push: true },
                  { title: 'Report settimanale', desc: 'Riepilogo performance settimanale', email: true, push: false },
                  { title: 'Aggiornamenti AI', desc: 'Notifiche dagli agenti AI', email: false, push: true },
                ].map((pref) => (
                  <div
                    key={pref.title}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body-sm text-text-primary">{pref.title}</span>
                      <span className="text-caption text-text-tertiary">{pref.desc}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-caption text-text-secondary">
                        <input
                          type="checkbox"
                          defaultChecked={pref.email}
                          className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
                        />
                        Email
                      </label>
                      <label className="flex items-center gap-2 text-caption text-text-secondary">
                        <input
                          type="checkbox"
                          defaultChecked={pref.push}
                          className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
                        />
                        Push
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <div className="flex flex-col gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-bg-tertiary text-caption font-bold text-text-secondary">
                      {integration.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body-sm font-medium text-text-primary">
                        {integration.name}
                      </span>
                      <span className="text-caption text-text-tertiary">
                        {integration.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.connected ? (
                      <>
                        <Badge variant="success">Connesso</Badge>
                        <Button variant="ghost" size="sm">
                          Configura
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connetti
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Piano corrente</CardTitle>
                    <CardDescription>Il tuo abbonamento attivo</CardDescription>
                  </div>
                  <Badge variant="premium">Pro</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                    <span className="text-overline text-text-tertiary uppercase">Costo mensile</span>
                    <span className="text-title-2 text-text-primary">€299</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                    <span className="text-overline text-text-tertiary uppercase">Prossimo rinnovo</span>
                    <span className="text-body-sm text-text-primary">1 Aprile 2025</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                    <span className="text-overline text-text-tertiary uppercase">Metodo pagamento</span>
                    <span className="text-body-sm text-text-primary">Visa **** 4242</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Cambia piano</Button>
                  <Button variant="ghost">Storico fatture</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilizzo</CardTitle>
                <CardDescription>Consumi del periodo corrente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Bottiglie in inventario', used: 272, limit: 500 },
                    { label: 'Valutazioni AI / mese', used: 89, limit: 200 },
                    { label: 'Operatori', used: 3, limit: 5 },
                    { label: 'Storage foto', used: 4.2, limit: 10, unit: 'GB' },
                  ].map((usage) => (
                    <div key={usage.label} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-body-sm text-text-primary">{usage.label}</span>
                        <span className="text-caption text-text-secondary">
                          {usage.used}{usage.unit ? ` ${usage.unit}` : ''} / {usage.limit}{usage.unit ? ` ${usage.unit}` : ''}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            (usage.used / usage.limit) > 0.8
                              ? 'bg-semantic-warning'
                              : 'bg-accent-primary'
                          )}
                          style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}