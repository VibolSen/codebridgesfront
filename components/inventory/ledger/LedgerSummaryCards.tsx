'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface LedgerSummaryCardsProps {
  totalLogs: number;
  receiveCount: number;
  salesCount: number;
  adjustmentCount: number;
}

export const LedgerSummaryCards: React.FC<LedgerSummaryCardsProps> = ({
  totalLogs,
  receiveCount,
  salesCount,
  adjustmentCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalLogs}</h4>
          <p className="text-xs text-slate-500 font-medium">Ledger Audit Entries</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand flex items-center justify-center font-bold">
          <FileText className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{receiveCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Stock Shipment Receives</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{salesCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Checkout Deductions</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
          <ArrowDownRight className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{adjustmentCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Manual Adjustments</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
          <RefreshCw className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
