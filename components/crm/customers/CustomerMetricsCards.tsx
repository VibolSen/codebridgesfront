'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, DollarSign } from 'lucide-react';

interface CustomerMetricsCardsProps {
  totalCustomers: number;
  totalPointsBalance: number;
  pointsLiabilityUSD: number;
}

export const CustomerMetricsCards: React.FC<CustomerMetricsCardsProps> = ({
  totalCustomers,
  totalPointsBalance,
  pointsLiabilityUSD,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-slate-900">{totalCustomers}</h4>
          <p className="text-xs text-slate-500 font-medium">Registered Clients</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
          <Users className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-amber-600">
            {totalPointsBalance.toLocaleString()}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Active Loyalty Points</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Award className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
      >
        <div>
          <h4 className="text-xl font-extrabold text-indigo-600">
            ${pointsLiabilityUSD.toFixed(2)}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Points Reward Liability</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <DollarSign className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
};
