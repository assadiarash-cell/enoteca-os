'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wine,
  Handshake,
  BarChart3,
  Users,
  UserCheck,
  FileText,
  Bot,
  Settings,
  LogOut,
  ScanLine,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bottles', href: '/dashboard/bottles', icon: Wine },
  { label: 'Scan', href: '/dashboard/scan', icon: ScanLine },
  { label: 'Deals', href: '/dashboard/deals', icon: Handshake },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Sellers', href: '/dashboard/sellers', icon: Users },
  { label: 'Buyers', href: '/dashboard/buyers', icon: UserCheck },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col bg-bg-primary border-r border-border-subtle">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border-subtle">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-copper-gradient">
          <Wine className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-body-sm font-semibold text-text-primary tracking-tight">
            ENOTECA OS
          </span>
          <span className="text-[10px] text-text-tertiary uppercase tracking-widest">
            Operator
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-body-sm transition-all duration-150',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-secondary border-l-2 border-accent-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border-l-2 border-transparent'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive
                        ? 'text-accent-primary'
                        : 'text-text-tertiary group-hover:text-text-secondary'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile */}
      <div className="border-t border-border-subtle p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-caption text-text-secondary">
            MA
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-body-sm text-text-primary truncate">
              Marco Albertini
            </span>
            <span className="text-caption text-text-tertiary">
              Operatore
            </span>
          </div>
          <button
            className="text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
