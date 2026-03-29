// ==============================================
// ENOTECA OS — Formatting Utilities
// ==============================================

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMarginPercent(margin: number): string {
  const sign = margin >= 0 ? '+' : '';
  return `${sign}${margin.toFixed(1)}%`;
}

export function formatBottleName(producer: string | null, name: string, vintage: number | null): string {
  const parts: string[] = [];
  if (producer) parts.push(producer);
  parts.push(name);
  if (vintage) parts.push(String(vintage));
  return parts.join(' — ');
}

export function formatConditionScore(score: number): string {
  return `${score.toFixed(1)}/10`;
}

export function formatAuthenticityScore(score: number): {
  label: string;
  color: 'success' | 'warning' | 'danger';
} {
  if (score >= 85) return { label: `Verified — ${score}/100`, color: 'success' };
  if (score >= 60) return { label: `Review needed — ${score}/100`, color: 'warning' };
  return { label: `Suspicious — ${score}/100`, color: 'danger' };
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'ora';
  if (diffMins < 60) return `${diffMins}m fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays < 7) return `${diffDays}g fa`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sett fa`;
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}

export function formatDaysInInventory(createdAt: string): {
  days: number;
  label: string;
  status: 'fresh' | 'normal' | 'aging' | 'stagnant';
} {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);

  if (days < 14) return { days, label: `${days}g`, status: 'fresh' };
  if (days < 60) return { days, label: `${days}g`, status: 'normal' };
  if (days < 90) return { days, label: `${days}g`, status: 'aging' };
  return { days, label: `${days}g`, status: 'stagnant' };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
