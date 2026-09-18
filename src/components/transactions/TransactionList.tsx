'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';
import { Transaction, Category } from '@/types';
import { formatCurrency, formatRelativeDate, exportTransactionsToCSV, exportTransactionsToExcel } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { db } from '@/lib/db';
import { useToast } from '@/components/ui/Toast';
import { usePrivacy } from '@/context/PrivacyContext';
import { useLanguage } from '@/context/LanguageContext';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  filterType: 'all' | 'income' | 'expense';
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export function TransactionList({
  transactions,
  categories,
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchQueryChange,
  onEditTransaction,
  onRefresh,
  onOpenAddModal,
}: TransactionListProps) {
  const { toast } = useToast();
  const { formatPrivate } = usePrivacy();
  const { t, language } = useLanguage();

  const [deleteCandidate, setDeleteCandidate] = useState<Transaction | null>(null);
  const [visibleCount, setVisibleCount] = useState(25);

  const catMap = new Map<string, Category>();
  categories.forEach(c => catMap.set(c.name, c));

  const handleDelete = async () => {
    if (!deleteCandidate || !deleteCandidate.id) return;
    try {
      await db.transactions.delete(deleteCandidate.id);
      toast(t('transactions.deletedToast'), 'success');
      onRefresh();
    } catch (err: any) {
      toast(`${t('transactions.deleteError')}: ${err?.message || 'Bilinmiyor'}`, 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast(t('transactions.noExportData'), 'warning');
      return;
    }
    exportTransactionsToCSV(transactions);
    toast(t('transactions.csvDownloaded'), 'success');
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      toast(t('transactions.noExportData'), 'warning');
      return;
    }
    exportTransactionsToExcel(transactions);
    toast(t('transactions.excelDownloaded'), 'success');
  };

  const visibleTransactions = transactions.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-4 theme-card p-4 sm:p-6 rounded-2xl shadow-sm">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b theme-border">
        <div>
          <h3 className="text-lg font-bold theme-text tracking-tight flex items-center gap-2">
            <span>{t('transactions.title')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full theme-sub-card theme-muted font-semibold border theme-border">
              {transactions.length}
            </span>
          </h3>
          <p className="text-xs theme-muted mt-0.5">{t('transactions.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl theme-sub-card border theme-border">
            <button
              onClick={() => onFilterTypeChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              {t('transactions.all')}
            </button>
            <button
              onClick={() => onFilterTypeChange('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              {t('transactions.income')}
            </button>
            <button
              onClick={() => onFilterTypeChange('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              {t('transactions.expense')}
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleExportExcel}
            title="Excel Tablosu (.xls) İndir"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">{t('transactions.excelExport')}</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="CSV Dosyası İndir"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">{t('transactions.csvExport')}</span>
          </button>
        </div>
      </div>

      {/* Live Search Input */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('transactions.searchPlaceholder')}
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl theme-input border theme-border text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs theme-muted hover:opacity-100 theme-sub-card px-2 py-0.5 rounded-md cursor-pointer active:scale-95"
            >
              {t('transactions.clear')}
            </button>
          )}
        </div>
      </div>

      {/* Transactions Feed */}
      <div className="flex flex-col gap-2.5 mt-1 max-h-[600px] overflow-y-auto pr-1">
        {visibleTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl theme-sub-card flex items-center justify-center theme-muted mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold theme-text">{t('transactions.noTransactionsTitle')}</p>
            <p className="text-xs theme-muted mt-1 max-w-xs">
              {t('transactions.noTransactionsDesc')}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer active:scale-95"
            >
              + {t('transactions.addFirst')}
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {visibleTransactions.map(tItem => {
              const cat = catMap.get(tItem.category);
              const catColor = cat?.color || '#94a3b8';

              return (
                <motion.div
                  key={tItem.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between p-3.5 rounded-xl theme-sub-card border theme-border hover:border-indigo-500/30 transition-all"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        tItem.type === 'income'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tItem.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm theme-text truncate">
                          {tItem.description || (tItem.type === 'income' ? t('modal.income') : t('modal.expense'))}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor,
                          }}
                        >
                          {tItem.category}
                        </span>
                      </div>
                      <span className="text-[11px] theme-muted mt-0.5">
                        {formatRelativeDate(tItem.date)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span
                      className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        tItem.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tItem.type === 'income' ? '+' : '-'}
                      {formatPrivate(formatCurrency(tItem.amount))}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-70 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tItem)}
                        className="p-1.5 rounded-lg theme-sub-card theme-text hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer active:scale-95"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(tItem)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer active:scale-95"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Load More Button for Scalability */}
        {transactions.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 25)}
            className="w-full py-2.5 mt-2 rounded-xl theme-sub-card theme-text font-semibold text-xs border theme-border transition-colors cursor-pointer active:scale-95"
          >
            {t('transactions.loadMore')} ({transactions.length - visibleCount} {t('transactions.remaining')})
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title={t('transactions.deleteTitle')}
        description={`"${deleteCandidate?.description}" (${formatCurrency(deleteCandidate?.amount || 0)}) ${t('transactions.deleteDesc')}`}
        confirmText={t('transactions.confirmDelete')}
        isDanger={true}
      />
    </div>
  );
}
