'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';

/* ── Status label map ── */
const STATUS_LABELS: Record<string, string> = {
  pending_valuation: 'In attesa valutazione',
  valued: 'Valutata',
  acquired: 'Acquisita',
  in_inventory: 'In magazzino',
  listed: 'In vendita',
  reserved: 'Riservata',
  sold: 'Venduta',
};

/* ── Timeline event color map ── */
const typeColors: Record<string, { dot: string; line: string; iconBg: string; iconText: string }> = {
  info: { dot: 'bg-info', line: 'bg-info/20', iconBg: 'bg-info/10', iconText: 'text-info' },
  warning: { dot: 'bg-warning', line: 'bg-warning/20', iconBg: 'bg-warning/10', iconText: 'text-warning' },
  success: { dot: 'bg-success', line: 'bg-success/20', iconBg: 'bg-success/10', iconText: 'text-success' },
  neutral: { dot: 'bg-text-tertiary', line: 'bg-border-subtle', iconBg: 'bg-bg-tertiary', iconText: 'text-text-tertiary' },
  premium: { dot: 'bg-accent-copper', line: 'bg-accent-copper/20', iconBg: 'bg-accent-copper/10', iconText: 'text-accent-copper' },
};

/* ── Timeline icon map ── */
const timelineIconMap: Record<string, typeof ExternalLink> = {
  sold_at: CheckCircle,
  listed_at: ExternalLink,
  valued_at: Brain,
  acquired_at: Package,
  created_at: Clock,
};

const timelineTypeMap: Record<string, string> = {
  sold_at: 'success',
  listed_at: 'info',
  valued_at: 'warning',
  acquired_at: 'premium',
  created_at: 'neutral',
};

const timelineLabelMap: Record<string, string> = {
  sold_at: 'Venduta',
  listed_at: 'Pubblicazione sul marketplace',
  valued_at: 'Valutazione AI completata',
  acquired_at: 'Acquisizione',
  created_at: 'Inserita nel sistema',
};

/* ── Helpers ── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildTimeline(bottle: Record<string, unknown>) {
  const keys = ['sold_at', 'listed_at', 'valued_at', 'acquired_at', 'created_at'] as const;
  const events: { date: string; event: string; type: string; icon: typeof ExternalLink }[] = [];

  for (const key of keys) {
    const ts = bottle[key];
    if (ts && typeof ts === 'string') {
      events.push({
        date: formatDate(ts),
        event: timelineLabelMap[key],
        type: timelineTypeMap[key],
        icon: timelineIconMap[key],
      });
    }
  }

  return events;
}

/* ── Condition label ── */
function conditionLabel(c: string | null | undefined): string {
  if (!c) return '';
  const map: Record<string, string> = {
    excellent: 'Eccellente',
    good: 'Buona',
    fair: 'Discreta',
    poor: 'Scarsa',
  };
  return map[c] || c;
}

/* ── Loading skeleton ── */
function BottleSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-bg-tertiary animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded bg-bg-tertiary animate-pulse" />
          <div className="h-9 w-24 rounded bg-bg-tertiary animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] rounded-xl bg-bg-tertiary animate-pulse" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-48 rounded bg-bg-tertiary animate-pulse" />
            <div className="h-10 w-72 rounded bg-bg-tertiary animate-pulse" />
            <div className="h-5 w-56 rounded bg-bg-tertiary animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-bg-tertiary animate-pulse" />
            ))}
          </div>
          <div className="h-32 rounded-xl bg-bg-tertiary animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-xl bg-bg-tertiary animate-pulse" />
        <div className="h-64 rounded-xl bg-bg-tertiary animate-pulse" />
      </div>
    </div>
  );
}

/* ── 404 state ── */
function BottleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-tertiary">
        <AlertCircle className="h-10 w-10 text-text-tertiary" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-title-2 text-text-primary">Bottiglia non trovata</h2>
        <p className="text-body-sm text-text-secondary max-w-sm">
          La bottiglia richiesta non esiste o non hai i permessi per visualizzarla.
        </p>
      </div>
      <Link href="/dashboard/bottles">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Torna alle bottiglie
        </Button>
      </Link>
    </div>
  );
}

/* ── Main page component ── */
export default function BottleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [bottle, setBottle] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchBottle() {
      try {
        const res = await fetch(`/api/bottles/${id}`, {
          headers: { 'x-org-id': DEMO_ORG_ID },
        });
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setBottle(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBottle();
  }, [id]);

  if (loading) return <BottleSkeleton />;
  if (notFound || !bottle) return <BottleNotFound />;

  /* ── Derived values ── */
  const purchasePrice = bottle.purchase_price ? Number(bottle.purchase_price) : null;
  const targetSellPrice = bottle.target_sell_price ? Number(bottle.target_sell_price) : null;
  const marketLow = bottle.market_price_low ? Number(bottle.market_price_low) : null;
  const marketHigh = bottle.market_price_high ? Number(bottle.market_price_high) : null;

  const margin =
    purchasePrice && targetSellPrice
      ? Math.round(((targetSellPrice - purchasePrice) / purchasePrice) * 100)
      : null;

  const profit =
    purchasePrice != null && targetSellPrice != null ? targetSellPrice - purchasePrice : null;

  const marketRange = marketLow != null && marketHigh != null ? marketHigh - marketLow : 0;
  const currentPosition =
    targetSellPrice != null && marketLow != null && marketRange > 0
      ? ((targetSellPrice - marketLow) / marketRange) * 100
      : 50;
  const clampedPosition = Math.max(0, Math.min(100, currentPosition));

  const aiConfidence = bottle.authenticity_score ?? null;
  const aiNotes = bottle.notes || bottle.ai_description || null;
  const provenance = [bottle.seller?.city, bottle.seller?.province].filter(Boolean).join(', ') || null;
  const statusLabel = STATUS_LABELS[bottle.status] || bottle.status;
  const overallCondition = conditionLabel(bottle.overall_condition);

  const timeline = buildTimeline(bottle);

  const daysInInventory =
    bottle.acquired_at
      ? Math.floor((Date.now() - new Date(bottle.acquired_at).getTime()) / (1000 * 60 * 60 * 24))
      : null;

  /* ── Specs grid ── */
  const specs = [
    { label: 'Categoria', value: bottle.category, icon: Grape },
    { label: 'Regione', value: [bottle.region, bottle.country].filter(Boolean).join(', '), icon: MapPin },
    { label: 'Denominazione', value: bottle.denomination, icon: Star },
    { label: 'Formato', value: bottle.format, icon: Package },
    { label: 'Chiusura', value: bottle.closure_type, icon: Droplets },
    { label: 'Data acquisizione', value: bottle.acquired_at ? formatDate(bottle.acquired_at) : '-', icon: Calendar },
  ].filter((s) => s.value);

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
            {bottle.primary_photo ? (
              <Image
                src={bottle.primary_photo}
                alt={`${bottle.producer} ${bottle.name} ${bottle.vintage}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            ) : (
              /* Bottle silhouette placeholder */
              <div className="flex flex-col items-center gap-3 text-text-tertiary">
                <div className="relative">
                  <div className="h-52 w-14 rounded-t-full bg-accent-wine/15 group-hover:bg-accent-wine/25 transition-colors shadow-inner" />
                  <div className="h-4 w-10 mx-auto -mt-0.5 bg-accent-wine/10 rounded-b-sm" />
                </div>
                <span className="text-caption text-text-disabled">Foto principale</span>
              </div>
            )}
            {/* Condition badge overlaid on image */}
            {overallCondition && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  <span className="text-caption font-semibold text-success">{overallCondition}</span>
                </div>
              </div>
            )}
            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 rounded-full bg-accent-copper/10 border border-accent-copper/20 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-copper" />
                <span className="text-caption font-semibold text-accent-copper">{statusLabel}</span>
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
            {bottle.denomination && (
              <p className="text-body-lg text-text-secondary">{bottle.denomination}</p>
            )}
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
          {(aiConfidence != null || aiNotes) && (
            <div className="rounded-xl border border-accent-copper/15 bg-accent-copper/[0.03] p-5">
              <div className="flex items-start gap-4">
                {/* Circular confidence score */}
                {aiConfidence != null && (
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
                          strokeDasharray={`${(aiConfidence / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                          strokeLinecap="round"
                          className="text-accent-copper"
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="text-title-3 font-bold text-accent-copper">{aiConfidence}</span>
                        <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Score</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis text */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent-copper" />
                    <h3 className="text-title-3 text-text-primary font-semibold">Analisi AI</h3>
                  </div>
                  {aiNotes && (
                    <p className="text-body-sm text-text-secondary leading-relaxed">
                      {aiNotes}
                    </p>
                  )}
                  {provenance && (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-caption text-text-tertiary">Provenienza:</span>
                      <span className="text-caption text-text-primary font-medium">{provenance}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                <span className="text-title-2 text-text-primary">
                  {purchasePrice != null ? formatCurrency(purchasePrice) : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-overline text-text-tertiary">PREZZO CORRENTE</span>
                <span className="text-title-2 text-accent-copper">
                  {targetSellPrice != null ? formatCurrency(targetSellPrice) : '-'}
                </span>
              </div>
            </div>

            {/* Margin badge */}
            {margin != null && profit != null && (
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                margin >= 0
                  ? 'bg-success/5 border-success/10'
                  : 'bg-destructive/5 border-destructive/10',
              )}>
                <TrendingUp className={cn('h-5 w-5', margin >= 0 ? 'text-success' : 'text-destructive')} />
                <div className="flex flex-col">
                  <span className="text-body-sm text-text-primary font-medium">
                    Margine {margin >= 0 ? '+' : ''}{margin}%
                  </span>
                  <span className="text-caption text-text-tertiary">
                    Profitto: {formatCurrency(profit)}
                  </span>
                </div>
              </div>
            )}

            {/* Market range slider */}
            {marketLow != null && marketHigh != null && (
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
                  {targetSellPrice != null && (
                    <div
                      className="absolute -top-1 w-4 h-4 rounded-full bg-accent-copper border-2 border-bg-secondary shadow-lg shadow-accent-copper/30 transform -translate-x-1/2"
                      style={{ left: `${clampedPosition}%` }}
                    />
                  )}
                  {/* Labels */}
                  <div className="flex justify-between mt-3">
                    <span className="text-caption text-text-tertiary">{formatCurrency(marketLow)}</span>
                    {targetSellPrice != null && (
                      <span className="text-caption text-accent-copper font-medium">
                        {formatCurrency(targetSellPrice)}
                      </span>
                    )}
                    <span className="text-caption text-text-tertiary">{formatCurrency(marketHigh)}</span>
                  </div>
                </div>
              </div>
            )}
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
              margin != null
                ? { label: 'Apprezzamento', value: `${margin >= 0 ? '+' : ''}${margin}%`, sublabel: "dall'acquisizione", color: margin >= 0 ? 'text-success' : 'text-destructive' }
                : null,
              daysInInventory != null
                ? { label: 'Giorni in inventario', value: `${daysInInventory}`, sublabel: `acquisita il ${formatDate(bottle.acquired_at)}`, color: 'text-text-primary' }
                : null,
              aiConfidence != null
                ? { label: 'Confidenza AI', value: `${aiConfidence}%`, sublabel: 'punteggio autenticità', color: 'text-accent-copper' }
                : null,
              bottle.status
                ? { label: 'Stato', value: statusLabel, sublabel: bottle.status, color: 'text-info' }
                : null,
            ]
              .filter(Boolean)
              .map((metric) => (
                <div key={metric!.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors">
                  <div className="flex flex-col gap-0">
                    <span className="text-body-sm text-text-primary">{metric!.label}</span>
                    <span className="text-caption text-text-tertiary">{metric!.sublabel}</span>
                  </div>
                  <span className={cn('text-title-3 font-semibold', metric!.color)}>{metric!.value}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* ── History Timeline ── */}
      {timeline.length > 0 && (
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
      )}
    </div>
  );
}
