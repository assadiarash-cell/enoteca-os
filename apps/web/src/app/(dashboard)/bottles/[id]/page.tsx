import { ArrowLeft, Brain, TrendingUp, History, Edit, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

// Placeholder data for the bottle detail
const bottle = {
  name: 'Romanée-Conti',
  vintage: '1998',
  producer: 'Domaine de la Romanée-Conti',
  category: 'Vino Rosso',
  region: 'Borgogna, Francia',
  appellation: 'Romanée-Conti Grand Cru',
  alcohol: '13.5%',
  volume: '750ml',
  status: 'listed' as const,
  condition: 'Eccellente',
  acquisitionPrice: 11800,
  currentPrice: 14500,
  marketLow: 13200,
  marketHigh: 16800,
  margin: 22,
  aiConfidence: 96,
  aiNotes:
    'Etichetta in ottime condizioni, livello di riempimento alto spalla. Capsula integra senza segni di manipolazione. Annata eccezionale per la Borgogna.',
  provenance: 'Cantina privata, Verona',
  acquiredDate: '2024-11-15',
};

const timeline = [
  { date: '15 Mar 2025', event: 'Pubblicazione sul marketplace', type: 'info' as const },
  { date: '12 Mar 2025', event: 'Prezzo aggiornato a €14.500', type: 'warning' as const },
  { date: '8 Mar 2025', event: 'Valutazione AI completata — Confidenza 96%', type: 'success' as const },
  { date: '5 Mar 2025', event: 'Foto professionali caricate', type: 'neutral' as const },
  { date: '15 Nov 2024', event: 'Acquisizione — €11.800', type: 'premium' as const },
  { date: '12 Nov 2024', event: 'Valutazione iniziale richiesta', type: 'neutral' as const },
];

export default function BottleDetailPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Back button & actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/bottles"
          className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle bottiglie
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
            Modifica
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
            Condividi
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="h-4 w-4" />
            Elimina
          </Button>
        </div>
      </div>

      {/* Hero area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] rounded-lg border border-border-subtle bg-bg-secondary flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-3 text-text-tertiary">
              <div className="h-48 w-12 rounded-sm bg-accent-wine/20" />
              <span className="text-caption">Foto principale</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="premium">In vendita</Badge>
              <Badge variant="success">Eccellente</Badge>
            </div>
            <h1 className="text-hero text-text-primary">
              {bottle.name}{' '}
              <span className="text-text-secondary">{bottle.vintage}</span>
            </h1>
            <p className="text-body-lg text-text-secondary">{bottle.producer}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Categoria', value: bottle.category },
              { label: 'Regione', value: bottle.region },
              { label: 'Denominazione', value: bottle.appellation },
              { label: 'Volume', value: bottle.volume },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-overline text-text-tertiary uppercase">
                  {item.label}
                </span>
                <span className="text-body-sm text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>

          {/* AI Analysis Card */}
          <Card className="border-accent-primary/20 bg-accent-primary/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-title-3">
                <Brain className="h-5 w-5 text-accent-primary" />
                Analisi AI
                <Badge variant="premium">{bottle.aiConfidence}% confidenza</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-text-secondary">
                {bottle.aiNotes}
              </p>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-title-3">
                <TrendingUp className="h-5 w-5 text-semantic-success" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-overline text-text-tertiary uppercase">
                    Prezzo acquisizione
                  </span>
                  <span className="text-title-3 text-text-primary">
                    {formatCurrency(bottle.acquisitionPrice)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-overline text-text-tertiary uppercase">
                    Prezzo corrente
                  </span>
                  <span className="text-title-3 text-accent-secondary">
                    {formatCurrency(bottle.currentPrice)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-overline text-text-tertiary uppercase">
                    Range mercato
                  </span>
                  <span className="text-body-sm text-text-primary">
                    {formatCurrency(bottle.marketLow)} – {formatCurrency(bottle.marketHigh)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-overline text-text-tertiary uppercase">
                    Margine
                  </span>
                  <span className="text-title-3 text-semantic-success">
                    +{bottle.margin}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-title-3">
            <History className="h-5 w-5 text-text-secondary" />
            Cronologia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-6 last:pb-0 relative"
              >
                {/* Timeline line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border-subtle" />
                )}
                <div className="mt-1.5 shrink-0">
                  <Badge variant={item.type} className="h-4 w-4 p-0 rounded-full flex items-center justify-center">
                    <span className="sr-only">{item.type}</span>
                  </Badge>
                </div>
                <div className="flex flex-1 items-start justify-between gap-4">
                  <span className="text-body-sm text-text-primary">
                    {item.event}
                  </span>
                  <span className="text-caption text-text-tertiary whitespace-nowrap shrink-0">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
