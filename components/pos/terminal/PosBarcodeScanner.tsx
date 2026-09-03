'use client';

import React, { useState } from 'react';
import { Barcode, Search, Zap, X } from 'lucide-react';

interface PosBarcodeScannerProps {
  onScan: (barcode: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PosBarcodeScanner({
  onScan,
  searchQuery,
  onSearchChange,
}: PosBarcodeScannerProps) {
  const [barcodeInput, setBarcodeInput] = useState('');

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    onScan(barcodeInput.trim());
    setBarcodeInput('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Real-time Product Search Filter */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products by name, category, SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Barcode Quick Scanner Form */}
      <form onSubmit={handleBarcodeSubmit} className="relative w-full sm:w-64">
        <Barcode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Scan barcode..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          className="w-full pl-9 pr-14 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs font-mono transition-all"
        />
        <button
          type="submit"
          disabled={!barcodeInput.trim()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-extrabold text-[10px] transition-colors disabled:opacity-30 cursor-pointer"
        >
          Scan
        </button>
      </form>
    </div>
  );
}
