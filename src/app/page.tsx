'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { TransactionList } from '@/components/transactions/TransactionList';
import { ChartsView } from '@/components/charts/ChartsView';
import { SmartInsights } from '@/components/dashboard/SmartInsights';
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
import { getCurrentYearMonth } from '@/lib/utils';
import { useGlobalModal } from '@/context/ModalContext';
import { Plus, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { openAddModal, refreshTrigger } = useGlobalModal();

  const [periodState, setPeriodState] = useState<PeriodState>({
    type: 'month',
    yearMonth: getCurrentYearMonth(),
  });

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [breakdown, setBreakdown] = useState<CategoryExpenseBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      await ensureInitialized();
      const [cats, trans, sum] = await Promise.all([
        db.categories.toArray(),
        getTransactionsByPeriod(periodState, filterType, searchQuery),
        getSummaryMetrics(periodState),
      ]);

      const catBreakdown = await getCategoryBreakdown(periodState, cats);

      setCategories(cats);
      setTransactions(trans);
      setSummary(sum);
      setBreakdown(catBreakdown);
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }, [periodState, filterType, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
            <span>Finansal Özet</span>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </h1>
          <p className="text-xs sm:text-sm theme-muted mt-1">
            Gelir ve giderlerinizi anlık olarak takip edin, bütçenizi yönetin.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Yeni İşlem Ekle</span>
        </button>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        periodState={periodState}
        onPeriodChange={next => setPeriodState(next)}
      />

      {/* Hero Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Smart Financial Insights (AI Analysis) */}
      <SmartInsights
        summary={summary}
        transactions={transactions}
        breakdown={breakdown}
      />

      {/* Visual Charts */}
      <ChartsView
        breakdown={breakdown}
        summary={summary}
        transactions={transactions}
      />

      {/* Transaction Feed */}
      <TransactionList
        transactions={transactions}
        categories={categories}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onEditTransaction={t => openAddModal(t)}
        onRefresh={loadData}
        onOpenAddModal={() => openAddModal()}
      />
    </div>
  );
}
