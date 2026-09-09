'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, DollarSign } from 'lucide-react';

interface EmployeeMetricsCardsProps {
  totalEmployees: number;
  activeStaff: number;
  totalPayroll: number;
}

export const EmployeeMetricsCards: React.FC<EmployeeMetricsCardsProps> = ({
  totalEmployees,
  activeStaff,
  totalPayroll,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalEmployees}</h4>
          <p className="text-xs text-slate-500 font-medium">Total Staff Count</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <Briefcase className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-emerald-600">{activeStaff}</h4>
          <p className="text-xs text-slate-500 font-medium">Active Staff Members</p>
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
          <h4 className="text-xl font-extrabold text-indigo-600">
            ${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Monthly Payroll Budget</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <DollarSign className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
