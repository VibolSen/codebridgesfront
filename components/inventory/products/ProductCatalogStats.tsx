'use client';

import React from 'react';
import { Boxes, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProductStats, StockStatusFilter } from './types';

interface ProductCatalogStatsProps {
  stats: ProductStats;
  currentStatus: StockStatusFilter;
  onSelectStatus: (status: StockStatusFilter) => void;
}

export function ProductCatalogStats({
  stats,
  currentStatus,
  onSelectStatus,
}: ProductCatalogStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total SKUs */}
      <button
        type="button"
        onClick={() => onSelectStatus('all')}
        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
          currentStatus === 'all'
            ? 'bg-brand-subtle/80 border-brand/30 ring-2 ring-brand/20'
            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total SKUs</span>
          <Boxes className={`w-3.5 h-3.5 ${currentStatus === 'all' ? 'text-brand' : 'text-slate-400'}`} />
        </div>
        <div className="text-lg font-black text-slate-900 mt-0.5">{stats.total}</div>
      </button>

      {/* In Stock */}
      <button
        type="button"
        onClick={() => onSelectStatus('in_stock')}
        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
          currentStatus === 'in_stock'
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">In Stock</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-lg font-black text-emerald-900 mt-0.5">{stats.inStock}</div>
      </button>

      {/* Low Stock Warning */}
      <button
        type="button"
        onClick={() => onSelectStatus('low_stock')}
        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
          currentStatus === 'low_stock'
            ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Low Stock</span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="text-lg font-black text-amber-900 mt-0.5">{stats.lowStock}</div>
      </button>

      {/* Out of Stock */}
      <button
        type="button"
        onClick={() => onSelectStatus('out_of_stock')}
        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
          currentStatus === 'out_of_stock'
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20'
            : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Out of Stock</span>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="text-lg font-black text-rose-900 mt-0.5">{stats.outOfStock}</div>
      </button>
    </div>
  );
}
