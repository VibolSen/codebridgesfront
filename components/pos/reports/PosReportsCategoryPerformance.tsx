'use client';

import React from 'react';
import { Layers } from 'lucide-react';

interface CategoryPerformanceItem {
  name: string;
  orders: number;
  revenue: number;
  share: number;
}

interface PosReportsCategoryPerformanceProps {
  categories: CategoryPerformanceItem[];
}

export function PosReportsCategoryPerformance({ categories = [] }: PosReportsCategoryPerformanceProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand" />
          <span>Top Category Performance</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400">By Revenue Share</span>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium">
          No category sales recorded in this period yet.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-normal">{cat.orders} items</span>
                  <span className="font-mono font-black text-slate-900">${(Number(cat.revenue) || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.max(2, cat.share || 0))}%` }}
                  className="h-full bg-brand rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
