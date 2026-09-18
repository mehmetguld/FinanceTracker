'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Plus, PieChart, Settings } from 'lucide-react';

interface BottomNavigationProps {
  onOpenAddModal: () => void;
}

export function BottomNavigation({ onOpenAddModal }: BottomNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Özet', icon: LayoutDashboard },
    { href: '/transactions', label: 'İşlemler', icon: Receipt },
    { isAction: true, label: 'Ekle', icon: Plus, onClick: onOpenAddModal },
    { href: '/analytics', label: 'Grafikler', icon: PieChart },
    { href: '/settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 px-3 py-2 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key="fab-add"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-white group-active:scale-95 transition-transform">
                  <Plus className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-1">{item.label}</span>
              </button>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href || idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
