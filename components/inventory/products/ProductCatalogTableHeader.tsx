'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortKey, SortOrder } from './types';

interface ProductCatalogTableHeaderProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}

export function ProductCatalogTableHeader({
  sortKey,
  sortOrder,
  onSort,
}: ProductCatalogTableHeaderProps) {
  const renderSortIcon = (key: SortKey) => {
    if (sortKey === key) {
      return sortOrder === 'asc' ? (
        <ArrowUp className="w-3.5 h-3.5 text-brand" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-brand" />
      );
    }
    return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />;
  };

  return (
    <thead className="bg-slate-50 border-b border-slate-200 select-none">
      <tr>
        {/* Product & SKU */}
        <th
          onClick={() => onSort('name')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Product &amp; SKU</span>
            {renderSortIcon('name')}
          </div>
        </th>

        {/* Category */}
        <th
          onClick={() => onSort('category')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Category</span>
            {renderSortIcon('category')}
          </div>
        </th>

        {/* Stock On Hand */}
        <th
          onClick={() => onSort('stock')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Stock On Hand</span>
            {renderSortIcon('stock')}
          </div>
        </th>

        {/* Cost Price */}
        <th
          onClick={() => onSort('cost_price')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Cost Price</span>
            {renderSortIcon('cost_price')}
          </div>
        </th>

        {/* Selling Price */}
        <th
          onClick={() => onSort('selling_price')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Selling Price</span>
            {renderSortIcon('selling_price')}
          </div>
        </th>

        {/* Min Buffer */}
        <th
          onClick={() => onSort('min_buffer')}
          className="px-4 py-3 text-left font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-1.5">
            <span>Min Buffer</span>
            {renderSortIcon('min_buffer')}
          </div>
        </th>

        {/* Action */}
        <th className="px-4 py-3 text-right font-extrabold text-slate-600 uppercase tracking-wider">
          Action
        </th>
      </tr>
    </thead>
  );
}
