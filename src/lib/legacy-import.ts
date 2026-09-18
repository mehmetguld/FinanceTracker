import { db } from '@/lib/db';
import { Transaction, Category } from '@/types';

export interface ImportResult {
  success: boolean;
  importedTransactions: number;
  importedCategories: number;
  message: string;
}

export async function importDataFromJson(jsonString: string): Promise<ImportResult> {
  try {
    const data = JSON.parse(jsonString);

    if (!data || typeof data !== 'object') {
      return { success: false, importedTransactions: 0, importedCategories: 0, message: 'Geçersiz JSON dosyası.' };
    }

    let rawCategories: any[] = [];
    let rawTransactions: any[] = [];
    let categoryColors: Record<string, string> = {};

    // Check if it's the legacy format (from tekinex.html / index.html)
    if (Array.isArray(data.categories) && Array.isArray(data.transactions)) {
      rawCategories = data.categories;
      rawTransactions = data.transactions;
      if (data.categoryColors && typeof data.categoryColors === 'object') {
        categoryColors = data.categoryColors;
      }
    } else if (data.version === 2 && Array.isArray(data.transactions)) {
      // New v2 format
      rawTransactions = data.transactions;
      rawCategories = Array.isArray(data.categories) ? data.categories : [];
    } else {
      return {
        success: false,
        importedTransactions: 0,
        importedCategories: 0,
        message: 'JSON formatı FinanceTracker yedek yapısıyla uyuşmuyor.',
      };
    }

    // Prepare categories
    const categoriesToInsert: Category[] = [];
    if (rawCategories.length > 0) {
      for (const cat of rawCategories) {
        if (typeof cat === 'string') {
          // Legacy format: array of strings
          categoriesToInsert.push({
            name: cat,
            color: categoryColors[cat] || '#3b82f6',
            isDefault: false,
          });
        } else if (cat && typeof cat === 'object' && cat.name) {
          categoriesToInsert.push({
            name: String(cat.name),
            color: cat.color || '#3b82f6',
            icon: cat.icon,
            isDefault: Boolean(cat.isDefault),
          });
        }
      }
    }

    // Prepare transactions
    const transactionsToInsert: Transaction[] = [];
    for (const item of rawTransactions) {
      if (!item || typeof item !== 'object') continue;
      
      const amount = Number(item.amount);
      if (isNaN(amount) || amount <= 0) continue;

      const date = item.date ? String(item.date).slice(0, 10) : new Date().toISOString().slice(0, 10);
      const yearMonth = date.slice(0, 7);
      const type = item.type === 'income' ? 'income' : 'expense';
      const category = item.category ? String(item.category) : 'Diğer';
      const description = item.description ? String(item.description) : (type === 'income' ? 'Gelir' : 'Gider');
      const createdAt = typeof item.createdAt === 'number' ? item.createdAt : (typeof item.id === 'number' ? item.id : Date.now());

      transactionsToInsert.push({
        type,
        amount,
        category,
        date,
        yearMonth,
        description,
        createdAt,
      });
    }

    // Atomic insert into Dexie
    await db.transaction('rw', db.categories, db.transactions, async () => {
      // Insert or merge categories
      for (const cat of categoriesToInsert) {
        const existing = await db.categories.where('name').equals(cat.name).first();
        if (!existing) {
          await db.categories.add(cat);
        }
      }

      // Add transactions
      if (transactionsToInsert.length > 0) {
        await db.transactions.bulkAdd(transactionsToInsert);
      }
    });

    return {
      success: true,
      importedTransactions: transactionsToInsert.length,
      importedCategories: categoriesToInsert.length,
      message: `${transactionsToInsert.length} işlem ve ${categoriesToInsert.length} kategori başarıyla yüklendi.`,
    };
  } catch (err: any) {
    return {
      success: false,
      importedTransactions: 0,
      importedCategories: 0,
      message: `Yedek yüklenirken hata oluştu: ${err?.message || 'Bilinmeyen hata'}`,
    };
  }
}
