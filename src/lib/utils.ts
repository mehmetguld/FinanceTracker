import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transaction } from '@/types';

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
 * Excel (.xls) Styled Spreadsheet Generator:
 * Generates an XML/HTML formatted Excel spreadsheet with colorful styled headers,
 * formatted numbers, colored rows (green for income, red for expense),
 * and a summary calculation footer!
 */
export function exportTransactionsToExcel(transactions: Transaction[], filename: string = 'gelir-gider-tablosu.xls') {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>İşlemler</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Calibri, sans-serif; font-size: 11pt; }
        th { background-color: #4F46E5; color: #FFFFFF; font-weight: bold; border: 1px solid #3730A3; padding: 10px; text-align: left; }
        td { border: 1px solid #CBD5E1; padding: 8px; }
        .income { color: #16A34A; font-weight: bold; text-align: right; }
        .expense { color: #E11D48; font-weight: bold; text-align: right; }
        .amount { text-align: right; }
        .center { text-align: center; }
        .footer-label { font-weight: bold; background-color: #E2E8F0; }
        .footer-val { font-weight: bold; background-color: #E2E8F0; text-align: right; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>İşlem Türü</th>
            <th>Kategori</th>
            <th>Açıklama</th>
            <th>Tutar (₺)</th>
            <th>Net Bakiye Etkisi (₺)</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              t => `
            <tr>
              <td class="center">${t.date}</td>
              <td class="${t.type === 'income' ? 'income' : 'expense'}">${t.type === 'income' ? 'Gelir' : 'Gider'}</td>
              <td>${t.category}</td>
              <td>${(t.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
              <td class="amount">₺${t.amount.toFixed(2).replace('.', ',')}</td>
              <td class="${t.type === 'income' ? 'income' : 'expense'}">${t.type === 'income' ? '+' : '-'}₺${t.amount.toFixed(2).replace('.', ',')}</td>
            </tr>
          `
            )
            .join('')}
          <tr>
            <td colspan="4" class="footer-label">TOPLAM GELİR:</td>
            <td colspan="2" class="footer-val" style="color: #16A34A;">₺${totalIncome.toFixed(2).replace('.', ',')}</td>
          </tr>
          <tr>
            <td colspan="4" class="footer-label">TOPLAM GİDER:</td>
            <td colspan="2" class="footer-val" style="color: #E11D48;">₺${totalExpense.toFixed(2).replace('.', ',')}</td>
          </tr>
          <tr>
            <td colspan="4" class="footer-label">NET BAKİYE:</td>
            <td colspan="2" class="footer-val" style="color: #4F46E5;">₺${balance.toFixed(2).replace('.', ',')}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  downloadFile(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}
