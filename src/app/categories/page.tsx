'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CategoryManager } from '@/components/categories/CategoryManager';
import { db, ensureInitialized } from '@/lib/db';
import { Category, Transaction } from '@/types';
import { useGlobalModal } from '@/context/ModalContext';
import { Tags } from 'lucide-react';

export default function CategoriesPage() {
  const { refreshTrigger } = useGlobalModal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = useCallback(async () => {
    await ensureInitialized();
    const [cats, trans] = await Promise.all([
      db.categories.toArray(),
      db.transactions.toArray(),
    ]);
    setCategories(cats);
    setTransactions(trans);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Tags className="w-6 h-6 text-indigo-400" />
          <span>Kategori Yönetimi</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Harcama ve gelirlerinizi sınıflandırın, özel renkler tanımlayın ve yönetin.
        </p>
      </div>

      <CategoryManager
        categories={categories}
        transactions={transactions}
        onRefresh={loadData}
      />
    </div>
  );
}
