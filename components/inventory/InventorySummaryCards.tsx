'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface InventorySummaryCardsProps {
  totalSKUs: number;
  totalUnits: number;
  lowStockCount: number;
  totalValuation: number;
}

export const InventorySummaryCards: React.FC<InventorySummaryCardsProps> = ({
  totalSKUs,
  totalUnits,
  lowStockCount,
  totalValuation,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalSKUs}</h4>
          <p className="text-xs text-slate-500 font-medium">Total Active SKUs</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
          <Package className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalUnits.toLocaleString()}</h4>
          <p className="text-xs text-slate-500 font-medium">Total Units On Hand</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
          <Boxes className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{lowStockCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Low Stock Alerts</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Retail Valuation</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
