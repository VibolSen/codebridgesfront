'use client';

import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface PosOrdersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterTender: string;
  onFilterTenderChange: (tender: string) => void;
  onOpenReturnModal: () => void;
}

export function PosOrdersFilterBar({
  searchQuery,
  onSearchChange,
  filterTender,
  onFilterTenderChange,
  onOpenReturnModal,
}: PosOrdersFilterBarProps) {
  const tenders = ['all', 'cash', 'khqr', 'card'];

  return (
    <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search receipts by invoice #, customer name, cashier..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
      </div>

      {/* Tender Filter Pills */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {tenders.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onFilterTenderChange(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
              filterTender === t
                ? 'bg-brand text-white shadow-xs shadow-brand/20 font-black'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {t === 'all' ? 'All Tenders' : t.toUpperCase()}
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenReturnModal}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-extrabold text-xs shadow-2xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 ml-1"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand" />
          <span>Return</span>
        </button>
      </div>
    </div>
  );
}
