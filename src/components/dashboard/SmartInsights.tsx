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
import { useLanguage } from '@/context/LanguageContext';

interface SmartInsightsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  breakdown: CategoryExpenseBreakdown[];
}

export function SmartInsights({ summary, transactions, breakdown }: SmartInsightsProps) {
  const { formatPrivate } = usePrivacy();
  const { t, language } = useLanguage();

  if (transactions.length === 0) {
    return null;
  }

  const { totalIncome, totalExpense, balance } = summary;

  // 1. Calculate Financial Health Score (0 - 100)
  let healthScore = 50;
  let healthTitle = language === 'tr' ? 'Dengeli Bütçe' : 'Balanced Budget';
  let healthColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';

  if (totalIncome > 0) {
    const savingsRatio = (totalIncome - totalExpense) / totalIncome;
    if (savingsRatio >= 0.4) {
      healthScore = 95;
      healthTitle = language === 'tr' ? 'Mükemmel Tasarruf' : 'Excellent Savings';
      healthColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (savingsRatio >= 0.2) {
      healthScore = 80;
      healthTitle = language === 'tr' ? 'İyi & Güvenli' : 'Safe & Sound';
      healthColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (savingsRatio >= 0) {
      healthScore = 65;
      healthTitle = language === 'tr' ? 'Hassas Denge' : 'Delicate Balance';
      healthColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else {
      healthScore = 35;
      healthTitle = language === 'tr' ? 'Bütçe Açığı Uyarısı' : 'Budget Deficit Alert';
      healthColor = 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  } else if (totalExpense > 0) {
    healthScore = 25;
    healthTitle = language === 'tr' ? 'Sadece Gider Kayıtlı' : 'Expenses Only';
    healthColor = 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  // 2. Find Largest Single Expense
  const expenses = transactions.filter(tItem => tItem.type === 'expense');
  let maxExpense: Transaction | null = null;
  if (expenses.length > 0) {
    maxExpense = expenses.reduce((max, tItem) => (tItem.amount > max.amount ? tItem : max), expenses[0]);
  }

  // 3. Top Category Dominance
  const topCategory = breakdown[0];

  // 4. Daily Average Expense
  const dates = Array.from(new Set(transactions.map(tItem => tItem.date)));
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
              <span>{language === 'tr' ? 'Akıllı Finansal İçgörüler' : 'Smart Financial Insights'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 font-bold border border-indigo-500/30">
                AI ANALİZ
              </span>
            </h3>
            <p className="text-xs theme-muted">
              {language === 'tr'
                ? 'Harcama ritminize göre otomatik üretilen stratejik ipuçları'
                : 'Automated strategic advice calculated from your spending pattern'}
            </p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${healthColor} self-start sm:self-auto`}>
          <Award className="w-4 h-4" />
          <span>{language === 'tr' ? 'Skor' : 'Score'}: %{healthScore} • {healthTitle}</span>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {/* Insight 1: Health Ratio */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>{language === 'tr' ? 'Nakit Durumu' : 'Cash Position'}</span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold theme-text leading-snug">
              {balance >= 0 ? (
                <span>
                  {language === 'tr' ? (
                    <>Gelirleriniz giderlerinizin <strong className="text-emerald-500">üzerinde</strong> seyrediyor.</>
                  ) : (
                    <>Your income is <strong className="text-emerald-500">outpacing</strong> your expenses.</>
                  )}
                </span>
              ) : (
                <span>
                  {language === 'tr' ? (
                    <>Harcamalarınız gelirlerinizi <strong className="text-rose-500">aştı</strong>.</>
                  ) : (
                    <>Your expenses have <strong className="text-rose-500">exceeded</strong> your income.</>
                  )}
                </span>
              )}
            </p>
            <p className="text-[11px] theme-muted mt-1">
              {language === 'tr' ? 'Net Bakiye' : 'Net Balance'}: <span className="font-semibold">{formatPrivate(formatCurrency(balance))}</span>
            </p>
          </div>
        </div>

        {/* Insight 2: Top Category */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>{language === 'tr' ? 'En Çok Harcanan' : 'Top Expense'}</span>
          </div>
          <div className="mt-2">
            {topCategory ? (
              <>
                <p className="text-sm font-bold theme-text leading-snug">
                  {language === 'tr' ? (
                    <>Harcamaların <strong className="text-rose-500">%{topCategory.percentage.toFixed(0)}</strong> payı <strong>{topCategory.category}</strong> kategorisinde.</>
                  ) : (
                    <><strong>{topCategory.category}</strong> takes <strong className="text-rose-500">%{topCategory.percentage.toFixed(0)}</strong> of all spending.</>
                  )}
                </p>
                <p className="text-[11px] theme-muted mt-1">
                  {language === 'tr' ? 'Tutar' : 'Total'}: <span className="font-semibold">{formatPrivate(formatCurrency(topCategory.amount))}</span>
                </p>
              </>
            ) : (
              <p className="text-xs theme-muted">
                {language === 'tr' ? 'Gider kaydı bulunmuyor.' : 'No expense recorded.'}
              </p>
            )}
          </div>
        </div>

        {/* Insight 3: Daily Average */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{language === 'tr' ? 'Günlük Tempo' : 'Daily Pace'}</span>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold theme-text leading-snug">
              {language === 'tr' ? (
                <>İşlem günlerinde ortalama <strong className="text-amber-500">{formatPrivate(formatCurrency(dailyAverage))}</strong> harcıyorsunuz.</>
              ) : (
                <>Average active daily spend is <strong className="text-amber-500">{formatPrivate(formatCurrency(dailyAverage))}</strong>.</>
              )}
            </p>
            <p className="text-[11px] theme-muted mt-1">
              {language === 'tr' 
                ? `${daysCount} aktif günde ${expenses.length} harcama`
                : `${expenses.length} expenses over ${daysCount} active days`}
            </p>
          </div>
        </div>

        {/* Insight 4: Peak Expense */}
        <div className="p-3.5 rounded-xl theme-sub-card border theme-border flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold theme-muted">
            <AlertCircle className="w-4 h-4 text-purple-500" />
            <span>{language === 'tr' ? 'Zirve Harcama' : 'Peak Expense'}</span>
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
              <p className="text-xs theme-muted">
                {language === 'tr' ? 'Kayıtlı işlem yok.' : 'No recorded transactions.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
