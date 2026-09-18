'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinancialSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { totalIncome, totalExpense, balance, transactionCount } = summary;
  const { formatPrivate } = usePrivacy();

  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Toplam Gelir Card */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl theme-card p-5 sm:p-6 shadow-xl border-l-4 border-l-emerald-500 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Toplam Gelir</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight">
            {formatPrivate(formatCurrency(totalIncome))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>Kayıtlı gelen fonlar</span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Toplam Gider Card */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl theme-card p-5 sm:p-6 shadow-xl border-l-4 border-l-rose-500 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Toplam Gider</span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight">
            {formatPrivate(formatCurrency(totalExpense))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="w-4 h-4" />
            <span>Harcanan toplam bütçe</span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Net Bakiye Card */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl theme-card p-5 sm:p-6 shadow-xl border-l-4 border-l-indigo-500 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Net Bakiye</span>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${balance >= 0 ? 'theme-text' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatPrivate(formatCurrency(balance))}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs theme-muted">
            <span>{transactionCount} işlem kaydedildi</span>
            {totalIncome > 0 && (
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                %{savingsRate.toFixed(0)} Tasarruf
              </span>
            )}
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>
    </div>
  );
}
