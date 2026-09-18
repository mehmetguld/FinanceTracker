'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Plus, PieChart, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BottomNavigationProps {
  onOpenAddModal: () => void;
}

export function BottomNavigation({ onOpenAddModal }: BottomNavigationProps) {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  const isLinkActive = (href?: string) => {
    if (!href || !pathname) return false;
    let cleanPath = pathname.replace(/\/$/, '') || '/';
    if (cleanPath.startsWith('/FinanceTracker')) {
      cleanPath = cleanPath.replace(/^\/FinanceTracker/, '') || '/';
    }
    const cleanHref = href.replace(/\/$/, '') || '/';
    if (cleanHref === '/') return cleanPath === '/';
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref + '/');
  };

  const navItems = [
    { href: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('nav.transactions'), icon: Receipt },
    { isAction: true, label: language === 'tr' ? 'Ekle' : 'Add', icon: Plus, onClick: onOpenAddModal },
    { href: '/analytics', label: t('nav.analytics'), icon: PieChart },
    { href: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 theme-bottom backdrop-blur-2xl border-t theme-border pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors duration-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div key="fab-add" className="col-span-1 flex flex-col items-center justify-center relative">
                <button
                  type="button"
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center -mt-7 group focus:outline-none cursor-pointer active:scale-95 transition-transform"
                  aria-label={item.label}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-white group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6 stroke-[2.8]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 mt-0.5 tracking-tight">{item.label}</span>
                </button>
              </div>
            );
          }

          const isActive = isLinkActive(item.href);

          return (
            <div key={item.href || idx} className="col-span-1 flex flex-col items-center justify-center">
              <Link
                href={item.href!}
                className={`flex flex-col items-center justify-center w-full py-1 transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'theme-muted hover:text-indigo-500'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 dark:bg-indigo-500/25 scale-110 shadow-sm'
                      : 'hover:bg-slate-500/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] text-center">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
