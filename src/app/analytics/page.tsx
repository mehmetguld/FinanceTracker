'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { ChartsView } from '@/components/charts/ChartsView';
import { 
  db, 
  ensureInitialized, 
  getTransactionsByPeriod, 
  getSummaryMetrics, 
  getCategoryBreakdown 
} from '@/lib/db';
import { 
  PeriodState, 
  Transaction, 
  Category, 
  FinancialSummary, 
  CategoryExpenseBreakdown 
} from '@/types';
import { getCurrentYearMonth, formatCurrency } from '@/lib/utils';
import { useGlobalModal } from '@/context/ModalContext';
import { PieChart, TrendingDown } from 'lucide-react';

export default function AnalyticsPage() {
  const { refreshTrigger } = useGlobalModal();

  const [periodState, setPeriodState] = useState<PeriodState>({
    type: 'month',
    yearMonth: getCurrentYearMonth(),
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [breakdown, setBreakdown] = useState<CategoryExpenseBreakdown[]>([]);

  const loadData = useCallback(async () => {
    await ensureInitialized();
    const [cats, trans, sum] = await Promise.all([
      db.categories.toArray(),
      getTransactionsByPeriod(periodState, 'all'),
      getSummaryMetrics(periodState),
    ]);

    const catBreakdown = await getCategoryBreakdown(periodState, cats);

    setCategories(cats);
    setTransactions(trans);
    setSummary(sum);
    setBreakdown(catBreakdown);
  }, [periodState]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
          <PieChart className="w-6 h-6 text-indigo-500" />
          <span>Grafikler & Finansal Analiz</span>
        </h1>
        <p className="text-xs sm:text-sm theme-muted mt-1">
          Harcama alışkanlıklarınızı ve bütçe dengenizi görsel grafiklerle inceleyin.
        </p>
      </div>

      <PeriodSelector
        periodState={periodState}
        onPeriodChange={next => setPeriodState(next)}
      />

      <ChartsView
        breakdown={breakdown}
        summary={summary}
        transactions={transactions}
      />

      {/* Top Expense Breakdown Table */}
      <div className="theme-card p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold theme-text mb-4 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-rose-500" />
          <span>Kategori Bazında Harcama Sıralaması</span>
        </h3>

        {breakdown.length === 0 ? (
          <p className="text-sm theme-muted py-6 text-center">Bu dönemde kayıtlı gider bulunmuyor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b theme-border text-xs font-bold theme-muted uppercase">
                  <th className="pb-3 pl-1">Kategori</th>
                  <th className="pb-3 text-right">İşlem Sayısı</th>
                  <th className="pb-3 text-right">Harcama Payı</th>
                  <th className="pb-3 text-right pr-1">Toplam Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {breakdown.map(item => (
                  <tr key={item.category} className="hover:opacity-80 transition-opacity">
                    <td className="py-3.5 pl-1 flex items-center gap-2.5 font-semibold theme-text">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.category}</span>
                    </td>
                    <td className="py-3.5 text-right theme-muted">{item.count} adet</td>
                    <td className="py-3.5 text-right font-medium theme-text">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full theme-sub-card overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span>%{item.percentage.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-rose-600 dark:text-rose-400 pr-1">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
