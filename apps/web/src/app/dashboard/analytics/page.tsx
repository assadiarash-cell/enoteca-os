'use client';

import { cn, formatCurrency } from '@/lib/utils';
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

/* ---------- KPI Data ---------- */
const kpis = [
  {
    label: 'Revenue totale',
    value: '€148.200',
    delta: '+8.3%',
    deltaUp: true,
    icon: DollarSign,
    iconBg: 'bg-[#C9843A]/15',
    iconColor: 'text-[#C9843A]',
  },
  {
    label: 'Bottiglie vendute',
    value: '342',
    delta: '+12.1%',
    deltaUp: true,
    icon: Package,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    label: 'Deal attivi',
    value: '28',
    delta: '+4',
    deltaUp: true,
    icon: TrendingUp,
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Margine medio',
    value: '18.4%',
    delta: '+2.1%',
    deltaUp: true,
    icon: Users,
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
  },
];

/* ---------- Revenue Trend ---------- */
const revenueTrend = [
  { month: 'Ott', current: 92000, previous: 78000 },
  { month: 'Nov', current: 118000, previous: 95000 },
  { month: 'Dic', current: 156000, previous: 130000 },
  { month: 'Gen', current: 134000, previous: 112000 },
  { month: 'Feb', current: 142000, previous: 128000 },
  { month: 'Mar', current: 148200, previous: 136000 },
];

/* ---------- Category Distribution ---------- */
const categoryData = [
  { name: 'Vino', value: 58, amount: 1392000, color: '#C9843A' },
  { name: 'Whisky', value: 24, amount: 576000, color: '#8B6914' },
  { name: 'Cognac', value: 12, amount: 288000, color: '#A09E96' },
  { name: 'Rum', value: 6, amount: 144000, color: '#4A90D9' },
];

/* ---------- Inventory Aging ---------- */
const agingData = [
  { label: '0-30g', count: 124, value: 480000 },
  { label: '31-60g', count: 78, value: 312000 },
  { label: '61-90g', count: 42, value: 168000 },
  { label: '90+g', count: 28, value: 112000 },
];

/* ---------- Top Bottles by Margin ---------- */
const topBottles = [
  { name: 'Barolo Monfortino 2010', margin: 34, revenue: 28000 },
  { name: 'Romanee-Conti 1998', margin: 31, revenue: 14500 },
  { name: 'Sassicaia 2000', margin: 28, revenue: 8400 },
  { name: 'Petrus 2005', margin: 26, revenue: 8200 },
  { name: 'Macallan 25yo', margin: 24, revenue: 5800 },
  { name: 'Opus One 2018', margin: 22, revenue: 3200 },
  { name: 'Hennessy Paradis', margin: 20, revenue: 6200 },
  { name: 'Highland Park 30', margin: 18, revenue: 4100 },
];

const maxMargin = Math.max(...topBottles.map((b) => b.margin));

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

export default function AnalyticsPage() {
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
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    kpi.deltaUp ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {kpi.deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.delta}
                </span>
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
            <p className="text-xs text-[#A09E96] mt-0.5">Periodo corrente vs precedente</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#A09E96]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C9843A]" />
              Corrente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#A09E96]/40" />
              Precedente
            </span>
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
              name="Corrente"
              stroke="#C9843A"
              strokeWidth={2.5}
              dot={{ fill: '#C9843A', r: 4 }}
              activeDot={{ r: 6, fill: '#C9843A' }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name="Precedente"
              stroke="#A09E96"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              opacity={0.4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution PieChart */}
        <div className="rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-6">
          <h2 className="text-lg font-semibold text-[#EEECE7] mb-6">Distribuzione categorie</h2>
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
        <div className="flex flex-col gap-4">
          {topBottles.map((bottle, idx) => (
            <div key={bottle.name} className="flex items-center gap-4">
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
      </div>
    </div>
  );
}
