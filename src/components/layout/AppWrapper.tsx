'use client';

import React, { useEffect, useState } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { PrivacyProvider } from '@/context/PrivacyContext';
import { ModalProvider, useGlobalModal } from '@/context/ModalContext';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { db, ensureInitialized } from '@/lib/db';
import { Category } from '@/types';

function InnerApp({ children }: { children: React.ReactNode }) {
  const { isAddModalOpen, closeAddModal, transactionToEdit, openAddModal, triggerRefresh } = useGlobalModal();
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    await ensureInitialized();
    const all = await db.categories.toArray();
    setCategories(all);
  };

  useEffect(() => {
    loadCategories();

    // Global keyboard shortcuts (Ctrl+N for new transaction)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openAddModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text transition-colors duration-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar onOpenAddModal={() => openAddModal()} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-12">
        {children}
      </main>

      <BottomNavigation onOpenAddModal={() => openAddModal()} />

      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        categories={categories}
        transactionToEdit={transactionToEdit}
        onSuccess={() => {
          triggerRefresh();
          loadCategories();
        }}
      />
    </div>
  );
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PrivacyProvider>
        <ToastProvider>
          <ModalProvider>
            <InnerApp>{children}</InnerApp>
          </ModalProvider>
        </ToastProvider>
      </PrivacyProvider>
    </ThemeProvider>
  );
}
