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
import { PieChart, TrendingDown, TrendingUp } from 'lucide-react';

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
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryExpenseBreakdown[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryExpenseBreakdown[]>([]);
  const [tableTab, setTableTab] = useState<'expense' | 'income'>('expense');

  const loadData = useCallback(async () => {
    await ensureInitialized();
    const [cats, trans, sum] = await Promise.all([
      db.categories.toArray(),
      getTransactionsByPeriod(periodState, 'all'),
      getSummaryMetrics(periodState),
    ]);

    const [expBreakdown, incBreakdown] = await Promise.all([
      getCategoryBreakdown(periodState, cats, 'expense'),
      getCategoryBreakdown(periodState, cats, 'income'),
    ]);

    setCategories(cats);
    setTransactions(trans);
    setSummary(sum);
    setExpenseBreakdown(expBreakdown);
    setIncomeBreakdown(incBreakdown);
  }, [periodState]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  const activeTableBreakdown = tableTab === 'expense' ? expenseBreakdown : incomeBreakdown;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
          <PieChart className="w-6 h-6 text-indigo-500" />
          <span>Grafikler & Finansal Analiz</span>
        </h1>
        <p className="text-xs sm:text-sm theme-muted mt-1">
          Harcama ve gelir dengenizi, kategori dağılımlarını görsel grafiklerle derinlemesine inceleyin.
        </p>
      </div>

      <PeriodSelector
        periodState={periodState}
        onPeriodChange={next => setPeriodState(next)}
      />

      <ChartsView
        breakdown={expenseBreakdown}
        expenseBreakdown={expenseBreakdown}
        incomeBreakdown={incomeBreakdown}
        summary={summary}
        transactions={transactions}
      />

      {/* Category Breakdown Table (with Income / Expense Switcher) */}
      <div className="theme-card p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold theme-text flex items-center gap-2">
            {tableTab === 'expense' ? (
              <TrendingDown className="w-4 h-4 text-rose-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            )}
            <span>
              {tableTab === 'expense' ? 'Kategori Bazında Gider Sıralaması' : 'Kategori Bazında Gelir Sıralaması'}
            </span>
          </h3>

          <div className="flex items-center p-1 rounded-xl theme-sub-card border theme-border self-start sm:self-auto">
            <button
              onClick={() => setTableTab('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tableTab === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Giderler
            </button>
            <button
              onClick={() => setTableTab('income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tableTab === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Gelirler
            </button>
          </div>
        </div>

        {activeTableBreakdown.length === 0 ? (
          <p className="text-sm theme-muted py-8 text-center">
            {tableTab === 'expense' 
              ? 'Bu dönemde kayıtlı gider bulunmuyor.' 
              : 'Bu dönemde kayıtlı gelir bulunmuyor.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b theme-border text-xs font-bold theme-muted uppercase">
                  <th className="pb-3 pl-1">Kategori</th>
                  <th className="pb-3 text-right">İşlem Sayısı</th>
                  <th className="pb-3 text-right">
                    {tableTab === 'expense' ? 'Harcama Payı' : 'Gelir Payı'}
                  </th>
                  <th className="pb-3 text-right pr-1">Toplam Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {activeTableBreakdown.map(item => (
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
                    <td className={`py-3.5 text-right font-extrabold pr-1 ${
                      tableTab === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
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
