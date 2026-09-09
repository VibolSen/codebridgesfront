'use client';

import React from 'react';
import { X } from 'lucide-react';
import { StockStatusFilter } from './types';

interface ProductCatalogFilterChipsProps {
  search: string;
  onClearSearch: () => void;
  selectedCategory: string;
  onClearCategory: () => void;
  stockStatus: StockStatusFilter;
  onClearStockStatus: () => void;
  totalFiltered: number;
  totalProducts: number;
}

export function ProductCatalogFilterChips({
  search,
  onClearSearch,
  selectedCategory,
  onClearCategory,
  stockStatus,
  onClearStockStatus,
  totalFiltered,
  totalProducts,
}: ProductCatalogFilterChipsProps) {
  const hasFilters = search.trim() !== '' || selectedCategory !== 'all' || stockStatus !== 'all';

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Filters:</span>

      {search.trim() && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#5B4DFB] border border-purple-200 text-[11px] font-bold">
          <span>Search: &quot;{search}&quot;</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="hover:text-purple-900 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {selectedCategory !== 'all' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#5B4DFB] border border-purple-200 text-[11px] font-bold">
          <span>Category: {selectedCategory}</span>
          <button
            type="button"
            onClick={onClearCategory}
            className="hover:text-purple-900 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {stockStatus !== 'all' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#5B4DFB] border border-purple-200 text-[11px] font-bold">
          <span>
            Status:{' '}
            {stockStatus === 'in_stock'
              ? 'In Stock'
              : stockStatus === 'low_stock'
              ? 'Low Stock'
              : 'Out of Stock'}
          </span>
          <button
            type="button"
            onClick={onClearStockStatus}
            className="hover:text-purple-900 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <span className="text-[11px] font-bold text-slate-500 ml-auto">
        Showing <strong className="text-slate-900">{totalFiltered}</strong> of {totalProducts} items
      </span>
    </div>
  );
}
