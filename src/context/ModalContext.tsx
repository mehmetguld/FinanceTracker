'use client';

import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '@/types';

interface ModalContextType {
  isAddModalOpen: boolean;
  openAddModal: (transactionToEdit?: Transaction) => void;
  closeAddModal: () => void;
  transactionToEdit: Transaction | null;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openAddModal = (item?: Transaction) => {
    setTransactionToEdit(item || null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setTransactionToEdit(null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ModalContext.Provider
      value={{
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        transactionToEdit,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useGlobalModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a ModalProvider');
  }
  return context;
}
