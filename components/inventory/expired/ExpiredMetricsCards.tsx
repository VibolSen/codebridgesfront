'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, XCircle } from 'lucide-react';

interface ExpiredMetricsCardsProps {
  expiredCount: number;
  expiringSoonCount: number;
  totalWastageValuation: number;
}

export const ExpiredMetricsCards: React.FC<ExpiredMetricsCardsProps> = ({
  expiredCount,
  expiringSoonCount,
  totalWastageValuation,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-rose-600">{expiredCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Expired Inventory Units</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <AlertOctagon className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-amber-600">{expiringSoonCount}</h4>
          <p className="text-xs text-slate-500 font-medium">Expiring Soon (&lt; 30 Days)</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">
            ${totalWastageValuation.toFixed(2)}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Potential Valuation Loss</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <XCircle className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
