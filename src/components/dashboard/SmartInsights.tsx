'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Award, 
  Activity, 
  Calendar 
} from 'lucide-react';
import { FinancialSummary, Transaction, CategoryExpenseBreakdown } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';

interface SmartInsightsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  breakdown: CategoryExpenseBreakdown[];
}

export function SmartInsights({ summary, transactions, breakdown }: SmartInsightsProps) {
  const { formatPrivate } = usePrivacy();

  if (transactions.length === 0) {
    return null;
  }

  const { totalIncome, totalExpense, balance } = summary;

  // 1. Calculate Financial Health Score (0 - 100)
  let healthScore = 50;
  let healthTitle = 'Dengeli Bütçe';
  let healthColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';

  if (totalIncome > 0) {
    const savingsRatio = (totalIncome - totalExpense) / totalIncome;
    if (savingsRatio >= 0.4) {
      healthScore = 95;
      healthTitle = 'Mükemmel Tasarruf';
      healthColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (savingsRatio >= 0.2) {
      healthScore = 80;
      healthTitle = 'İyi & Güvenli';
      healthColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (savingsRatio >= 0) {
      healthScore = 65;
      healthTitle = 'Hassas Denge';
      healthColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else {
      healthScore = 35;
      healthTitle = 'Bütçe Açığı Uyarısı';
      healthColor = 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  } else if (totalExpense > 0) {
    healthScore = 25;
    healthTitle = 'Sadece Gider Kayıtlı';
    healthColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  // 2. Find Largest Single Expense
  const expenses = transactions.filter(t => t.type === 'expense');
  let maxExpense: Transaction | null = null;
  if (expenses.length > 0) {
    maxExpense = expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
  }

  // 3. Top Category Dominance
  const topCategory = breakdown[0];

  // 4. Daily Average Expense
  const dates = Array.from(new Set(transactions.map(t => t.date)));
  const daysCount = Math.max(1, dates.length);
  const dailyAverage = totalExpense / daysCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="theme-card p-5 sm:p-6 rounded-2xl shadow-sm border border-indigo-500/20 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b theme-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold theme-text flex items-center gap-2">
              <span>Akıllı Finansal İçgörüler</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 font-bold border border-indigo-500/30">
                AI ANALİZ
              </span>
            </h3>
            <p className="text-xs theme-muted">Harcama ritminize göre otomatik üretilen stratejik ipuçları</p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${healthColor} self-start sm:self-auto`}>
          <Award className="w-4 h-4" />
          <span>Skor: %{healthScore} • {healthTitle}</span>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {/* Insight 1: Health Ratio */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Nakit Durumu</span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold theme-text leading-snug">
              {balance >= 0 ? (
                <span>
                  Gelirleriniz giderlerinizin <strong className="text-emerald-500">üzerinde</strong> seyrediyor.
                </span>
              ) : (
                <span>
                  Harcamalarınız gelirlerinizi <strong className="text-rose-500">aştı</strong>.
                </span>
              )}
            </p>
            <p className="text-[11px] theme-muted mt-1">
              Net Bakiye: <span className="font-semibold">{formatPrivate(formatCurrency(balance))}</span>
            </p>
          </div>
        </div>

        {/* Insight 2: Top Category */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>En Çok Harcanan</span>
          </div>
          <div className="mt-2">
            {topCategory ? (
              <>
                <p className="text-sm font-bold theme-text leading-snug">
                  Harcamaların <strong className="text-rose-500">%{topCategory.percentage.toFixed(0)}</strong> payı <strong>{topCategory.category}</strong> kategorisinde.
                </p>
                <p className="text-[11px] theme-muted mt-1">
                  Tutar: <span className="font-semibold">{formatPrivate(formatCurrency(topCategory.amount))}</span>
                </p>
              </>
            ) : (
              <p className="text-xs theme-muted">Gider kaydı bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* Insight 3: Daily Average */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Günlük Tempo</span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold theme-text leading-snug">
              İşlem günlerinde ortalama <strong className="text-amber-500">{formatPrivate(formatCurrency(dailyAverage))}</strong> harcıyorsunuz.
            </p>
            <p className="text-[11px] theme-muted mt-1">
              {daysCount} aktif günde {expenses.length} harcama
            </p>
          </div>
        </div>

        {/* Insight 4: Peak Expense */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <AlertCircle className="w-4 h-4 text-purple-500" />
            <span>Zirve Harcama</span>
          </div>
          <div className="mt-2">
            {maxExpense ? (
              <>
                <p className="text-sm font-bold theme-text leading-snug truncate">
                  "{maxExpense.description}"
                </p>
                <p className="text-[11px] text-rose-500 font-bold mt-1">
                  {formatPrivate(formatCurrency(maxExpense.amount))} ({maxExpense.category})
                </p>
              </>
            ) : (
              <p className="text-xs theme-muted">Kayıtlı işlem yok.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
