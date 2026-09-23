import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transaction } from '@/types';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getActiveLocale(override?: string): string {
  if (override) return override === 'en' ? 'en-US' : 'tr-TR';
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('finance_tracker_lang') || document.documentElement.lang;
    return saved === 'en' ? 'en-US' : 'tr-TR';
  }
  return 'tr-TR';
}

export function formatCurrency(amount: number, locale?: string): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const activeLocale = locale || getActiveLocale();
  
  const formatted = new Intl.NumberFormat(activeLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₺${formatted}`;
}

export function formatDate(dateStr: string, locale?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const activeLocale = locale || getActiveLocale();
  return new Intl.DateTimeFormat(activeLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(dateStr: string, locale?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  const activeLocale = locale || getActiveLocale();
  const isEn = activeLocale.startsWith('en');
  
  const isToday = 
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
    
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return isEn ? 'Today' : 'Bugün';
  if (isYesterday) return isEn ? 'Yesterday' : 'Dün';

  return formatDate(dateStr, locale);
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthName(yearMonth: string, locale?: string): string {
  if (!yearMonth) return '';
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  const activeLocale = locale || getActiveLocale();
  
  return new Intl.DateTimeFormat(activeLocale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getPreviousMonth(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;

  month -= 1;
  if (month < 0) {
    month = 11;
    year -= 1;
  }

  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function getNextMonth(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;

  month += 1;
  if (month > 11) {
    month = 0;
    year += 1;
  }

  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    start: format(monday),
    end: format(sunday),
  };
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Excel-Compatible Clean CSV Generator:
 * Uses sep=;\r\n so Microsoft Excel automatically parses columns.
 * Uses comma as decimal separator (1250,50) for native Excel formulas in Turkish Windows.
 */
export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'gelir-gider-raporu.csv') {
  const headers = ['Tarih', 'İşlem Türü', 'Kategori', 'Açıklama', 'Tutar (TL)', 'Net Bakiye Etkisi (TL)'];
  
  const rows = transactions.map(t => {
    const formattedAmount = t.amount.toFixed(2).replace('.', ',');
    const netEffect = (t.type === 'income' ? '+' : '-') + formattedAmount;
    return [
      t.date,
      t.type === 'income' ? 'Gelir' : 'Gider',
      t.category,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      formattedAmount,
      netEffect,
    ];
  });

  // sep=; explicitly informs Excel which delimiter is used
  const csvContent = [
    'sep=;',
    headers.join(';'),
    ...rows.map(row => row.join(';')),
  ].join('\r\n');

  // Add UTF-8 BOM for Turkish character support (ç, ş, ı, ö, ü, ğ)
  const bom = '\ufeff';
  downloadFile(bom + csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Real Microsoft Excel (.xlsx) Spreadsheet Generator:
 * Generates an actual, valid binary Office Open XML (.xlsx) workbook using SheetJS.
 * Opens seamlessly across Windows/Mac Excel, Excel Mobile (iOS/Android),
 * Google Sheets, and LibreOffice without any warning or corruption prompt!
 */
export function exportTransactionsToExcel(transactions: Transaction[], filename: string = 'gelir-gider-tablosu.xlsx') {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const rows = transactions.map(t => ({
    'Tarih': t.date,
    'İşlem Türü': t.type === 'income' ? 'Gelir' : 'Gider',
    'Kategori': t.category,
    'Açıklama': t.description || '',
    'Tutar (TL)': t.amount,
    'Net Bakiye Etkisi (TL)': (t.type === 'income' ? 1 : -1) * t.amount,
  }));

  // Summary footer rows
  rows.push({
    'Tarih': '',
    'İşlem Türü': '',
    'Kategori': '',
    'Açıklama': 'TOPLAM GELİR',
    'Tutar (TL)': totalIncome,
    'Net Bakiye Etkisi (TL)': totalIncome,
  });
  rows.push({
    'Tarih': '',
    'İşlem Türü': '',
    'Kategori': '',
    'Açıklama': 'TOPLAM GİDER',
    'Tutar (TL)': totalExpense,
    'Net Bakiye Etkisi (TL)': -totalExpense,
  });
  rows.push({
    'Tarih': '',
    'İşlem Türü': '',
    'Kategori': '',
    'Açıklama': 'NET BAKİYE',
    'Tutar (TL)': balance,
    'Net Bakiye Etkisi (TL)': balance,
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths for comfortable reading
  ws['!cols'] = [
    { wch: 13 }, // Tarih
    { wch: 12 }, // İşlem Türü
    { wch: 18 }, // Kategori
    { wch: 32 }, // Açıklama
    { wch: 15 }, // Tutar (TL)
    { wch: 22 }, // Net Bakiye Etkisi (TL)
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'İşlemler');

  const finalName = filename.endsWith('.xlsx')
    ? filename
    : filename.replace(/\.xls$/, '') + '.xlsx';

  XLSX.writeFile(wb, finalName);
}
