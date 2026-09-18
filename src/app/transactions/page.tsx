'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { TransactionList } from '@/components/transactions/TransactionList';
import { db, ensureInitialized, getTransactionsByPeriod } from '@/lib/db';
import { PeriodState, Transaction, Category } from '@/types';
import { getCurrentYearMonth } from '@/lib/utils';
import { useGlobalModal } from '@/context/ModalContext';
import { Receipt, Plus } from 'lucide-react';

export default function TransactionsPage() {
  const { openAddModal, refreshTrigger } = useGlobalModal();

  const [periodState, setPeriodState] = useState<PeriodState>({
    type: 'month',
    yearMonth: getCurrentYearMonth(),
  });

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = useCallback(async () => {
    await ensureInitialized();
    const [cats, trans] = await Promise.all([
      db.categories.toArray(),
      getTransactionsByPeriod(periodState, filterType, searchQuery),
    ]);
    setCategories(cats);
    setTransactions(trans);
  }, [periodState, filterType, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-500" />
            <span>İşlem Kayıtları</span>
          </h1>
          <p className="text-xs sm:text-sm theme-muted mt-1">
            Tüm gelir ve harcamalarınızı arayın, filtreleyin ve yönetin.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Yeni İşlem</span>
        </button>
      </div>

      <PeriodSelector
        periodState={periodState}
        onPeriodChange={next => setPeriodState(next)}
      />

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
