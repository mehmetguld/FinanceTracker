'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { db, getAllCategories, DEFAULT_CATEGORIES } from '@/lib/db';
import { Transaction, Category, TransactionType } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Tag, FileText, AlertCircle, Check } from 'lucide-react';

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
  const { t } = useLanguage();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalCategories, setInternalCategories] = useState<Category[]>([]);

  // Validation States
  const [amountError, setAmountError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Active category list guaranteed to never be empty
  const activeCategories: (Category | Omit<Category, 'id'>)[] = 
    internalCategories.length > 0 
      ? internalCategories 
      : (categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES);

  useEffect(() => {
    if (isOpen) {
      getAllCategories().then(cats => {
        if (cats && cats.length > 0) {
          setInternalCategories(cats);
        }
      });
    }
  }, [isOpen]);

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
      setCategory(prev => prev || activeCategories[0]?.name || 'Diğer');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
    }
    setAmountError(null);
    setDateError(null);
    setIsShaking(false);
  }, [transactionToEdit, isOpen, categories, internalCategories]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    if (amountError) {
      setAmountError(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate(val);
    if (dateError) {
      setDateError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate amount
    const trimmedAmount = amount.trim();
    if (!trimmedAmount) {
      setAmountError(t('modal.amountRequired'));
      hasError = true;
    } else {
      const numAmount = parseFloat(trimmedAmount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setAmountError(t('modal.amountPositive'));
        hasError = true;
      }
    }

    // Validate date
    if (!date) {
      setDateError(t('modal.dateRequired'));
      hasError = true;
    }

    if (hasError) {
      // Trigger subtle shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      return;
    }

    const numAmount = parseFloat(amount.trim());
    const yearMonth = date.slice(0, 7);

    setIsSubmitting(true);
    try {
      const finalDesc = description.trim() || (type === 'income' ? t('modal.income') : t('modal.expense'));

      if (transactionToEdit && transactionToEdit.id) {
        await db.transactions.update(transactionToEdit.id, {
          type,
          amount: numAmount,
          category: category || 'Diğer',
          date,
          yearMonth,
          description: finalDesc,
        });
        toast(t('modal.updatedSuccess'), 'success');
      } else {
        await db.transactions.add({
          type,
          amount: numAmount,
          category: category || 'Diğer',
          date,
          yearMonth,
          description: finalDesc,
          createdAt: Date.now(),
        });
        toast(`✅ ${type === 'income' ? t('modal.income') : t('modal.expense')} ${t('modal.savedSuccess')}: ₺${numAmount.toFixed(2)}`, 'success');
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast(`Kaydetme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? t('modal.editTitle') : t('modal.newTitle')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl theme-sub-card border theme-border">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'theme-muted hover:opacity-100'
            }`}
          >
            <span>💸</span>
            <span>{t('modal.expense')}</span>
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'theme-muted hover:opacity-100'
            }`}
          >
            <span>💰</span>
            <span>{t('modal.income')}</span>
          </button>
        </div>

        {/* Amount Input with Inline Validation & Shake */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider theme-muted mb-2">
            {t('modal.amount')}
          </label>
          <motion.div
            animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold theme-muted">
              ₺
            </span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              autoFocus
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl theme-input border text-2xl sm:text-3xl font-extrabold theme-text placeholder-slate-500/50 focus:outline-none transition-all ${
                amountError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'theme-border focus:border-indigo-500'
              }`}
            />
          </motion.div>
          {amountError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-2 px-1"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{amountError}</span>
            </motion.div>
          )}
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-muted mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('modal.category')}</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl theme-input border theme-border theme-text font-medium text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {activeCategories.map(c => (
                <option key={c.name} value={c.name} className="theme-card theme-text">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-muted mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('modal.date')}</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className={`w-full px-3.5 py-3 rounded-xl theme-input border font-medium text-sm focus:outline-none theme-text cursor-pointer transition-all ${
                dateError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'theme-border focus:border-indigo-500'
              }`}
            />
            {dateError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-1 px-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{dateError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description / Note Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider theme-muted mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('modal.note')}</span>
          </label>
          <textarea
            rows={4}
            placeholder={t('modal.notePlaceholder')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl theme-input border theme-border theme-text text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500/50 resize-none transition-colors"
          />
        </div>

        {/* Submit & Cancel Buttons with Tactile Feedback */}
        <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t theme-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl theme-sub-card theme-text font-medium text-sm hover:opacity-80 border theme-border transition-colors cursor-pointer active:scale-95"
          >
            {t('modal.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-xl text-white font-bold text-sm shadow-xl active:scale-95 transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
            }`}
          >
            {isSubmitting
              ? t('modal.saving')
              : transactionToEdit
              ? t('modal.saveChanges')
              : t('modal.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
