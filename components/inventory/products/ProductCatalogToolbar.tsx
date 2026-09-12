'use client';

import React from 'react';
import { Search, X, Tag, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CategoryOption, ProductStats, StockStatusFilter } from './types';

interface ProductCatalogToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;

  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalProductsCount: number;

  stockStatus: StockStatusFilter;
  onSelectStockStatus: (status: StockStatusFilter) => void;
  stats: ProductStats;

  currentSortPreset: string;
  onSortPresetChange: (preset: string) => void;

  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function ProductCatalogToolbar({
  search,
  onSearchChange,
  onClearSearch,
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
  stockStatus,
  onSelectStockStatus,
  stats,
  currentSortPreset,
  onSortPresetChange,
  hasActiveFilters,
  onResetFilters,
}: ProductCatalogToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
      {/* Left: Search Input & Category / Status Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, SKU, barcode, or category..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer shadow-2xs appearance-none"
            >
              <option value="all">All Categories ({totalProductsCount})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock Status Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <select
              value={stockStatus}
              onChange={(e) => onSelectStockStatus(e.target.value as StockStatusFilter)}
              className="pl-8 pr-7 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer shadow-2xs appearance-none"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock ({stats.inStock})</option>
              <option value="low_stock">Low Stock Warning ({stats.lowStock})</option>
              <option value="out_of_stock">Out of Stock ({stats.outOfStock})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right: Sort By Dropdown & Reset Button */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={currentSortPreset}
            onChange={(e) => onSortPresetChange(e.target.value)}
            className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer shadow-2xs"
          >
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
            <option value="sku_asc">SKU: A → Z</option>
            <option value="stock_asc">Stock: Lowest First (Needs Reorder)</option>
            <option value="stock_desc">Stock: Highest First</option>
            <option value="selling_price_desc">Selling Price: High to Low</option>
            <option value="selling_price_asc">Selling Price: Low to High</option>
            <option value="cost_price_desc">Cost Price: High to Low</option>
            <option value="cost_price_asc">Cost Price: Low to High</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer border border-rose-200/80 shadow-2xs"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
