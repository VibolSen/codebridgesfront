'use client';

import React, { useState } from 'react';
import { Warehouse, RefreshCw } from 'lucide-react';
import { WarehouseLevelsMatrix, LowStockAlertsTable } from '@/components/inventory';

export function StockWarehousesView() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900 pb-16">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B4DFB] flex items-center justify-center">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Stock &amp; Multi-Warehouse Hubs</h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time multi-location stock allocations, cold storage balances, and replenishment reorder alerts
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors self-start md:self-auto cursor-pointer"
          title="Refresh Warehouse Balances"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Warehouse Stock Matrix */}
      <div key={`matrix-${refreshKey}`}>
        <WarehouseLevelsMatrix />
      </div>

      {/* 3. Low Stock Alerts & Replenishment Queue */}
      <div key={`alerts-${refreshKey}`}>
        <LowStockAlertsTable />
      </div>
    </div>
  );
}
