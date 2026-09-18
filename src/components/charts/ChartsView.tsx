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
import { PieChart as PieIcon, BarChart3, TrendingDown } from 'lucide-react';

interface ChartsViewProps {
  breakdown: CategoryExpenseBreakdown[];
  summary: FinancialSummary;
  transactions: Transaction[];
}

export function ChartsView({ breakdown, summary, transactions }: ChartsViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
        <div className="h-80 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
      </div>
    );
  }

  // Data for Bar comparison
  const comparisonData = [
    { name: 'Gelir', tutar: summary.totalIncome, fill: '#10b981' },
    { name: 'Gider', tutar: summary.totalExpense, fill: '#f43f5e' },
  ];

  // Daily trend calculation
  const dailyMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach(t => {
    const day = t.date.slice(8, 10); // Day of month
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
        <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-white text-sm">{data.category}</span>
          </div>
          <p className="text-xs text-rose-400 font-bold">{formatCurrency(data.amount)}</p>
          <p className="text-[11px] text-slate-400">%{data.percentage.toFixed(1)} pay</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl backdrop-blur-md">
          <span className="font-bold text-white text-sm">{data.name}</span>
          <p className={`text-xs font-bold mt-0.5 ${data.name === 'Gelir' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(data.tutar)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kategori Harcama Dağılımı (Donut) */}
      <div className="flex flex-col bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Kategori Harcama Dağılımı</h4>
              <p className="text-xs text-slate-400">Giderlerin kategorilere göre yüzdesi</p>
            </div>
          </div>
        </div>

        {breakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 text-sm">
            Bu dönemde gösterilecek gider kaydı yok.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mt-4">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend List */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-2">
              {breakdown.map(item => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium truncate">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-200">{formatCurrency(item.amount)}</span>
                    <span className="text-[10px] text-slate-500 w-9 text-right font-semibold">
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
      <div className="flex flex-col bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Gelir - Gider Karşılaştırması</h4>
              <p className="text-xs text-slate-400">Toplam nakit dengesi</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `₺${v}`} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="tutar" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Günlük Harcama Trendi (Area) */}
      {dailyTrendData.length > 1 && (
        <div className="lg:col-span-2 flex flex-col bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Günlük Harcama Eğrisi</h4>
                <p className="text-xs text-slate-400">Seçili dönem boyunca harcamaların gün bazında akışı</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="gun" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `₺${v}`} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Harcama']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="Harcama" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
