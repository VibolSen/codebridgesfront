'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Plus, Loader2 } from 'lucide-react';
import { getProductsApi, getInventoryMovementsApi } from '@/lib/api';

export function StocktakeAdjustmentsCard() {
  const [skuCount, setSkuCount] = useState(0);
  const [recentAdjustments, setRecentAdjustments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStocktakeMetrics() {
      try {
        setLoading(true);
        const [prodRes, movRes] = await Promise.allSettled([
          getProductsApi(),
          getInventoryMovementsApi(undefined, 'adjustment'),
        ]);

        if (prodRes.status === 'fulfilled') {
          const list = Array.isArray(prodRes.value) ? prodRes.value : prodRes.value?.data || [];
          setSkuCount(list.length);
        }

        if (movRes.status === 'fulfilled') {
          const movements = Array.isArray(movRes.value) ? movRes.value : movRes.value?.data || [];
          setRecentAdjustments(movements.length);
        }
      } catch (err) {
        console.error('Failed to load stocktake metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStocktakeMetrics();
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#5B4DFB]" />
            <span>Stocktake &amp; Adjustments</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Cycle counts, damage write-offs, and discrepancy reconciliation</p>
        </div>
        <Link
          href="/super-admin/inventory/stocktake"
          className="px-4 py-2 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Stocktake Audit</span>
        </Link>
      </div>

      {/* Quick Dynamic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
          <span className="text-[11px] font-bold text-slate-500">Catalog SKUs Monitored</span>
          <p className="text-lg font-black text-slate-900 font-mono">
            {loading ? '...' : `${skuCount} SKUs`}
          </p>
          <p className="text-[10px] text-slate-400">Ready for cycle counting</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <span className="text-[11px] font-bold text-slate-500">Reconciliation Records</span>
          <p className="text-lg font-black text-emerald-700 font-mono">
            {loading ? '...' : `${recentAdjustments} Logged`}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">Ledger shrinkage tracking</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500">Audit Status</span>
          <p className="text-lg font-black text-slate-900">
            {skuCount > 0 ? 'Active & Ready' : 'Awaiting Items'}
          </p>
          <p className="text-[10px] text-slate-400">Live barcode scanning supported</p>
        </div>
      </div>
    </div>
  );
}
