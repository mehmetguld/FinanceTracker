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

  const [deleteCandidate, setDeleteCandidate] = useState<Transaction | null>(null);
  const [visibleCount, setVisibleCount] = useState(25);

  const catMap = new Map<string, Category>();
  categories.forEach(c => catMap.set(c.name, c));

  const handleDelete = async () => {
    if (!deleteCandidate || !deleteCandidate.id) return;
    try {
      await db.transactions.delete(deleteCandidate.id);
      toast('İşlem silindi.', 'success');
      onRefresh();
    } catch (err: any) {
      toast(`Silme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast('Dışa aktarılacak işlem bulunamadı.', 'warning');
      return;
    }
    exportTransactionsToCSV(transactions);
    toast('📊 CSV dosyası indirildi (Excel uyumlu).', 'success');
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      toast('Dışa aktarılacak işlem bulunamadı.', 'warning');
      return;
    }
    exportTransactionsToExcel(transactions);
    toast('📗 Excel tablosu (.xls) indirildi.', 'success');
  };

  const visibleTransactions = transactions.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-4 theme-card p-4 sm:p-6 rounded-2xl shadow-sm">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b theme-border">
        <div>
          <h3 className="text-lg font-bold theme-text tracking-tight flex items-center gap-2">
            <span>İşlem Geçmişi</span>
            <span className="text-xs px-2 py-0.5 rounded-full theme-sub-card theme-muted font-semibold border theme-border">
              {transactions.length}
            </span>
          </h3>
          <p className="text-xs theme-muted mt-0.5">Seçili döneme ait kayıtlar</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl theme-sub-card border theme-border">
            <button
              onClick={() => onFilterTypeChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => onFilterTypeChange('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => onFilterTypeChange('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Giderler
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleExportExcel}
            title="Excel Tablosu (.xls) İndir"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="CSV Dosyası İndir"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Live Search Input & Quick Filter Chips */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Açıklama veya kategori ara..."
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl theme-input border theme-border text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs theme-muted hover:opacity-100 theme-sub-card px-2 py-0.5 rounded-md cursor-pointer"
            >
              Temizle
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
            <p className="text-base font-semibold theme-text">İşlem Bulunamadı</p>
            <p className="text-xs theme-muted mt-1 max-w-xs">
              Bu kriterlere uyan kayıt bulunamadı.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              + Yeni İşlem Ekle
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {visibleTransactions.map(t => {
              const cat = catMap.get(t.category);
              const catColor = cat?.color || '#94a3b8';
              const formattedAmt = formatPrivate((t.type === 'income' ? '+' : '-') + formatCurrency(t.amount));

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between p-3.5 rounded-xl theme-sub-card hover:border-indigo-500/40 border theme-border transition-all"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        t.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {t.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm theme-text truncate group-hover:text-indigo-500 transition-colors">
                        {t.description}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs theme-muted">
                          {formatRelativeDate(t.date)}
                        </span>
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Amount & Actions */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
                    <span
                      className={`text-base sm:text-lg font-extrabold tracking-tight ${
                        t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {formattedAmt}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1.5 rounded-lg theme-sub-card theme-text hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(t)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
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
            className="w-full py-2.5 mt-2 rounded-xl theme-sub-card theme-text font-semibold text-xs border theme-border transition-colors cursor-pointer"
          >
            Daha Fazla Göster ({transactions.length - visibleCount} kalan)
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="İşlemi Sil"
        description={`"${deleteCandidate?.description}" (${formatCurrency(deleteCandidate?.amount || 0)}) işlemini kalıcı olarak silmek istediğinizden emin misiniz?`}
        confirmText="Evet, Sil"
        isDanger={true}
      />
    </div>
  );
}
