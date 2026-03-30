'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  History,
  Edit,
  Share2,
  Trash2,
  ShieldCheck,
  BarChart3,
  MapPin,
  Grape,
  Droplets,
  Tag,
  Calendar,
  Camera,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

/* ── Bottle data ── */
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
  lotNumber: 'RC-1998-0047',
};

/* ── Timeline events with icons ── */
const timeline = [
  { date: '15 Mar 2025', event: 'Pubblicazione sul marketplace', type: 'info' as const, icon: ExternalLink },
  { date: '12 Mar 2025', event: 'Prezzo aggiornato a €14.500', type: 'warning' as const, icon: Tag },
  { date: '8 Mar 2025', event: 'Valutazione AI completata — Confidenza 96%', type: 'success' as const, icon: Brain },
  { date: '5 Mar 2025', event: 'Foto professionali caricate', type: 'neutral' as const, icon: Camera },
  { date: '15 Nov 2024', event: 'Acquisizione — €11.800', type: 'premium' as const, icon: Package },
  { date: '12 Nov 2024', event: 'Valutazione iniziale richiesta', type: 'neutral' as const, icon: Clock },
];

/* ── Timeline event color map ── */
const typeColors: Record<string, { dot: string; line: string; iconBg: string; iconText: string }> = {
  info: { dot: 'bg-info', line: 'bg-info/20', iconBg: 'bg-info/10', iconText: 'text-info' },
  warning: { dot: 'bg-warning', line: 'bg-warning/20', iconBg: 'bg-warning/10', iconText: 'text-warning' },
  success: { dot: 'bg-success', line: 'bg-success/20', iconBg: 'bg-success/10', iconText: 'text-success' },
  neutral: { dot: 'bg-text-tertiary', line: 'bg-border-subtle', iconBg: 'bg-bg-tertiary', iconText: 'text-text-tertiary' },
  premium: { dot: 'bg-accent-copper', line: 'bg-accent-copper/20', iconBg: 'bg-accent-copper/10', iconText: 'text-accent-copper' },
};

/* ── Detail row specs ── */
const specs = [
  { label: 'Categoria', value: bottle.category, icon: Grape },
  { label: 'Regione', value: bottle.region, icon: MapPin },
  { label: 'Denominazione', value: bottle.appellation, icon: Star },
  { label: 'Alcol', value: bottle.alcohol, icon: Droplets },
  { label: 'Volume', value: bottle.volume, icon: Package },
  { label: 'Lotto', value: bottle.lotNumber, icon: Tag },
];

export default function BottleDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'history'>('overview');

  /* Compute market position as percentage for the slider */
  const marketRange = bottle.marketHigh - bottle.marketLow;
  const currentPosition = ((bottle.currentPrice - bottle.marketLow) / marketRange) * 100;
  const clampedPosition = Math.max(0, Math.min(100, currentPosition));

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* ── Navigation & Actions ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/bottles"
          className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-accent-copper transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Torna alle bottiglie
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
            <Edit className="h-4 w-4" />
            Modifica
          </Button>
          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
            <Share2 className="h-4 w-4" />
            Condividi
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Elimina
          </Button>
        </div>
      </div>

      {/* ── Hero: Image + Core Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bottle image with gradient overlay */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[3/4] rounded-xl border border-border-subtle bg-gradient-to-b from-bg-tertiary to-bg-secondary flex items-center justify-center overflow-hidden group">
            {/* Bottle silhouette placeholder */}
            <div className="flex flex-col items-center gap-3 text-text-tertiary">
              <div className="relative">
                <div className="h-52 w-14 rounded-t-full bg-accent-wine/15 group-hover:bg-accent-wine/25 transition-colors shadow-inner" />
                <div className="h-4 w-10 mx-auto -mt-0.5 bg-accent-wine/10 rounded-b-sm" />
              </div>
              <span className="text-caption text-text-disabled">Foto principale</span>
            </div>
            {/* Condition badge overlaid on image */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span className="text-caption font-semibold text-success">{bottle.condition}</span>
              </div>
            </div>
            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 rounded-full bg-accent-copper/10 border border-accent-copper/20 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-copper" />
                <span className="text-caption font-semibold text-accent-copper">In vendita</span>
              </div>
            </div>
            {/* Subtle gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-secondary/80 to-transparent" />
          </div>
        </div>

        {/* Info column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Title block */}
          <div className="flex flex-col gap-2">
            <span className="text-overline text-accent-copper">{bottle.producer}</span>
            <h1 className="text-hero text-text-primary leading-tight">
              {bottle.name}{' '}
              <span className="text-text-tertiary">{bottle.vintage}</span>
            </h1>
            <p className="text-body-lg text-text-secondary">{bottle.appellation}</p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="flex items-start gap-3 p-3 rounded-lg bg-bg-tertiary/50">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg-quaternary">
                    <Icon className="h-4 w-4 text-text-tertiary" />
                  </div>
                  <div className="flex flex-col gap-0">
                    <span className="text-[10px] uppercase tracking-wider text-text-disabled font-medium">
                      {spec.label}
                    </span>
                    <span className="text-body-sm text-text-primary">{spec.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── AI Analysis Card ── */}
          <div className="rounded-xl border border-accent-copper/15 bg-accent-copper/[0.03] p-5">
            <div className="flex items-start gap-4">
              {/* Circular confidence score */}
              <div className="shrink-0">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  {/* Background circle */}
                  <svg className="absolute inset-0 h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-bg-quaternary"
                    />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={`${(bottle.aiConfidence / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                      strokeLinecap="round"
                      className="text-accent-copper"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-title-3 font-bold text-accent-copper">{bottle.aiConfidence}</span>
                    <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Score</span>
                  </div>
                </div>
              </div>

              {/* Analysis text */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent-copper" />
                  <h3 className="text-title-3 text-text-primary font-semibold">Analisi AI</h3>
                </div>
                <p className="text-body-sm text-text-secondary leading-relaxed">
                  {bottle.aiNotes}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-caption text-text-tertiary">Provenienza:</span>
                  <span className="text-caption text-text-primary font-medium">{bottle.provenance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing card */}
        <Card className="border-border-subtle bg-bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-title-3">
              <TrendingUp className="h-5 w-5 text-success" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Price row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-overline text-text-tertiary">PREZZO ACQUISIZIONE</span>
                <span className="text-title-2 text-text-primary">{formatCurrency(bottle.acquisitionPrice)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-overline text-text-tertiary">PREZZO CORRENTE</span>
                <span className="text-title-2 text-accent-copper">{formatCurrency(bottle.currentPrice)}</span>
              </div>
            </div>

            {/* Margin badge */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
              <div className="flex flex-col">
                <span className="text-body-sm text-text-primary font-medium">Margine +{bottle.margin}%</span>
                <span className="text-caption text-text-tertiary">
                  Profitto: {formatCurrency(bottle.currentPrice - bottle.acquisitionPrice)}
                </span>
              </div>
            </div>

            {/* Market range slider */}
            <div className="flex flex-col gap-3">
              <span className="text-overline text-text-tertiary">RANGE DI MERCATO</span>
              <div className="relative">
                {/* Track */}
                <div className="h-2 rounded-full bg-bg-quaternary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-wine via-accent-copper to-accent-gold"
                    style={{ width: '100%' }}
                  />
                </div>
                {/* Current price indicator */}
                <div
                  className="absolute -top-1 w-4 h-4 rounded-full bg-accent-copper border-2 border-bg-secondary shadow-lg shadow-accent-copper/30 transform -translate-x-1/2"
                  style={{ left: `${clampedPosition}%` }}
                />
                {/* Labels */}
                <div className="flex justify-between mt-3">
                  <span className="text-caption text-text-tertiary">{formatCurrency(bottle.marketLow)}</span>
                  <span className="text-caption text-accent-copper font-medium">
                    {formatCurrency(bottle.currentPrice)}
                  </span>
                  <span className="text-caption text-text-tertiary">{formatCurrency(bottle.marketHigh)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key metrics card */}
        <Card className="border-border-subtle bg-bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-title-3">
              <BarChart3 className="h-5 w-5 text-accent-gold" />
              Metriche
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Metric rows */}
            {[
              { label: 'Apprezzamento', value: '+22.9%', sublabel: 'dal momento dell\'acquisizione', color: 'text-success' },
              { label: 'Giorni in inventario', value: '135', sublabel: 'acquisita il 15 Nov 2024', color: 'text-text-primary' },
              { label: 'Visualizzazioni marketplace', value: '847', sublabel: 'ultime 30 giorni', color: 'text-info' },
              { label: 'Offerte ricevute', value: '3', sublabel: 'ultima: 2 ore fa', color: 'text-accent-copper' },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors">
                <div className="flex flex-col gap-0">
                  <span className="text-body-sm text-text-primary">{metric.label}</span>
                  <span className="text-caption text-text-tertiary">{metric.sublabel}</span>
                </div>
                <span className={cn('text-title-3 font-semibold', metric.color)}>{metric.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── History Timeline ── */}
      <Card className="border-border-subtle bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-title-3">
            <History className="h-5 w-5 text-text-secondary" />
            Cronologia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {timeline.map((item, i) => {
              const colors = typeColors[item.type] || typeColors.neutral;
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 pb-8 last:pb-0 relative group"
                >
                  {/* Vertical connector line */}
                  {i < timeline.length - 1 && (
                    <div className={cn('absolute left-[17px] top-10 bottom-0 w-px', colors.line)} />
                  )}

                  {/* Icon circle */}
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                    colors.iconBg,
                    'group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-offset-bg-secondary',
                  )}
                    style={{ '--tw-ring-color': `${colors.dot.replace('bg-', '')}` } as React.CSSProperties}
                  >
                    <Icon className={cn('h-4 w-4', colors.iconText)} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 items-start justify-between gap-4 pt-1.5">
                    <span className="text-body-sm text-text-primary group-hover:text-accent-copper transition-colors">
                      {item.event}
                    </span>
                    <span className="text-caption text-text-tertiary whitespace-nowrap shrink-0">
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
