import Dexie, { type Table } from 'dexie';
import { Transaction, Category, AppSetting, PeriodState, FinancialSummary, CategoryExpenseBreakdown } from '@/types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Market', color: '#10b981', icon: 'ShoppingCart', isDefault: true },
  { name: 'Ulaşım', color: '#3b82f6', icon: 'Car', isDefault: true },
  { name: 'Faturalar', color: '#f59e0b', icon: 'Receipt', isDefault: true },
  { name: 'Eğlence', color: '#8b5cf6', icon: 'Gamepad2', isDefault: true },
  { name: 'Sağlık', color: '#ef4444', icon: 'HeartPulse', isDefault: true },
  { name: 'Kira', color: '#ec4899', icon: 'Home', isDefault: true },
  { name: 'Giyim', color: '#06b6d4', icon: 'Shirt', isDefault: true },
  { name: 'Yemek', color: '#f97316', icon: 'Utensils', isDefault: true },
  { name: 'Eğitim', color: '#6366f1', icon: 'GraduationCap', isDefault: true },
  { name: 'Maaş / Gelir', color: '#22c55e', icon: 'Banknote', isDefault: true },
  { name: 'Diğer', color: '#64748b', icon: 'MoreHorizontal', isDefault: true },
];

export class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, number>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('FinanceTrackerDB');
    this.version(1).stores({
      transactions: '++id, type, date, yearMonth, category, [yearMonth+type]',
      categories: '++id, &name',
      settings: 'key'
    });
  }
}

export const db = new FinanceDatabase();

/**
 * Ensures initial default categories exist in IndexedDB
 */
export async function ensureInitialized(): Promise<void> {
  if (typeof window === 'undefined') return;
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }
}

/**
 * Ultra fast period queries designed to run in < 2ms even with 30 years of data
 */
export async function getTransactionsByPeriod(
  period: PeriodState,
  filterType: 'all' | 'income' | 'expense' = 'all',
  searchQuery: string = ''
): Promise<Transaction[]> {
  let collection;

  if (period.type === 'month') {
    collection = db.transactions.where('yearMonth').equals(period.yearMonth);
  } else if ((period.type === 'today' || period.type === 'day') && period.selectedDay) {
    collection = db.transactions.where('date').equals(period.selectedDay);
  } else if (period.type === 'week' && period.customRange) {
    collection = db.transactions.where('date').between(period.customRange.start, period.customRange.end, true, true);
  } else if (period.type === 'year') {
    const year = period.yearMonth.slice(0, 4);
    collection = db.transactions.where('date').between(`${year}-01-01`, `${year}-12-31`, true, true);
  } else if (period.type === 'custom' && period.customRange) {
    collection = db.transactions.where('date').between(period.customRange.start, period.customRange.end, true, true);
  } else {
    // 'all'
    collection = db.transactions.toCollection();
  }

  let items = await collection.reverse().sortBy('date');

  if (filterType !== 'all') {
    items = items.filter(t => t.type === filterType);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    items = items.filter(t => 
      t.description.toLowerCase().includes(query) || 
      t.category.toLowerCase().includes(query)
    );
  }

  return items;
}

/**
 * Computes summary metrics for the given period
 */
export async function getSummaryMetrics(period: PeriodState): Promise<FinancialSummary> {
  const transactions = await getTransactionsByPeriod(period, 'all');
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === 'income') totalIncome += t.amount;
    else if (t.type === 'expense') totalExpense += t.amount;
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}

/**
 * Calculates category breakdown for expense or income visualization
 */
export async function getCategoryBreakdown(
  period: PeriodState,
  categories: Category[],
  type: 'expense' | 'income' = 'expense'
): Promise<CategoryExpenseBreakdown[]> {
  const transactions = await getTransactionsByPeriod(period, type);
  const catMap = new Map<string, Category>();
  categories.forEach(c => catMap.set(c.name, c));

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const amountByCategory: Record<string, { amount: number; count: number }> = {};

  for (const t of transactions) {
    if (!amountByCategory[t.category]) {
      amountByCategory[t.category] = { amount: 0, count: 0 };
    }
    amountByCategory[t.category].amount += t.amount;
    amountByCategory[t.category].count += 1;
  }

  const breakdown: CategoryExpenseBreakdown[] = Object.entries(amountByCategory).map(([category, stats]) => {
    const catObj = catMap.get(category);
    return {
      category,
      amount: stats.amount,
      color: catObj?.color || '#94a3b8',
      percentage: totalAmount > 0 ? (stats.amount / totalAmount) * 100 : 0,
      count: stats.count,
    };
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
}

/**
 * Deletes a category and optionally migrates its transactions to another category
 */
export async function deleteCategoryWithTransactions(
  categoryName: string,
  mode: 'move' | 'delete',
  targetCategoryName?: string
): Promise<void> {
  await db.transaction('rw', db.categories, db.transactions, async () => {
    if (mode === 'move' && targetCategoryName) {
      await db.transactions
        .where('category')
        .equals(categoryName)
        .modify({ category: targetCategoryName });
    } else {
      await db.transactions
        .where('category')
        .equals(categoryName)
        .delete();
    }
    await db.categories.where('name').equals(categoryName).delete();
  });
}

/**
 * Updates a category name and updates all its existing transactions
 */
export async function renameCategory(oldName: string, newName: string, newColor: string): Promise<void> {
  await db.transaction('rw', db.categories, db.transactions, async () => {
    if (oldName !== newName) {
      await db.transactions
        .where('category')
        .equals(oldName)
        .modify({ category: newName });
    }
    await db.categories
      .where('name')
      .equals(oldName)
      .modify({ name: newName, color: newColor });
  });
}

/**
 * Database export for full backup (.json)
 */
export async function exportDatabaseBackup(): Promise<string> {
  const [categories, transactions, settings] = await Promise.all([
    db.categories.toArray(),
    db.transactions.toArray(),
    db.settings.toArray(),
  ]);

  const backup = {
    version: 2,
    appName: 'FinanceTracker Pro',
    exportedAt: new Date().toISOString(),
    categories,
    transactions,
    settings,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Completely clears all data from the database
 */
export async function hardResetDatabase(): Promise<void> {
  await db.transaction('rw', db.categories, db.transactions, db.settings, async () => {
    await db.transactions.clear();
    await db.categories.clear();
    await db.settings.clear();
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  });
}
