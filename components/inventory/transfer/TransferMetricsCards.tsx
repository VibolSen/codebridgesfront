'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Truck, CheckCircle2 } from 'lucide-react';

interface TransferMetricsCardsProps {
  totalTransfers: number;
  inTransitCount: number;
  receivedCount: number;
}

export const TransferMetricsCards: React.FC<TransferMetricsCardsProps> = ({
  totalTransfers,
  inTransitCount,
  receivedCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalTransfers}</h4>
          <p className="text-xs text-slate-500 font-medium">Total Transfers</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <History className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-amber-600">{inTransitCount}</h4>
          <p className="text-xs text-slate-500 font-medium">In Transit (Dispatched)</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Truck className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-emerald-600">{receivedCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Completed & Received</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
