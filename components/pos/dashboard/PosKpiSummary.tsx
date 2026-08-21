'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Vault,
  ArrowUpRight,
} from 'lucide-react';
import { PosKpis } from '../types';

interface PosKpiSummaryProps {
  kpis: PosKpis;
}

export function PosKpiSummary({ kpis }: PosKpiSummaryProps) {
  const cards = [
    {
      title: "Today's POS Sales",
      value: `$${kpis.todaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${kpis.todayTransactions} completed sales`,
      icon: DollarSign,
      gradient: 'from-orange-500 to-amber-500',
      badge: '+18% vs Yesterday',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Transactions Today',
      value: kpis.todayTransactions.toString(),
      subtitle: 'Customer orders',
      icon: ShoppingBag,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Live Stream',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'Average Order Value',
      value: `$${kpis.averageTicket.toFixed(2)}`,
      subtitle: 'Per transaction basket',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'Avg Ticket',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Drawer Cash Float',
      value: `$${kpis.drawerFloat.toFixed(2)}`,
      subtitle: 'Opening balance in drawer',
      icon: Vault,
      gradient: 'from-purple-600 to-violet-600',
      badge: 'Cash Safe',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md shadow-orange-500/10`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
