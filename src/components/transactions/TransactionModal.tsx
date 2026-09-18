'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/db';
import { Transaction, Category, TransactionType } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { DollarSign, Calendar, Tag, FileText } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categories: Category[];
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
  transactionToEdit,
}: TransactionModalProps) {
  const { toast } = useToast();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setDescription(transactionToEdit.description || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory(categories[0]?.name || 'Diğer');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
    }
  }, [transactionToEdit, isOpen, categories]);

  const addAmountPreset = (extra: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + extra));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast('Lütfen geçerli bir tutar girin.', 'warning');
      return;
    }

    if (!date) {
      toast('Lütfen tarih seçin.', 'warning');
      return;
    }

    const yearMonth = date.slice(0, 7);

    setIsSubmitting(true);
    try {
      if (transactionToEdit && transactionToEdit.id) {
        await db.transactions.update(transactionToEdit.id, {
          type,
          amount: numAmount,
          category: category || 'Diğer',
          date,
          yearMonth,
          description: description.trim() || (type === 'income' ? 'Gelir' : 'Gider'),
        });
        toast('İşlem başarıyla güncellendi.', 'success');
      } else {
        await db.transactions.add({
          type,
          amount: numAmount,
          category: category || 'Diğer',
          date,
          yearMonth,
          description: description.trim() || (type === 'income' ? 'Gelir' : 'Gider'),
          createdAt: Date.now(),
        });
        toast(`✅ ${type === 'income' ? 'Gelir' : 'Gider'} kaydedildi: ₺${numAmount.toFixed(2)}`, 'success');
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast(`Kaydetme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickPresets = [50, 100, 250, 500, 1000];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? '✏️ İşlemi Düzenle' : '✨ Yeni İşlem Ekle'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💸</span>
            <span>Gider</span>
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💰</span>
            <span>Gelir</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Tutar (₺)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">
              ₺
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              autoFocus
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-2xl sm:text-3xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick Amount Pills */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {quickPresets.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => addAmountPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors shrink-0"
              >
                +{preset}₺
              </button>
            ))}
          </div>
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kategori</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full px-3.5 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium text-sm focus:outline-none focus:border-indigo-500"
            >
              {categories.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tarih</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-medium text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Açıklama / Not</span>
          </label>
          <input
            type="text"
            placeholder="Örn: Market alışverişi, Fatura vb."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-xl text-white font-bold text-sm shadow-xl transition-all ${
              type === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
            }`}
          >
            {isSubmitting ? 'Kaydediliyor...' : transactionToEdit ? 'Değişiklikleri Kaydet' : '💾 İşlemi Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
