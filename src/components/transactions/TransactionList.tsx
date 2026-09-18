'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit3, ArrowUpCircle, ArrowDownCircle, Download, FileSpreadsheet } from 'lucide-react';
import { Transaction, Category } from '@/types';
import { formatCurrency, formatRelativeDate, exportTransactionsToCSV } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { db } from '@/lib/db';
import { useToast } from '@/components/ui/Toast';

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
    toast('📊 CSV dosyası indirildi.', 'success');
  };

  const visibleTransactions = transactions.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>İşlem Geçmişi</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
              {transactions.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Seçili döneme ait kayıtlar</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <button
              onClick={() => onFilterTypeChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => onFilterTypeChange('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => onFilterTypeChange('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Giderler
            </button>
          </div>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            title="Bu Listeyi CSV Olarak İndir"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Açıklama veya kategori ara..."
          value={searchQuery}
          onChange={e => onSearchQueryChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-700 px-1.5 py-0.5 rounded-md"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Transactions Feed */}
      <div className="flex flex-col gap-2.5 mt-1 max-h-[600px] overflow-y-auto pr-1">
        {visibleTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-300">İşlem Bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Bu dönemde kayıtlı bir gelir/gider yok veya aramanızla eşleşmedi.
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

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 transition-all"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        t.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {t.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-white truncate group-hover:text-indigo-300 transition-colors">
                        {t.description}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
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
                        t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(t)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
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
            className="w-full py-2.5 mt-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700/60 transition-colors cursor-pointer"
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
