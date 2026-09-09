'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, UserCheck } from 'lucide-react';

interface SupplierMetricsCardsProps {
  totalSuppliers: number;
}

export const SupplierMetricsCards: React.FC<SupplierMetricsCardsProps> = ({ totalSuppliers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalSuppliers}</h4>
          <p className="text-xs text-slate-500 font-medium">Active Vendor Partners</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <Building2 className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-emerald-600">{totalSuppliers > 0 ? 12 : 0}</h4>
          <p className="text-xs text-slate-500 font-medium">Active Purchase Orders</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-indigo-600">2-3 Days</h4>
          <p className="text-xs text-slate-500 font-medium">Average Supply Lead Time</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <UserCheck className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
