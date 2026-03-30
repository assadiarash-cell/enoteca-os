'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Share2,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Edit,
  AlertCircle,
  Package,
  ExternalLink,
  Brain,
} from 'lucide-react';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';
import { formatCurrency } from '@/lib/utils';

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

/* ── Timeline maps ── */
const timelineIconMap: Record<string, typeof ExternalLink> = {
  sold_at: CheckCircle,
  listed_at: ExternalLink,
  valued_at: DollarSign,
  acquired_at: TrendingUp,
  created_at: Clock,
};

const timelineColorMap: Record<string, string> = {
  sold_at: '#22C68A',
  listed_at: '#C9843A',
  valued_at: '#C9843A',
  acquired_at: '#22C68A',
  created_at: '#3B7FD9',
};

const timelineLabelMap: Record<string, string> = {
  sold_at: 'Sold',
  listed_at: 'Listed',
  valued_at: 'Valued',
  acquired_at: 'Acquired',
  created_at: 'Created',
};

const timelineDetailMap = (bottle: Record<string, any>): Record<string, string> => ({
  sold_at: bottle.target_sell_price ? formatCurrency(Number(bottle.target_sell_price)) : '',
  listed_at: bottle.target_sell_price ? formatCurrency(Number(bottle.target_sell_price)) : '',
  valued_at:
    bottle.market_price_low && bottle.market_price_high
      ? `${formatCurrency(Number(bottle.market_price_low))} - ${formatCurrency(Number(bottle.market_price_high))}`
      : '',
  acquired_at: bottle.purchase_price ? formatCurrency(Number(bottle.purchase_price)) : '',
  created_at: 'Agent Scanner',
});

/* ── Helpers ── */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildTimeline(bottle: Record<string, any>) {
  const keys = ['created_at', 'valued_at', 'acquired_at', 'listed_at', 'sold_at'] as const;
  const details = timelineDetailMap(bottle);
  const events: { date: string; event: string; detail: string; color: string; icon: typeof ExternalLink }[] = [];

  for (const key of keys) {
    const ts = bottle[key];
    if (ts && typeof ts === 'string') {
      events.push({
        date: formatDate(ts),
        event: timelineLabelMap[key],
        detail: details[key] || '',
        color: timelineColorMap[key],
        icon: timelineIconMap[key],
      });
    }
  }

  return events;
}

/* ── Loading skeleton ── */
function BottleSkeleton() {
  return (
    <div className="min-h-screen bg-[#07070D]">
      <div className="h-[400px] bg-[#0D0D15] animate-pulse" />
      <div className="max-w-md mx-auto px-4 pb-28 -mt-12 relative z-10 space-y-4">
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
          <div className="h-6 w-48 rounded bg-[#14141F] animate-pulse mb-2" />
          <div className="h-6 w-64 rounded bg-[#14141F] animate-pulse mb-3" />
          <div className="h-4 w-40 rounded bg-[#14141F] animate-pulse" />
        </div>
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
          <div className="h-5 w-32 rounded bg-[#14141F] animate-pulse mb-4" />
          <div className="h-24 w-24 rounded-full bg-[#14141F] animate-pulse mx-auto" />
        </div>
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
          <div className="h-5 w-24 rounded bg-[#14141F] animate-pulse mb-4" />
          <div className="h-10 w-36 rounded bg-[#14141F] animate-pulse mb-4" />
          <div className="h-2 w-full rounded bg-[#14141F] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ── 404 state ── */
function BottleNotFound() {
  return (
    <div className="min-h-screen bg-[#07070D] flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0D0D15]">
        <AlertCircle className="h-10 w-10 text-[#6B6963]" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[22px] font-bold text-[#EEECE7]">Bottiglia non trovata</h2>
        <p className="text-[14px] text-[#A09E96] max-w-sm">
          La bottiglia richiesta non esiste o non hai i permessi per visualizzarla.
        </p>
      </div>
      <Link href="/dashboard/bottles">
        <button className="h-12 px-6 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[14px] transition-all active:scale-[0.98] flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Torna alle bottiglie
        </button>
      </Link>
    </div>
  );
}

/* ── Main page component ── */
export default function BottleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [bottle, setBottle] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

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
  const authenticityColor = aiConfidence != null
    ? aiConfidence >= 90 ? '#22C68A' : aiConfidence >= 70 ? '#E5A832' : '#DC4545'
    : '#C9843A';
  const authenticityLabel = aiConfidence != null
    ? aiConfidence >= 90 ? 'Verified Authentic' : aiConfidence >= 70 ? 'Likely Authentic' : 'Needs Review'
    : null;

  const categoryColor = bottle.category?.toLowerCase().includes('red') ? '#8B1A32'
    : bottle.category?.toLowerCase().includes('white') ? '#D4A05A'
    : bottle.category?.toLowerCase().includes('sparkling') ? '#E5A832'
    : '#C9843A';

  const timeline = buildTimeline(bottle);

  /* ── Key findings from bottle data ── */
  const findings: { label: string; value: string }[] = [];
  if (bottle.label_condition) findings.push({ label: 'Label condition', value: bottle.label_condition });
  if (bottle.fill_level) findings.push({ label: 'Liquid level', value: bottle.fill_level });
  if (bottle.closure_type) findings.push({ label: 'Closure', value: bottle.closure_type });
  if (bottle.capsule_condition) findings.push({ label: 'Capsule', value: bottle.capsule_condition });
  if (bottle.overall_condition) findings.push({ label: 'Overall condition', value: bottle.overall_condition });

  const heroImage = bottle.primary_photo || null;

  return (
    <div className="min-h-screen bg-[#07070D]">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${bottle.producer || ''} ${bottle.name || ''} ${bottle.vintage || ''}`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#14141F] to-[#0D0D15] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[#6B6963]">
              <div className="h-52 w-14 rounded-t-full bg-[#8B1A32]/15" />
              <div className="h-4 w-10 -mt-1 bg-[#8B1A32]/10 rounded-b-sm" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070D]/60 via-transparent to-[#07070D]" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 glass-bg rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(13,13,21,0.9)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#EEECE7]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 glass-bg rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(13,13,21,0.9)] transition-all">
              <Share2 className="w-5 h-5 text-[#EEECE7]" strokeWidth={1.5} />
            </button>
            <button className="w-10 h-10 glass-bg rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(13,13,21,0.9)] transition-all">
              <Heart className="w-5 h-5 text-[#EEECE7]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-28 -mt-12 relative z-10">
        {/* Identity Card */}
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)] mb-4 max-w-full overflow-hidden">
          <h1 className="text-[22px] font-bold text-[#EEECE7] mb-1 leading-tight">
            {bottle.producer}
          </h1>
          <h2 className="text-[22px] font-bold text-[#EEECE7] mb-2 leading-tight">
            {bottle.name} {bottle.vintage}
          </h2>
          <p className="text-[14px] text-[#A09E96] mb-3">
            {[bottle.denomination, bottle.region, bottle.country].filter(Boolean).join(' \u2022 ')}
          </p>
          {bottle.category && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {bottle.category}
            </span>
          )}
        </div>

        {/* AI Analysis Card */}
        {(aiConfidence != null || aiNotes || findings.length > 0) && (
          <div className="bg-[#0D0D15] rounded-xl p-6 border-l-[3px] border border-[rgba(255,255,255,0.06)] border-l-[#C9843A] mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C9843A]" strokeWidth={1.5} />
              <h3 className="text-[16px] font-semibold text-[#EEECE7]">AI Analysis</h3>
            </div>

            {/* Authenticity Score */}
            {aiConfidence != null && (
              <div className="flex items-center gap-6 mb-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={authenticityColor}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(aiConfidence / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[24px] font-bold" style={{ color: authenticityColor }}>
                      {aiConfidence}
                    </span>
                    <span className="text-[11px] text-[#6B6963]">/ 100</span>
                  </div>
                </div>

                <div className="flex-1">
                  {authenticityLabel && (
                    <p className="text-[14px] font-semibold mb-1" style={{ color: authenticityColor }}>
                      {authenticityLabel}
                    </p>
                  )}
                  <p className="text-[13px] text-[#A09E96]">
                    {aiNotes || 'High confidence based on label, provenance, and market data'}
                  </p>
                </div>
              </div>
            )}

            {/* Key Findings */}
            {findings.length > 0 && (
              <div className="space-y-2 mb-3">
                {findings.map((finding, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[13px] text-[#A09E96]">{finding.label}</span>
                    <span className="text-[13px] font-medium text-[#EEECE7]">{finding.value}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              className="text-[13px] text-[#C9843A] font-medium hover:underline"
            >
              {showFullAnalysis ? 'Hide' : 'View'} full analysis
            </button>
          </div>
        )}

        {/* Pricing Card */}
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)] mb-4">
          <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-4">Pricing</h3>

          {/* Current Price */}
          <div className="mb-4">
            <p className="text-[11px] text-[#6B6963] mb-1">Current listing price</p>
            <p className="text-[32px] font-bold text-[#C9843A] font-mono">
              {targetSellPrice != null ? formatCurrency(targetSellPrice) : '\u2014'}
            </p>
          </div>

          {/* Market Range */}
          {marketLow != null && marketHigh != null && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#6B6963]">Market range</span>
                <span className="text-[11px] text-[#6B6963] font-mono">
                  {formatCurrency(marketLow)} - {formatCurrency(marketHigh)}
                </span>
              </div>
              <div className="relative h-2 bg-[#14141F] rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-[#3B7FD9] via-[#22C68A] to-[#E5A832] opacity-40"
                  style={{ left: 0, right: 0 }}
                />
                {targetSellPrice != null && (
                  <div
                    className="absolute w-3 h-3 bg-[#C9843A] rounded-full border-2 border-[#07070D] top-1/2 -translate-y-1/2"
                    style={{ left: `${clampedPosition}%` }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Purchase & Margin */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-[11px] text-[#6B6963] mb-1">Purchase price</p>
              <p className="text-[16px] font-semibold text-[#A09E96] font-mono">
                {purchasePrice != null ? formatCurrency(purchasePrice) : '\u2014'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#6B6963] mb-1">Margin</p>
              <p className="text-[16px] font-semibold text-[#22C68A]">
                {margin != null && profit != null ? (
                  <>
                    {margin >= 0 ? '+' : ''}{margin}%{' '}
                    <span className="text-[14px]">({formatCurrency(profit)})</span>
                  </>
                ) : (
                  '\u2014'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <button className="text-[13px] text-[#C9843A] font-medium hover:underline">
              View price sources
            </button>
            <div className="flex items-center gap-1 text-[11px] text-[#6B6963]">
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              {bottle.updated_at ? `Updated ${formatDate(bottle.updated_at)}` : 'Recently updated'}
            </div>
          </div>
        </div>

        {/* History Timeline */}
        {timeline.length > 0 && (
          <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
            <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-4">History</h3>
            <div className="space-y-4">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    {i < timeline.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
                    )}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[14px] font-semibold text-[#EEECE7]">{item.event}</span>
                        <span className="text-[11px] text-[#6B6963] font-mono">{item.date}</span>
                      </div>
                      {item.detail && (
                        <p className="text-[13px] text-[#A09E96]">{item.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-bg border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-md mx-auto px-6 py-4 flex gap-3">
          <button className="flex-1 h-12 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" strokeWidth={1.5} />
            Edit
          </button>
          <button className="flex-[2] h-12 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[14px] transition-all active:scale-[0.98]">
            Mark as Sold
          </button>
        </div>
      </div>
    </div>
  );
}
