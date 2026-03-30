'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';
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
const PIE_COLORS = ['#8B1A32', '#C9843A', '#D4A05A', '#3B7FD9', '#6B6963', '#6C5CE7', '#E17055', '#00B894'];

const MONTH_NAMES = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const TOOLTIP_STYLE = {
  backgroundColor: '#14141F',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  color: '#EEECE7',
};

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

/* ---------- Skeleton Components ---------- */
function SkeletonKPI() {
  return (
    <div className="bg-[#0D0D15] rounded-xl p-5 border border-[rgba(255,255,255,0.06)] animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-24 rounded bg-[#1A1A24]" />
        <div className="w-8 h-8 rounded-lg bg-[#1A1A24]" />
      </div>
      <div className="flex items-baseline gap-2">
        <div className="h-8 w-28 rounded bg-[#1A1A24]" />
        <div className="h-4 w-12 rounded bg-[#1A1A24]" />
      </div>
    </div>
  );
}

function SkeletonChart({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)] animate-pulse">
      <div className="h-5 w-40 rounded bg-[#1A1A24] mb-4" />
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
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
    },
    {
      label: 'Bottles Sold',
      value: String(soldBottles.length),
      change: '+8.3%',
      positive: true,
      icon: Package,
    },
    {
      label: 'Active Deals',
      value: String(activeDeals),
      change: String(activeDeals),
      positive: activeDeals > 0,
      icon: Users,
    },
    {
      label: 'Avg. Margin',
      value: `${avgMargin.toFixed(1)}%`,
      change: '+3.2%',
      positive: true,
      icon: TrendingUp,
    },
  ];

  /* ---------- Category Distribution ---------- */
  const categoryMap = new Map<string, { count: number; amount: number }>();
  for (const b of bottles) {
    const cat = b.category || 'Other';
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
      const margin = b.target_sell_price! - b.purchase_price!;
      const marginPct = ((b.target_sell_price! - b.purchase_price!) / b.purchase_price!) * 100;
      return {
        name: [b.producer, b.name, b.vintage].filter(Boolean).join(' '),
        margin,
        marginPct: Math.round(marginPct * 10) / 10,
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

  const now = new Date();
  const last6MonthKeys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6MonthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // Also build "previous period" keys (6 months before the current window)
  const prev6MonthKeys: string[] = [];
  for (let i = 11; i >= 6; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    prev6MonthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const revenueTrend = last6MonthKeys.map((key, idx) => ({
    month: monthLabel(key),
    current: salesByMonth.get(key) ?? 0,
    previous: salesByMonth.get(prev6MonthKeys[idx]) ?? 0,
  }));

  /* ---------- Inventory Aging ---------- */
  const nonSoldBottles = bottles.filter((b) => b.status !== 'sold');
  const agingBuckets = [
    { label: '0-30d', min: 0, max: 30, count: 0, value: 0 },
    { label: '31-60d', min: 31, max: 60, count: 0, value: 0 },
    { label: '61-90d', min: 61, max: 90, count: 0, value: 0 },
    { label: '90+d', min: 91, max: Infinity, count: 0, value: 0 },
  ];
  for (const b of nonSoldBottles) {
    const days = daysSince(b.created_at);
    const bucket = agingBuckets.find((bk) => days >= bk.min && days <= bk.max);
    if (bucket) {
      bucket.count += 1;
      bucket.value += b.target_sell_price ?? b.purchase_price ?? 0;
    }
  }
  const agingData = agingBuckets.map(({ label, count, value }) => ({ range: label, count, value }));

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070D] pb-24">
        <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-[28px] font-bold text-[#EEECE7]">Analytics</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonKPI key={i} />
            ))}
          </div>
          <SkeletonChart height={300} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonChart height={300} />
        </div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-[#07070D] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-[28px] font-bold text-[#EEECE7]">Analytics</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-[#0D0D15] rounded-xl p-5 border border-[rgba(255,255,255,0.06)] max-w-full overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] text-[#6B6963] uppercase tracking-wider">{kpi.label}</p>
                <div className="w-8 h-8 rounded-lg bg-[#C9843A]/10 flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-[#C9843A]" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-[28px] font-bold text-[#EEECE7]">{kpi.value}</p>
                <span className={`text-[13px] font-medium ${kpi.positive ? 'text-[#22C68A]' : 'text-[#DC4545]'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Trend */}
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
          <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                stroke="#6B6963"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B6963"
                style={{ fontSize: '12px' }}
                tickFormatter={(value: number) => `\u20AC${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: number) => [`\u20AC${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#A09E96' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#A09E96' }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#C9843A"
                strokeWidth={2}
                name="Current Period"
                dot={{ fill: '#C9843A', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#6B6963"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Previous Period"
                dot={{ fill: '#6B6963', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
            <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-4">Category Distribution</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[#6B6963] text-center py-8">No data available</p>
            )}
          </div>

          {/* Inventory Aging */}
          <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
            <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-4">Inventory Aging</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="range"
                  stroke="#6B6963"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6B6963"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: 'rgba(201, 132, 58, 0.1)' }}
                />
                <Bar dataKey="count" fill="#C9843A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 8 Bottles by Margin */}
        <div className="bg-[#0D0D15] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]">
          <h3 className="text-[18px] font-semibold text-[#EEECE7] mb-4">Top 8 Bottles by Margin</h3>
          {topBottles.length > 0 ? (
            <div className="space-y-3">
              {topBottles.map((bottle, i) => (
                <div key={bottle.name + i} className="flex items-center gap-4">
                  <span className="text-[14px] font-mono text-[#6B6963] w-6 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] text-[#EEECE7]">{bottle.name}</span>
                      <span className="text-[14px] font-semibold text-[#22C68A] font-mono">
                        {formatCurrency(bottle.margin)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#14141F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C9843A] to-[#22C68A] rounded-full"
                        style={{ width: `${(bottle.margin / maxMargin) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6963] text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
