'use client';

import React from 'react';
import { BackupSettings } from '@/components/settings/BackupSettings';
import { useGlobalModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const { triggerRefresh } = useGlobalModal();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-500" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm theme-muted mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <BackupSettings onRefresh={triggerRefresh} />
    </div>
  );
}
