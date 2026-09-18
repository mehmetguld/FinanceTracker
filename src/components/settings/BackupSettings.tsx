'use client';

import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Printer, 
  FileSpreadsheet, 
  FileText,
  Globe
} from 'lucide-react';
import { exportDatabaseBackup, hardResetDatabase, db } from '@/lib/db';
import { importDataFromJson } from '@/lib/legacy-import';
import { downloadFile, exportTransactionsToCSV, exportTransactionsToExcel, formatCurrency } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';

interface BackupSettingsProps {
  onRefresh: () => void;
}

export function BackupSettings({ onRefresh }: BackupSettingsProps) {
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Single-Click JSON Backup
  const handleBackup = async () => {
    setIsExporting(true);
    try {
      const jsonStr = await exportDatabaseBackup();
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadFile(jsonStr, `financetracker_backup_${dateStr}.json`, 'application/json');
      toast(language === 'tr' ? '🧰 Tam veritabanı yedeği başarıyla indirildi.' : '🧰 Full database backup downloaded.', 'success');
    } catch (err: any) {
      toast(`Yedekleme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Single-Click JSON Restore
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async event => {
      const content = event.target?.result as string;
      const res = await importDataFromJson(content);
      if (res.success) {
        toast(`♻️ ${res.message}`, 'success');
        onRefresh();
      } else {
        toast(res.message, 'error');
      }
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      toast(language === 'tr' ? 'Dosya okunamadı.' : 'Could not read file.', 'error');
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  // Excel (.xls) Styled Spreadsheet Export
  const handleExportAllExcel = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast(t('transactions.noExportData'), 'warning');
        return;
      }
      exportTransactionsToExcel(all, 'all_transactions_table.xls');
      toast(t('transactions.excelDownloaded'), 'success');
    } catch (err: any) {
      toast('Excel export error', 'error');
    }
  };

  // CSV Export for all transactions
  const handleExportAllCSV = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast(t('transactions.noExportData'), 'warning');
        return;
      }
      exportTransactionsToCSV(all, 'all_transactions.csv');
      toast(t('transactions.csvDownloaded'), 'success');
    } catch (err: any) {
      toast('CSV export error', 'error');
    }
  };

  // Print Friendly Report
  const handlePrintReport = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast(t('transactions.noExportData'), 'warning');
        return;
      }

      const totalIncome = all.filter(item => item.type === 'income').reduce((s, item) => s + item.amount, 0);
      const totalExpense = all.filter(item => item.type === 'expense').reduce((s, item) => s + item.amount, 0);
      const balance = totalIncome - totalExpense;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast(language === 'tr' ? 'Açılır pencere engellendi.' : 'Pop-up blocked.', 'warning');
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FinanceTracker - Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #1e293b; }
            h1 { color: #4338ca; margin-bottom: 4px; }
            .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
            .summary-box { background: #f1f5f9; border-radius: 12px; padding: 20px; display: flex; gap: 32px; margin-bottom: 28px; }
            .summary-item div:first-child { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; }
            .summary-item div:last-child { font-size: 22px; font-weight: 800; margin-top: 4px; }
            .income { color: #16a34a; }
            .expense { color: #e11d48; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th { background: #4338ca; color: white; text-align: left; padding: 10px 12px; border: 1px solid #4338ca; }
            td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>FinanceTracker PRO</h1>
          <div class="subtitle">${language === 'tr' ? 'Finansal Döküm Raporu' : 'Financial Statement Report'} • ${new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</div>
          <div class="summary-box">
            <div class="summary-item">
              <div>${language === 'tr' ? 'Toplam Gelir' : 'Total Income'}</div>
              <div class="income">${formatCurrency(totalIncome)}</div>
            </div>
            <div class="summary-item">
              <div>${language === 'tr' ? 'Toplam Gider' : 'Total Expenses'}</div>
              <div class="expense">${formatCurrency(totalExpense)}</div>
            </div>
            <div class="summary-item">
              <div>${language === 'tr' ? 'Net Bakiye' : 'Net Balance'}</div>
              <div style="color: ${balance >= 0 ? '#16a34a' : '#e11d48'}">${formatCurrency(balance)}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>${language === 'tr' ? 'Tarih' : 'Date'}</th>
                <th>${language === 'tr' ? 'Tür' : 'Type'}</th>
                <th>${language === 'tr' ? 'Kategori' : 'Category'}</th>
                <th>${language === 'tr' ? 'Açıklama' : 'Description'}</th>
                <th style="text-align: right;">${language === 'tr' ? 'Tutar' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              ${all.map(item => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.type === 'income' ? (language === 'tr' ? 'Gelir' : 'Income') : (language === 'tr' ? 'Gider' : 'Expense')}</td>
                  <td>${item.category}</td>
                  <td>${item.description}</td>
                  <td style="text-align: right; font-weight: bold; color: ${item.type === 'income' ? '#16a34a' : '#e11d48'}">
                    ${item.type === 'income' ? '+' : '-'}${formatCurrency(item.amount)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (err: any) {
      toast('Error generating report', 'error');
    }
  };

  // Hard Reset
  const handleHardReset = async () => {
    try {
      await hardResetDatabase();
      toast(t('settings.resetSuccess'), 'success');
      onRefresh();
    } catch (err: any) {
      toast(`Reset error: ${err?.message || 'Bilinmiyor'}`, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Language Preference Card */}
      <div className="p-5 sm:p-6 rounded-2xl theme-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold theme-text">
              {language === 'tr' ? 'Uygulama Dili / Language' : 'Application Language'}
            </h3>
            <p className="text-xs theme-muted">
              {language === 'tr' 
                ? 'Tüm menüler, grafikler, tablolar ve raporlar için aktif dil.' 
                : 'Active language for all menus, charts, tables, and reports.'}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-xl theme-sub-card border theme-border self-start sm:self-auto">
          <button
            onClick={() => setLanguage('tr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              language === 'tr'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'theme-muted hover:opacity-100'
            }`}
          >
            <span>🇹🇷</span>
            <span>Türkçe</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              language === 'en'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'theme-muted hover:opacity-100'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold theme-text">{t('settings.downloadJsonBtn')}</h3>
            <p className="text-xs theme-muted mt-1.5 leading-relaxed">
              {t('settings.downloadJsonSub')}
            </p>
          </div>
          <button
            onClick={handleBackup}
            disabled={isExporting}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? t('modal.saving') : t('settings.downloadJsonBtn')}</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold theme-text">{t('settings.restoreCardTitle')}</h3>
            <p className="text-xs theme-muted mt-1.5 leading-relaxed">
              {t('settings.restoreCardSub')}
            </p>
          </div>
          <label className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer">
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>{isImporting ? t('modal.saving') : (language === 'tr' ? 'Yedek Dosyası Seç' : 'Choose Backup File')}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Additional Tools (Excel, CSV, Print, Reset) */}
      <div className="p-6 rounded-2xl theme-card shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold theme-text">
            {language === 'tr' ? 'Raporlama ve Tablo Dışa Aktarma' : 'Reporting & Table Exports'}
          </h3>
          <p className="text-xs theme-muted mt-0.5">
            {language === 'tr'
              ? 'Excel tablosu (.xls), virgülle ayrılmış veri (.csv) veya yazdırılabilir PDF raporları oluşturun.'
              : 'Generate styled Excel (.xls), CSV, or printable financial summary reports.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleExportAllExcel}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel (.xls)</span>
          </button>

          <button
            onClick={handleExportAllCSV}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span>{language === 'tr' ? 'Yazdır / PDF Rapor' : 'Print / PDF'}</span>
          </button>

          <button
            onClick={() => setResetDialogOpen(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>{t('settings.resetBtn')}</span>
          </button>
        </div>
      </div>

      {/* Hard Reset Confirm */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleHardReset}
        title={t('settings.resetConfirmTitle')}
        description={t('settings.resetConfirmDesc')}
        confirmText={t('transactions.confirmDelete')}
        isDanger={true}
      />
    </div>
  );
}
