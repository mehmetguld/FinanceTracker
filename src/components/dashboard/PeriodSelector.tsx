'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { PeriodState, PeriodFilter } from '@/types';
import { formatMonthName, getPreviousMonth, getNextMonth, getCurrentWeekRange, getCurrentYearMonth, formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';

interface PeriodSelectorProps {
  periodState: PeriodState;
  onPeriodChange: (next: PeriodState) => void;
}

export function PeriodSelector({ periodState, onPeriodChange }: PeriodSelectorProps) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
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
      toast(t('period.dateRangeWarning'), 'warning');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast(t('period.dateOrderWarning'), 'error');
      return;
    }

    onPeriodChange({
      type: 'custom',
      yearMonth: startDate.slice(0, 7),
      customRange: { start: startDate, end: endDate },
    });
    setCustomModalOpen(false);
    toast(`${formatDate(startDate)} - ${formatDate(endDate)}`);
  };

  const applyGoToDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) {
      toast(t('period.dayWarning'), 'warning');
      return;
    }

    onPeriodChange({
      type: 'day',
      yearMonth: selectedDay.slice(0, 7),
      selectedDay,
    });
    setDayModalOpen(false);
    toast(`${formatDate(selectedDay)}`);
  };

  const filterTabs: { id: PeriodFilter; label: string }[] = [
    { id: 'today', label: t('period.today') },
    { id: 'month', label: t('period.thisMonth') },
    { id: 'week', label: t('period.thisWeek') },
    { id: 'year', label: t('period.thisYear') },
    { id: 'all', label: t('period.allTime') },
    { id: 'custom', label: t('period.customRange') },
    { id: 'day', label: t('period.goToDay') },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 theme-card p-2.5 sm:p-3 rounded-2xl shadow-sm">
      {/* Month Navigator */}
      <div className="flex items-center justify-between sm:justify-start gap-2">
        {periodState.type === 'month' ? (
          <>
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl theme-sub-card hover:opacity-80 theme-text transition-colors cursor-pointer active:scale-95"
              title={t('period.prevMonth')}
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
              className="p-2 rounded-xl theme-sub-card hover:opacity-80 theme-text transition-colors cursor-pointer active:scale-95"
              title={t('period.nextMonth')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        ) : periodState.type === 'today' ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            <span>{t('period.todayLabel')} ({formatDate(periodState.selectedDay || new Date().toISOString().slice(0, 10))})</span>
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
            <span>
              {periodState.type === 'week' 
                ? t('period.weekRecords') 
                : periodState.type === 'year' 
                ? `${periodState.yearMonth.slice(0, 4)} ${t('period.yearRecords')}` 
                : t('period.allRecords')}
            </span>
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
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
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
      <Modal isOpen={customModalOpen} onClose={() => setCustomModalOpen(false)} title={t('period.customModalTitle')}>
        <form onSubmit={applyCustomRange} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase theme-muted mb-1.5">{t('period.startDate')}</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl theme-input border theme-border theme-text focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase theme-muted mb-1.5">{t('period.endDate')}</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl theme-input border theme-border theme-text focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setCustomModalOpen(false)}
              className="px-4 py-2.5 rounded-xl theme-sub-card border theme-border theme-text text-sm font-medium hover:opacity-80 cursor-pointer active:scale-95"
            >
              {t('period.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
            >
              {t('period.apply')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Go To Day Modal */}
      <Modal isOpen={dayModalOpen} onClose={() => setDayModalOpen(false)} title={t('period.dayModalTitle')}>
        <form onSubmit={applyGoToDay} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase theme-muted mb-1.5">{t('period.selectDate')}</label>
            <input
              type="date"
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl theme-input border theme-border theme-text focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setDayModalOpen(false)}
              className="px-4 py-2.5 rounded-xl theme-sub-card border theme-border theme-text text-sm font-medium hover:opacity-80 cursor-pointer active:scale-95"
            >
              {t('period.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
            >
              {t('period.goToDay')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
