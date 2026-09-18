'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  Moon, 
  Sun, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Tags, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { usePrivacy } from '@/context/PrivacyContext';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export function Navbar({ onOpenAddModal }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('nav.transactions'), icon: Receipt },
    { href: '/analytics', label: t('nav.analytics'), icon: PieChart },
    { href: '/categories', label: t('nav.categories'), icon: Tags },
    { href: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b theme-header backdrop-blur-xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-md sm:shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full theme-bg rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg theme-text tracking-tight flex items-center gap-1 sm:gap-1.5">
                <span>FinanceTracker</span>
                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30">PRO</span>
              </span>
              <span className="text-[11px] theme-muted font-medium hidden sm:inline">
                {language === 'tr' ? 'Kişisel Bütçe Yöneticisi' : 'Personal Finance Manager'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner'
                      : 'theme-muted hover:text-indigo-500 hover:bg-slate-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Quick Add Button (Desktop only - mobile has bottom FAB) */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>
                {language === 'tr' ? 'İşlem Ekle' : 'Add'}
              </span>
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl theme-sub-card border theme-border hover:opacity-80 transition-all font-bold text-xs theme-text cursor-pointer active:scale-95"
              title={language === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
            >
              <span className="text-sm leading-none">{language === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
              <span className="uppercase tracking-wider font-extrabold text-[11px] sm:text-xs">{language === 'tr' ? 'TR' : 'EN'}</span>
            </button>

            {/* Privacy Mode Toggle Button */}
            <button
              onClick={togglePrivacy}
              className="p-1.5 sm:p-2.5 rounded-xl theme-sub-card border theme-border hover:opacity-80 transition-all cursor-pointer active:scale-95"
              title={isPrivate ? (language === 'tr' ? 'Bakiyeleri Göster' : 'Show Balances') : (language === 'tr' ? 'Bakiyeleri Gizle' : 'Hide Balances')}
            >
              {isPrivate ? (
                <EyeOff className="w-4 h-4 text-amber-500" />
              ) : (
                <Eye className="w-4 h-4 theme-muted" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2.5 rounded-xl theme-sub-card border theme-border hover:opacity-80 transition-all cursor-pointer active:scale-95"
              title={theme === 'dark' ? (language === 'tr' ? 'Açık Temaya Geç' : 'Light Mode') : (language === 'tr' ? 'Karanlık Temaya Geç' : 'Dark Mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 sm:p-2.5 rounded-xl theme-sub-card border theme-border theme-text active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs h-full theme-card border-l theme-border p-6 flex flex-col gap-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b theme-border">
              <span className="font-bold theme-text text-base">
                {language === 'tr' ? 'Menü' : 'Menu'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg theme-sub-card theme-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'theme-text hover:bg-slate-500/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
