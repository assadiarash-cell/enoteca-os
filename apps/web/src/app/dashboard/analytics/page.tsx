'use client';

import { useEffect, useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';
import { TrendingUp, Package, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/* ---------- Types ---------- */
interface Bottle {
  id: string;
  category: string;
  producer: string;
  name: string;
  vintage: string | null;
  status: string;
  purchase_price: number | null;
  target_sell_price: number | null;
  market_price_low: number | null;
  market_price_high: number | null;
  created_at: string;
  sold_at: string | null;
  acquired_at: string | null;
}

interface Sale {
  id: string;
  status: string;
  total_amount: number;
  margin_amount: number | null;
  margin_percent: number | null;
  created_at: string;
  completed_at: string | null;
  buyer: Record<string, unknown> | null;
  sale_items: unknown[];
}

interface Acquisition {
  id: string;
  status: string;
  total_bottles: number;
  total_offer: number | null;
  total_final: number | null;
  created_at: string;
  seller: Record<string, unknown> | null;
}

/* ---------- Helpers ---------- */
const TERMINAL_SALE_STATUSES = ['completed', 'paid', 'cancelled', 'rejected'];
const TERMINAL_ACQ_STATUSES = ['completed', 'cancelled', 'rejected'];
const COMPLETED_SALE_STATUSES = ['completed', 'paid'];
const PIE_COLORS = ['#C9843A', '#8B6914', '#A09E96', '#4A90D9', '#6C5CE7', '#E17055', '#00B894', '#FDCB6E'];

const MONTH_NAMES = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function monthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [, m] = key.split('-');
  return MONTH_NAMES[parseInt(m, 10) - 1] ?? key;
}

/* ---------- Custom Tooltip ---------- */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg bg-[#0D0D15] border border-[#1A1A24] p-3 shadow-xl">
      <p className="text-xs text-[#A09E96] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

/* ---------- Skeleton Components ---------- */
function SkeletonKPI() {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#0D0D15] border border-[#1A1A24] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-[#1A1A24]" />
        <div className="h-4 w-12 rounded bg-[#1A1A24]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-24 rounded bg-[#1A1A24]" />
        <div className="h-3 w-20 rounded bg-[#1A1A24]" />
      </div>
    </div>
  );
}

function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6 animate-pulse">
      <div className="h-5 w-40 rounded bg-[#1A1A24] mb-6" />
      <div className="rounded bg-[#1A1A24]" style={{ height }} />
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function AnalyticsPage() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bottlesRes, salesRes, acqRes] = await Promise.all([
          fetch(`/api/bottles?org_id=${DEMO_ORG_ID}&limit=500`),
          fetch(`/api/sales?org_id=${DEMO_ORG_ID}`),
          fetch(`/api/acquisitions?org_id=${DEMO_ORG_ID}`),
        ]);

        const [bottlesJson, salesJson, acqJson] = await Promise.all([
          bottlesRes.json(),
          salesRes.json(),
          acqRes.json(),
        ]);

        setBottles(bottlesJson.data ?? []);
        setSales(salesJson.data ?? []);
        setAcquisitions(acqJson.data ?? []);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------- Compute KPIs ---------- */
  const completedSales = sales.filter((s) => COMPLETED_SALE_STATUSES.includes(s.status));
  const totalRevenue = completedSales.reduce((sum, s) => sum + (s.total_amount ?? 0), 0);
  const soldBottles = bottles.filter((b) => b.status === 'sold');
  const activeDealsSales = sales.filter((s) => !TERMINAL_SALE_STATUSES.includes(s.status)).length;
  const activeDealsAcq = acquisitions.filter((a) => !TERMINAL_ACQ_STATUSES.includes(a.status)).length;
  const activeDeals = activeDealsSales + activeDealsAcq;

  const marginValues = completedSales
    .map((s) => s.margin_percent)
    .filter((m): m is number => m != null);
  const avgMargin = marginValues.length > 0
    ? marginValues.reduce((sum, m) => sum + m, 0) / marginValues.length
    : 0;

  const kpis = [
    {
      label: 'Revenue totale',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconBg: 'bg-[#C9843A]/15',
      iconColor: 'text-[#C9843A]',
    },
    {
      label: 'Bottiglie vendute',
      value: String(soldBottles.length),
      icon: Package,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Deal attivi',
      value: String(activeDeals),
      icon: TrendingUp,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Margine medio',
      value: `${avgMargin.toFixed(1)}%`,
      icon: Users,
      iconBg: 'bg-purple-500/15',
      iconColor: 'text-purple-400',
    },
  ];

  /* ---------- Category Distribution ---------- */
  const categoryMap = new Map<string, { count: number; amount: number }>();
  for (const b of bottles) {
    const cat = b.category || 'Altro';
    const existing = categoryMap.get(cat) ?? { count: 0, amount: 0 };
    existing.count += 1;
    existing.amount += b.target_sell_price ?? 0;
    categoryMap.set(cat, existing);
  }
  const totalBottlesCount = bottles.length || 1;
  const categoryData = Array.from(categoryMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data], idx) => ({
      name,
      value: Math.round((data.count / totalBottlesCount) * 100),
      amount: data.amount,
      color: PIE_COLORS[idx % PIE_COLORS.length],
    }));

  /* ---------- Top Bottles by Margin ---------- */
  const topBottles = soldBottles
    .filter((b) => b.purchase_price != null && b.target_sell_price != null && b.purchase_price > 0)
    .map((b) => {
      const margin = ((b.target_sell_price! - b.purchase_price!) / b.purchase_price!) * 100;
      return {
        name: [b.producer, b.name, b.vintage].filter(Boolean).join(' '),
        margin: Math.round(margin * 10) / 10,
        revenue: b.target_sell_price! - b.purchase_price!,
      };
    })
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 8);

  const maxMargin = topBottles.length > 0 ? Math.max(...topBottles.map((b) => b.margin)) : 1;

  /* ---------- Revenue Trend (last 6 months) ---------- */
  const salesByMonth = new Map<string, number>();
  for (const s of completedSales) {
    const dateStr = s.completed_at ?? s.created_at;
    if (!dateStr) continue;
    const key = monthKey(dateStr);
    salesByMonth.set(key, (salesByMonth.get(key) ?? 0) + (s.total_amount ?? 0));
  }

  // Build last 6 months keys
  const now = new Date();
  const last6MonthKeys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6MonthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const revenueTrend = last6MonthKeys.map((key) => ({
    month: monthLabel(key),
    current: salesByMonth.get(key) ?? 0,
  }));

  /* ---------- Inventory Aging ---------- */
  const nonSoldBottles = bottles.filter((b) => b.status !== 'sold');
  const agingBuckets = [
    { label: '0-30g', min: 0, max: 30, count: 0, value: 0 },
    { label: '31-60g', min: 31, max: 60, count: 0, value: 0 },
    { label: '61-90g', min: 61, max: 90, count: 0, value: 0 },
    { label: '90+g', min: 91, max: Infinity, count: 0, value: 0 },
  ];
  for (const b of nonSoldBottles) {
    const days = daysSince(b.created_at);
    const bucket = agingBuckets.find((bk) => days >= bk.min && days <= bk.max);
    if (bucket) {
      bucket.count += 1;
      bucket.value += b.target_sell_price ?? b.purchase_price ?? 0;
    }
  }
  const agingData = agingBuckets.map(({ label, count, value }) => ({ label, count, value }));

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#EEECE7]">Analytics</h1>
            <p className="text-sm text-[#A09E96] mt-1">
              Performance e metriche di business
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D15] border border-[#1A1A24] text-xs text-[#A09E96]">
            Ultimi 6 mesi
          </div>
        </div>
        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKPI key={i} />
          ))}
        </div>
        {/* Chart Skeletons */}
        <SkeletonChart height={280} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonChart height={320} />
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#EEECE7]">Analytics</h1>
          <p className="text-sm text-[#A09E96] mt-1">
            Performance e metriche di business
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D15] border border-[#1A1A24] text-xs text-[#A09E96]">
          Ultimi 6 mesi
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="flex flex-col gap-3 p-5 rounded-xl bg-[#0D0D15] border border-[#1A1A24]"
            >
              <div className="flex items-center justify-between">
                <div className={cn('flex items-center justify-center h-10 w-10 rounded-lg', kpi.iconBg)}>
                  <Icon className={cn('h-5 w-5', kpi.iconColor)} />
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-semibold text-[#EEECE7]">{kpi.value}</span>
                <span className="text-xs text-[#A09E96]">{kpi.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend LineChart */}
      <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#EEECE7]">Andamento Revenue</h2>
            <p className="text-xs text-[#A09E96] mt-0.5">Ultimi 6 mesi</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
            <XAxis dataKey="month" stroke="#A09E96" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#A09E96"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="current"
              name="Revenue"
              stroke="#C9843A"
              strokeWidth={2.5}
              dot={{ fill: '#C9843A', r: 4 }}
              activeDot={{ r: 6, fill: '#C9843A' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution PieChart */}
        <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6">
          <h2 className="text-lg font-semibold text-[#EEECE7] mb-6">Distribuzione categorie</h2>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg bg-[#07070D] border border-[#1A1A24] p-2 text-xs">
                          <span className="text-[#EEECE7]">{d.name}: {d.value}%</span>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 flex-1">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-[#EEECE7]">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#A09E96]">
                        {formatCurrency(cat.amount)}
                      </span>
                      <span className="text-xs text-[#A09E96]/60 w-8 text-right">{cat.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#A09E96] text-center py-8">Nessun dato disponibile</p>
          )}
        </div>

        {/* Inventory Aging BarChart */}
        <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6">
          <h2 className="text-lg font-semibold text-[#EEECE7] mb-6">Aging inventario</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agingData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" vertical={false} />
              <XAxis dataKey="label" stroke="#A09E96" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#A09E96" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.[0]) return null;
                  return (
                    <div className="rounded-lg bg-[#07070D] border border-[#1A1A24] p-2 text-xs">
                      <p className="text-[#A09E96] mb-0.5">{label}</p>
                      <p className="text-[#EEECE7]">{payload[0].value} bottiglie</p>
                      <p className="text-[#C9843A]">{formatCurrency(payload[0].payload.value)}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="#C9843A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 8 Bottles by Margin */}
      <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#EEECE7]">Top bottiglie per margine</h2>
          <span className="text-xs text-[#A09E96]">Top 8</span>
        </div>
        {topBottles.length > 0 ? (
          <div className="flex flex-col gap-4">
            {topBottles.map((bottle, idx) => (
              <div key={bottle.name + idx} className="flex items-center gap-4">
                <span className="text-xs text-[#A09E96]/60 w-5 text-right">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#EEECE7] truncate">{bottle.name}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs text-[#A09E96]">{formatCurrency(bottle.revenue)}</span>
                      <span className="text-sm font-semibold text-[#C9843A] w-12 text-right">{bottle.margin}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1A1A24] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C9843A] to-[#C9843A]/60 transition-all"
                      style={{ width: `${(bottle.margin / maxMargin) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#A09E96] text-center py-8">Nessun dato disponibile</p>
        )}
      </div>
    </div>
  );
}
