'use client';

import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Printer, 
  FileSpreadsheet, 
  FileText
} from 'lucide-react';
import { exportDatabaseBackup, hardResetDatabase, db } from '@/lib/db';
import { importDataFromJson } from '@/lib/legacy-import';
import { downloadFile, exportTransactionsToCSV, exportTransactionsToExcel, formatCurrency } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

interface BackupSettingsProps {
  onRefresh: () => void;
}

export function BackupSettings({ onRefresh }: BackupSettingsProps) {
  const { toast } = useToast();
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
      downloadFile(jsonStr, `financetracker_yedek_${dateStr}.json`, 'application/json');
      toast('🧰 Tam veritabanı yedeği başarıyla indirildi.', 'success');
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
      toast('Dosya okunamadı.', 'error');
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  // Excel (.xls) Styled Spreadsheet Export for all transactions
  const handleExportAllExcel = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast('Dışa aktarılacak işlem bulunamadı.', 'warning');
        return;
      }
      exportTransactionsToExcel(all, 'tum_islemler_tablosu.xls');
      toast('📗 Tam Excel tablosu (.xls) indirildi.', 'success');
    } catch (err: any) {
      toast('Excel dosyası oluşturulamadı.', 'error');
    }
  };

  // CSV Export for all transactions
  const handleExportAllCSV = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast('Dışa aktarılacak işlem bulunamadı.', 'warning');
        return;
      }
      exportTransactionsToCSV(all, 'tum_islemler.csv');
      toast('📊 Tüm işlemler CSV olarak indirildi (Excel uyumlu).', 'success');
    } catch (err: any) {
      toast('CSV oluşturulamadı.', 'error');
    }
  };

  // Print Friendly Report
  const handlePrintReport = async () => {
    try {
      const all = await db.transactions.toArray();
      if (all.length === 0) {
        toast('Yazdırılacak işlem bulunamadı.', 'warning');
        return;
      }

      const totalIncome = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalExpense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const balance = totalIncome - totalExpense;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast('Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin.', 'warning');
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FinanceTracker - Finansal Rapor</title>
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
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>💎 FinanceTracker Pro - Finansal Özet Raporu</h1>
          <div class="subtitle">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}</div>
          
          <div class="summary-box">
            <div class="summary-item">
              <div>Toplam Gelir</div>
              <div class="income">₺${totalIncome.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <div>Toplam Gider</div>
              <div class="expense">₺${totalExpense.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <div>Net Bakiye</div>
              <div>₺${balance.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <div>Toplam Kayıt</div>
              <div>${all.length} İşlem</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem Türü</th>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th>Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${all
                .sort((a, b) => (a.date > b.date ? -1 : 1))
                .map(
                  t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.type === 'income' ? 'Gelir' : 'Gider'}</td>
                  <td>${t.category}</td>
                  <td>${t.description || '-'}</td>
                  <td class="${t.type}" style="font-weight: bold;">
                    ${t.type === 'income' ? '+' : '-'}₺${t.amount.toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join('')}
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
      toast('Rapor hazırlanırken hata oluştu.', 'error');
    }
  };

  // Hard Reset
  const handleHardReset = async () => {
    try {
      await hardResetDatabase();
      toast('🧹 Tüm veriler sıfırlandı ve varsayılan kategoriler yüklendi.', 'success');
      onRefresh();
    } catch (err: any) {
      toast(`Sıfırlama hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold theme-text">Yedek Al (.json)</h3>
            <p className="text-xs theme-muted mt-1.5 leading-relaxed">
              Tüm gelirler, giderler, özel kategoriler ve ayarlar tek bir `.json` dosyasına paketlenir ve anında cihazınıza indirilir.
            </p>
          </div>
          <button
            onClick={handleBackup}
            disabled={isExporting}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? 'Hazırlanıyor...' : 'Yedek Dosyasını İndir'}</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold theme-text">Yedek Yükle</h3>
            <p className="text-xs theme-muted mt-1.5 leading-relaxed">
              Daha önce aldığınız bir `.json` yedeğini yükleyin. Eski <code>tekinex.html</code> formatındaki yedekleri de otomatik algılayıp yeni mimariye aktarır.
            </p>
          </div>
          <label className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer">
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>{isImporting ? 'Yükleniyor...' : 'Yedek Dosyası Seç'}</span>
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
          <h3 className="text-base font-bold theme-text">Raporlama ve Tablo Dışa Aktarma</h3>
          <p className="text-xs theme-muted mt-0.5">
            Excel tablosu (.xls), virgülle ayrılmış veri (.csv) veya yazdırılabilir PDF raporları oluşturun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleExportAllExcel}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel Tablosu (.xls)</span>
          </button>

          <button
            onClick={handleExportAllCSV}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>CSV Dışa Aktar</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Yazdır / PDF Rapor</span>
          </button>

          <button
            onClick={() => setResetDialogOpen(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Tüm Verileri Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Hard Reset Confirm */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleHardReset}
        title="Tüm Verileri Sıfırla"
        description="IndexedDB içerisindeki tüm işlemler, kategoriler ve ayarlar kalıcı olarak silinecek. Bu işlem geri alınamaz. Sıfırlamadan önce bir yedek almanızı öneririz. Devam etmek istiyor musunuz?"
        confirmText="Evet, Hepsini Sil"
        isDanger={true}
      />
    </div>
  );
}
