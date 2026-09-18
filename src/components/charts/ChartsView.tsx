'use client';

import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { CategoryExpenseBreakdown, FinancialSummary, Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChartsViewProps {
  breakdown?: CategoryExpenseBreakdown[];
  expenseBreakdown?: CategoryExpenseBreakdown[];
  incomeBreakdown?: CategoryExpenseBreakdown[];
  summary: FinancialSummary;
  transactions: Transaction[];
}

export function ChartsView({ 
  breakdown = [], 
  expenseBreakdown, 
  incomeBreakdown = [], 
  summary, 
  transactions 
}: ChartsViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [donutType, setDonutType] = useState<'expense' | 'income'>('expense');
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 theme-card rounded-2xl animate-pulse" />
        <div className="h-80 theme-card rounded-2xl animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';

  // Active breakdown for Donut
  const activeBreakdown = donutType === 'expense' 
    ? (expenseBreakdown || breakdown) 
    : incomeBreakdown;

  // Data for Bar comparison
  const comparisonData = [
    { name: 'Gelir', tutar: summary.totalIncome, fill: '#10b981' },
    { name: 'Gider', tutar: summary.totalExpense, fill: '#f43f5e' },
  ];

  // Daily trend calculation for both Income & Expense
  const dailyMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach(t => {
    const day = t.date.slice(8, 10);
    if (!dailyMap[day]) {
      dailyMap[day] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') dailyMap[day].income += t.amount;
    else dailyMap[day].expense += t.amount;
  });

  const dailyTrendData = Object.keys(dailyMap)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map(day => ({
      gun: `${day}. Gün`,
      Harcama: dailyMap[day].expense,
      Gelir: dailyMap[day].income,
    }));

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 theme-card rounded-xl shadow-xl border">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold theme-text text-sm">{data.category}</span>
          </div>
          <p className={`text-xs font-bold ${donutType === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(data.amount)}
          </p>
          <p className="text-[11px] theme-muted">%{data.percentage.toFixed(1)} pay</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 theme-card rounded-xl shadow-xl border">
          <span className="font-bold theme-text text-sm">{data.name}</span>
          <p className={`text-xs font-bold mt-0.5 ${data.name === 'Gelir' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(data.tutar)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kategori Dağılımı (Donut - Gelir & Gider Geçişli) */}
      <div className="flex flex-col theme-card p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b theme-border">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${donutType === 'expense' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold theme-text">
                {donutType === 'expense' ? 'Kategori Gider Dağılımı' : 'Kategori Gelir Dağılımı'}
              </h4>
              <p className="text-xs theme-muted">
                {donutType === 'expense' ? 'Harcamaların kategorilere göre yüzdesi' : 'Gelir kaynaklarının kategori dağılımı'}
              </p>
            </div>
          </div>

          {/* Gelir / Gider Toggle */}
          <div className="flex items-center p-1 rounded-xl theme-sub-card border theme-border self-start sm:self-auto">
            <button
              onClick={() => setDonutType('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                donutType === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Giderler
            </button>
            <button
              onClick={() => setDonutType('income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                donutType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'theme-muted hover:opacity-100'
              }`}
            >
              Gelirler
            </button>
          </div>
        </div>

        {activeBreakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center theme-muted text-sm">
            {donutType === 'expense' 
              ? 'Bu dönemde gösterilecek gider kaydı bulunmuyor.' 
              : 'Bu dönemde gösterilecek gelir kaydı bulunmuyor.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mt-4">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {activeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0f172a' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend List */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-2">
              {activeBreakdown.map(item => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="theme-text font-medium truncate">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold ${donutType === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-[10px] theme-muted w-9 text-right font-semibold">
                      %{item.percentage.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gelir vs Gider Karşılaştırması (Bar) */}
      <div className="flex flex-col theme-card p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b theme-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold theme-text">Gelir - Gider Dengesi</h4>
              <p className="text-xs theme-muted">Dönemsel toplam nakit akışı karşılaştırması</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
              <YAxis stroke={axisColor} fontSize={11} tickFormatter={v => `₺${v}`} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="tutar" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Günlük Gelir ve Harcama Akışı (Dual Area Chart) */}
      {dailyTrendData.length > 1 && (
        <div className="lg:col-span-2 flex flex-col theme-card p-5 sm:p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b theme-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold theme-text">Günlük Nakit Akışı (Gelir & Gider)</h4>
                <p className="text-xs theme-muted">Seçili dönem boyunca gün bazında gelir ve gider hareketleri</p>
              </div>
            </div>

            {/* Legends */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="theme-text">Gelir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="theme-text">Gider</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                <XAxis dataKey="gun" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickFormatter={v => `₺${v}`} tickLine={false} />
                <Tooltip
                  formatter={(val: any, name: any) => [formatCurrency(Number(val)), name === 'Gelir' ? 'Gelir' : 'Gider']}
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Gelir" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#incomeGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Harcama" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#expenseGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
