'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Briefcase } from 'lucide-react';

interface DepartmentMetricsCardsProps {
  totalDepts: number;
  totalStaffAcrossDepts: number;
  avgStaff: string;
}

export const DepartmentMetricsCards: React.FC<DepartmentMetricsCardsProps> = ({
  totalDepts,
  totalStaffAcrossDepts,
  avgStaff,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalDepts}</h4>
          <p className="text-xs text-slate-500 font-medium">Departments Configured</p>
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
          <h4 className="text-xl font-extrabold text-emerald-600">{totalStaffAcrossDepts}</h4>
          <p className="text-xs text-slate-500 font-medium">Assigned Employees</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Users className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-brand">{avgStaff}</h4>
          <p className="text-xs text-slate-500 font-medium">Average Staff / Dept</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand flex items-center justify-center font-bold">
          <Briefcase className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
