'use client';

import React from 'react';
import { Search, Barcode, Loader2 } from 'lucide-react';

export interface StocktakeItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  systemStock: number;
  countedStock: number;
  unitCost: number;
}

interface StocktakeVarianceTableProps {
  items: StocktakeItem[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  barcodeInput: string;
  onBarcodeChange: (code: string) => void;
  onUpdateCount: (id: string, count: number) => void;
}

export const StocktakeVarianceTable: React.FC<StocktakeVarianceTableProps> = ({
  items,
  loading,
  searchTerm,
  onSearchChange,
  barcodeInput,
  onBarcodeChange,
  onUpdateCount,
}) => {
  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU or item name..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Barcode className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => onBarcodeChange(e.target.value)}
            placeholder="Scan barcode..."
            className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            <span>Loading physical stock items from catalog...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium text-xs">
            No products found to audit.
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black">
              <tr>
                <th className="px-4 py-3 text-left">Product Item</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">System Ledger Stock</th>
                <th className="px-4 py-3 text-center">Physical Count</th>
                <th className="px-4 py-3 text-right">Variance Delta</th>
                <th className="px-4 py-3 text-right">Value Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const diff = item.countedStock - item.systemStock;
                const valueImpact = diff * item.unitCost;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-extrabold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                      {item.systemStock} units
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateCount(item.id, item.countedStock - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.countedStock}
                          onChange={(e) =>
                            onUpdateCount(item.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono font-black text-xs text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateCount(item.id, item.countedStock + 1)}
                          className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 font-black text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black">
                      <span
                        className={
                          diff === 0
                            ? 'text-emerald-600'
                            : diff < 0
                            ? 'text-rose-600'
                            : 'text-blue-600'
                        }
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-slate-900">
                      {valueImpact === 0
                        ? '$0.00'
                        : valueImpact < 0
                        ? `-$${Math.abs(valueImpact).toFixed(2)}`
                        : `+$${valueImpact.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
