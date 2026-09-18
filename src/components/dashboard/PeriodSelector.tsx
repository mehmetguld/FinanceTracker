'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { PeriodState, PeriodFilter } from '@/types';
import { formatMonthName, getPreviousMonth, getNextMonth, getCurrentWeekRange, getCurrentYearMonth, formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface PeriodSelectorProps {
  periodState: PeriodState;
  onPeriodChange: (next: PeriodState) => void;
}

export function PeriodSelector({ periodState, onPeriodChange }: PeriodSelectorProps) {
  const { toast } = useToast();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handlePrevMonth = () => {
    const prev = getPreviousMonth(periodState.yearMonth);
    onPeriodChange({
      type: 'month',
      yearMonth: prev,
    });
  };

  const handleNextMonth = () => {
    const next = getNextMonth(periodState.yearMonth);
    onPeriodChange({
      type: 'month',
      yearMonth: next,
    });
  };

  const setFilterType = (type: PeriodFilter) => {
    if (type === 'today') {
      const todayStr = new Date().toISOString().slice(0, 10);
      onPeriodChange({
        type: 'today',
        yearMonth: todayStr.slice(0, 7),
        selectedDay: todayStr,
      });
    } else if (type === 'month') {
      onPeriodChange({
        type: 'month',
        yearMonth: getCurrentYearMonth(),
      });
    } else if (type === 'week') {
      const week = getCurrentWeekRange();
      onPeriodChange({
        type: 'week',
        yearMonth: getCurrentYearMonth(),
        customRange: week,
      });
    } else if (type === 'year') {
      onPeriodChange({
        type: 'year',
        yearMonth: getCurrentYearMonth(),
      });
    } else if (type === 'all') {
      onPeriodChange({
        type: 'all',
        yearMonth: getCurrentYearMonth(),
      });
    } else if (type === 'custom') {
      setCustomModalOpen(true);
    } else if (type === 'day') {
      setSelectedDay(new Date().toISOString().slice(0, 10));
      setDayModalOpen(true);
    }
  };

  const applyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast('Lütfen başlangıç ve bitiş tarihlerini girin.', 'warning');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast('Başlangıç tarihi bitiş tarihinden sonra olamaz.', 'error');
      return;
    }

    onPeriodChange({
      type: 'custom',
      yearMonth: startDate.slice(0, 7),
      customRange: { start: startDate, end: endDate },
    });
    setCustomModalOpen(false);
    toast(`${formatDate(startDate)} - ${formatDate(endDate)} aralığı gösteriliyor.`);
  };

  const applyGoToDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) {
      toast('Lütfen bir gün seçin.', 'warning');
      return;
    }

    onPeriodChange({
      type: 'day',
      yearMonth: selectedDay.slice(0, 7),
      selectedDay,
    });
    setDayModalOpen(false);
    toast(`${formatDate(selectedDay)} günü gösteriliyor.`);
  };

  const filterTabs: { id: PeriodFilter; label: string }[] = [
    { id: 'today', label: '⚡ Bugün' },
    { id: 'month', label: 'Bu Ay' },
    { id: 'week', label: 'Bu Hafta' },
    { id: 'year', label: 'Bu Yıl' },
    { id: 'all', label: 'Tüm Zamanlar' },
    { id: 'custom', label: 'Özel Aralık' },
    { id: 'day', label: 'Güne Git' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 theme-card p-2.5 sm:p-3 rounded-2xl shadow-sm">
      {/* Month Navigator */}
      <div className="flex items-center justify-between sm:justify-start gap-2">
        {periodState.type === 'month' ? (
          <>
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl theme-sub-card hover:opacity-80 theme-text transition-colors cursor-pointer"
              title="Önceki Ay"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl theme-sub-card border theme-border">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-sm theme-text capitalize min-w-[110px] text-center">
                {formatMonthName(periodState.yearMonth)}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl theme-sub-card hover:opacity-80 theme-text transition-colors cursor-pointer"
              title="Sonraki Ay"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        ) : periodState.type === 'today' ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            <span>Bugün ({formatDate(periodState.selectedDay || new Date().toISOString().slice(0, 10))})</span>
          </div>
        ) : periodState.type === 'day' && periodState.selectedDay ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            <span>{formatDate(periodState.selectedDay)}</span>
          </div>
        ) : periodState.type === 'custom' && periodState.customRange ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(periodState.customRange.start)} - {formatDate(periodState.customRange.end)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 theme-muted text-sm font-medium">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span>{periodState.type === 'week' ? 'Bu Haftanın Kayıtları' : periodState.type === 'year' ? `${periodState.yearMonth.slice(0, 4)} Yılı` : 'Tüm Kayıtlar'}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
        {filterTabs.map(tab => {
          const isActive = periodState.type === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'theme-muted hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Modal */}
      <Modal isOpen={customModalOpen} onClose={() => setCustomModalOpen(false)} title="📅 Özel Tarih Aralığı">
        <form onSubmit={applyCustomRange} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setCustomModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Uygula
            </button>
          </div>
        </form>
      </Modal>

      {/* Go To Day Modal */}
      <Modal isOpen={dayModalOpen} onClose={() => setDayModalOpen(false)} title="🗓️ Belirli Güne Git">
        <form onSubmit={applyGoToDay} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Tarih Seçin</label>
            <input
              type="date"
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setDayModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Güne Git
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
