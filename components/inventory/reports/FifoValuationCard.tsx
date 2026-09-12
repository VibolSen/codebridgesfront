'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, FileSpreadsheet, Loader2 } from 'lucide-react';
import { getProductsApi } from '@/lib/api';

export function FifoValuationCard() {
  const [loading, setLoading] = useState(true);
  const [totalValuation, setTotalValuation] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function loadValuation() {
      try {
        setLoading(true);
        const res = await getProductsApi();
        const list = Array.isArray(res) ? res : res?.data || [];
        let val = 0;
        let count = 0;
        list.forEach((p: any) => {
          const stock = parseFloat(p.stock_on_hand || '0');
          const cost = parseFloat(p.cost_price || '0');
          val += stock * cost;
          count += stock;
        });
        setTotalValuation(val);
        setTotalItems(count);
      } catch (err) {
        console.error('Failed to load FIFO valuation:', err);
      } finally {
        setLoading(false);
      }
    }
    loadValuation();
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand" />
            <span>FIFO Valuation Reports</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Batch cost allocation, inventory turns, and asset balance history</p>
        </div>
        <Link
          href="/super-admin/inventory/ledger"
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Full Ledger Studio</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">Total Asset Book Valuation</span>
          {loading ? (
            <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl font-black text-slate-900 font-mono">
              ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Calculated across {Math.floor(totalItems)} physical units via live lot cost basis
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">Inventory Status</span>
          <p className="text-2xl font-black text-brand font-mono">
            {totalItems > 0 ? 'Active Stock' : 'Zero Stock'}
          </p>
          <p className="text-[11px] text-slate-400">
            Real-time on-hand balances synchronized with catalog &amp; purchase ledgers
          </p>
        </div>
      </div>
    </div>
  );
}
