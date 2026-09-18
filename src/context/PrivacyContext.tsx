'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrivacyContextType {
  isPrivate: boolean;
  togglePrivacy: () => void;
  formatPrivate: (text: string) => string;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('privacy_mode');
    if (saved === 'true') {
      setIsPrivate(true);
    }
  }, []);

  const togglePrivacy = () => {
    setIsPrivate(prev => {
      const next = !prev;
      localStorage.setItem('privacy_mode', String(next));
      return next;
    });
  };

  const formatPrivate = (text: string) => {
    if (!isPrivate) return text;
    // Keep prefix if starts with + or - or ₺, but mask numbers
    if (text.startsWith('-₺') || text.startsWith('+₺')) {
      return `${text.slice(0, 2)}••••••`;
    }
    if (text.startsWith('-') || text.startsWith('+')) {
      return `${text[0]}₺••••••`;
    }
    if (text.startsWith('₺')) {
      return '₺••••••';
    }
    return '••••••';
  };

  return (
    <PrivacyContext.Provider value={{ isPrivate, togglePrivacy, formatPrivate }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
