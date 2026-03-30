'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile by default, always visible on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main content - no left margin on mobile, 240px on desktop */}
      <main className="flex-1 lg:ml-[240px] min-h-screen">
        {/* Mobile top bar with hamburger */}
        <div className="sticky top-0 z-20 flex items-center h-14 px-4 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#A09E96] hover:text-[#EEECE7] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            <span className="text-[14px] font-semibold text-[#EEECE7] tracking-tight">
              ENOTECA OS
            </span>
          </div>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
