'use client';

import React, { useState } from 'react';
import { Category, Transaction } from '@/types';
import { db, deleteCategoryWithTransactions, renameCategory } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Tag, AlertTriangle } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  transactions: Transaction[];
  onRefresh: () => void;
}

export function CategoryManager({ categories, transactions, onRefresh }: CategoryManagerProps) {
  const { toast } = useToast();

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  // Edit Category State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');

  // Delete Category State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteMode, setDeleteMode] = useState<'move' | 'delete'>('move');
  const [targetCategory, setTargetCategory] = useState('');

  // Calculate total expense per category in the current transaction set
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) {
      toast('Kategori adı boş olamaz.', 'warning');
      return;
    }

    const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast('Bu kategori zaten mevcut.', 'warning');
      return;
    }

    try {
      await db.categories.add({
        name,
        color: newCatColor,
        isDefault: false,
      });
      toast(`"${name}" kategorisi eklendi.`, 'success');
      setNewCatName('');
      onRefresh();
    } catch (err: any) {
      toast(`Ekleme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    }
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleApplyEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      toast('Kategori adı boş olamaz.', 'warning');
      return;
    }

    try {
      await renameCategory(editingCategory.name, trimmed, editColor);
      toast(`"${editingCategory.name}" güncellendi.`, 'success');
      setEditingCategory(null);
      onRefresh();
    } catch (err: any) {
      toast(`Güncelleme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    }
  };

  const handleOpenDelete = (cat: Category) => {
    const otherCats = categories.filter(c => c.name !== cat.name);
    setDeletingCategory(cat);
    setDeleteMode('move');
    setTargetCategory(otherCats[0]?.name || '');
  };

  const handleApplyDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryWithTransactions(
        deletingCategory.name,
        deleteMode,
        deleteMode === 'move' ? targetCategory : undefined
      );
      toast(`"${deletingCategory.name}" kategorisi silindi.`, 'success');
      setDeletingCategory(null);
      onRefresh();
    } catch (err: any) {
      toast(`Silme hatası: ${err?.message || 'Bilinmiyor'}`, 'error');
    }
  };

  const relatedCount = deletingCategory
    ? transactions.filter(t => t.category === deletingCategory.name).length
    : 0;

  const otherCategories = deletingCategory
    ? categories.filter(c => c.name !== deletingCategory.name)
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Add Category Card */}
      <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-400" />
          <span>Yeni Kategori Tanımla</span>
        </h3>

        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Örn: Abonelikler, Evcil Hayvan..."
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
          />

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newCatColor}
              onChange={e => setNewCatColor(e.target.value)}
              className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
              title="Kategori Rengi"
            />
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ekle</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-4">
          Tüm Kategoriler ({categories.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => {
            const total = categoryTotals[cat.name] || 0;
            return (
              <div
                key={cat.id || cat.name}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-4 h-4 rounded-md shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">{cat.name}</span>
                    <span className="text-xs text-rose-400/90 font-medium">
                      {total > 0 ? formatCurrency(total) : 'Bu ay işlem yok'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(cat)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Category Modal */}
      <Modal
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        title="🖋️ Kategori Düzenle"
      >
        <form onSubmit={handleApplyEdit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Kategori Adı</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Renk</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editColor}
                onChange={e => setEditColor(e.target.value)}
                className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
              />
              <span className="text-xs text-slate-400">{editColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation with Migration Options */}
      <Modal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        title="🗑️ Kategoriyi Sil"
      >
        <div className="flex flex-col gap-4">
          {relatedCount > 0 ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>"{deletingCategory?.name}"</strong> kategorisine ait <strong>{relatedCount}</strong> adet işlem bulundu.
                Bu işlemleri ne yapmak istersiniz?
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">
              <strong>"{deletingCategory?.name}"</strong> kategorisini silmek istediğinizden emin misiniz?
            </p>
          )}

          {relatedCount > 0 && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">İşlem Tercihi</label>
                <select
                  value={deleteMode}
                  onChange={e => setDeleteMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none"
                >
                  <option value="move">Başka Bir Kategoriye Taşı</option>
                  <option value="delete">Tüm Bağlı İşlemleri de Sil</option>
                </select>
              </div>

              {deleteMode === 'move' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Hedef Kategori</label>
                  <select
                    value={targetCategory}
                    onChange={e => setTargetCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none"
                  >
                    {otherCategories.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setDeletingCategory(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleApplyDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/20"
            >
              Sil ve Uygula
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
