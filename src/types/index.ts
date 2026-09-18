export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // 'YYYY-MM-DD'
  yearMonth: string; // 'YYYY-MM' -> Indexed for ultra-fast monthly queries over 30 years
  description: string;
  createdAt: number;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  icon?: string;
  isDefault?: boolean;
}

export interface AppSetting {
  key: string;
  value: any;
}

export type PeriodFilter = 'month' | 'week' | 'year' | 'all' | 'custom' | 'day';

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

export interface PeriodState {
  type: PeriodFilter;
  yearMonth: string; // e.g. '2026-09'
  customRange?: DateRange;
  selectedDay?: string; // YYYY-MM-DD
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryExpenseBreakdown {
  category: string;
  amount: number;
  color: string;
  percentage: number;
  count: number;
}

export interface DailyTrendPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}
