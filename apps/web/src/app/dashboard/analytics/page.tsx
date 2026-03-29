import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, PieChart, BarChart3, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const revenueData = [
  { month: 'Ott', value: 92000 },
  { month: 'Nov', value: 118000 },
  { month: 'Dic', value: 156000 },
  { month: 'Gen', value: 134000 },
  { month: 'Feb', value: 142000 },
  { month: 'Mar', value: 148200 },
];

const categoryBreakdown = [
  { category: 'Vino', percentage: 58, value: 1392000, color: 'bg-accent-wine' },
  { category: 'Whisky', percentage: 24, value: 576000, color: 'bg-accent-primary' },
  { category: 'Cognac', percentage: 12, value: 288000, color: 'bg-accent-secondary' },
  { category: 'Rum', percentage: 6, value: 144000, color: 'bg-semantic-info' },
];

const agingBuckets = [
  { label: '0-30 giorni', count: 124, value: '€480K', percentage: 45 },
  { label: '31-60 giorni', count: 78, value: '€312K', percentage: 28 },
  { label: '61-90 giorni', count: 42, value: '€168K', percentage: 16 },
  { label: '90+ giorni', count: 28, value: '€112K', percentage: 11 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">Analytics</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Performance e metriche di business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">Ultimo 6 mesi</Badge>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-semantic-success" />
              Revenue
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-title-2 text-text-primary">€148.200</span>
              <span className="flex items-center gap-0.5 text-caption text-semantic-success">
                <ArrowUpRight className="h-3 w-3" />
                +8.3%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart placeholder */}
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d) => {
              const height = (d.value / 160000) * 100;
              return (
                <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '180px' }}>
                    <div
                      className="w-full max-w-[48px] rounded-t-sm bg-copper-gradient opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-caption text-text-tertiary">{d.month}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent-primary" />
              Ripartizione per categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-text-primary">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-text-secondary">
                        €{(cat.value / 1000).toFixed(0)}K
                      </span>
                      <span className="text-caption text-text-tertiary w-8 text-right">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                    <div
                      className={cn(cat.color, 'h-full rounded-full transition-all')}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Margin Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-semantic-success" />
              Analisi margini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                  <span className="text-overline text-text-tertiary uppercase">Margine medio</span>
                  <span className="text-title-2 text-semantic-success">18.4%</span>
                  <span className="flex items-center gap-0.5 text-caption text-semantic-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +2.1% vs mese prec.
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                  <span className="text-overline text-text-tertiary uppercase">Margine migliore</span>
                  <span className="text-title-2 text-accent-secondary">34%</span>
                  <span className="text-caption text-text-secondary">Barolo Monfortino 2010</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                  <span className="text-overline text-text-tertiary uppercase">Deal chiusi MTD</span>
                  <span className="text-title-2 text-text-primary">28</span>
                  <span className="flex items-center gap-0.5 text-caption text-semantic-success">
                    <ArrowUpRight className="h-3 w-3" />
                    +12% vs mese prec.
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-md bg-bg-tertiary">
                  <span className="text-overline text-text-tertiary uppercase">Valore medio deal</span>
                  <span className="text-title-2 text-text-primary">€5.290</span>
                  <span className="flex items-center gap-0.5 text-caption text-semantic-danger">
                    <ArrowDownRight className="h-3 w-3" />
                    -3.2% vs mese prec.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Aging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-semantic-warning" />
            Aging inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agingBuckets.map((bucket) => (
              <div
                key={bucket.label}
                className="flex flex-col gap-3 p-4 rounded-md border border-border-subtle bg-bg-tertiary"
              >
                <span className="text-caption text-text-tertiary">{bucket.label}</span>
                <div className="flex items-end justify-between">
                  <span className="text-title-2 text-text-primary">{bucket.count}</span>
                  <span className="text-body-sm text-text-secondary">{bucket.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg-quaternary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-semantic-warning transition-all"
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}