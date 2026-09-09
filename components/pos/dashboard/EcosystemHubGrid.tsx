'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Boxes,
  DollarSign,
  Users,
  Briefcase,
  ChefHat,
  Tv,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface EcosystemHubGridProps {
  activeShift: any;
  kpis: {
    todaySales: number;
    todayTransactions: number;
  };
  ecosystemStats: {
    lowStockCount: number;
    customersCount: number;
  };
  userName?: string;
}

export function EcosystemHubGrid({
  activeShift,
  kpis,
  ecosystemStats,
  userName,
}: EcosystemHubGridProps) {
  const modules = [
    {
      id: 'terminal',
      title: 'POS Terminal & Register',
      subtitle: activeShift ? 'Register REG-01 Active' : 'Till Float Locked',
      href: '/pos/terminal',
      icon: Store,
      bgPill: 'bg-[#F5F3FF] text-[#7C3AED]',
      status: activeShift ? 'Active' : 'Standby',
      statusColor: activeShift
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-500 border-slate-200',
      actionLabel: 'Launch Register',
    },
    {
      id: 'inventory',
      title: 'Multi-Warehouse Stock',
      subtitle:
        ecosystemStats.lowStockCount > 0
          ? `${ecosystemStats.lowStockCount} items need reorder`
          : 'Stock balances healthy',
      href: '/inventory',
      icon: Boxes,
      bgPill: 'bg-[#FFFBEB] text-[#D97706]',
      status: ecosystemStats.lowStockCount > 0 ? 'Reorder Alert' : 'In Stock',
      statusColor:
        ecosystemStats.lowStockCount > 0
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionLabel: 'Manage Stock',
    },
    {
      id: 'accounting',
      title: 'Accounting & Ledgers',
      subtitle: `Today: $${kpis.todaySales.toFixed(2)} recorded`,
      href: '/financial',
      icon: DollarSign,
      bgPill: 'bg-[#ECFDF5] text-[#059669]',
      status: 'Synchronized',
      statusColor: 'bg-teal-50 text-teal-700 border-teal-200',
      actionLabel: 'View Ledgers',
    },
    {
      id: 'hrm',
      title: 'HR & Workforce',
      subtitle: userName ? `${userName} on duty` : 'Staff PINs secured',
      href: '/hrm',
      icon: Users,
      bgPill: 'bg-[#FFF1F2] text-[#E11D48]',
      status: 'Active Team',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      actionLabel: 'Staff & PINs',
    },
    {
      id: 'crm',
      title: 'CRM & Customer Loyalty',
      subtitle: `${ecosystemStats.customersCount} active accounts`,
      href: '/crm',
      icon: Briefcase,
      bgPill: 'bg-[#EFF6FF] text-[#2563EB]',
      status: 'Loyalty Live',
      statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      actionLabel: 'Customer CRM',
    },
    {
      id: 'kds',
      title: 'Kitchen Display (KDS)',
      subtitle: 'Real-time order bump screen',
      href: '/kds',
      icon: ChefHat,
      bgPill: 'bg-[#FFF7ED] text-[#EA580C]',
      status: 'Fulfillment',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200',
      actionLabel: 'Launch KDS',
      target: '_blank',
    },
    {
      id: 'cfd',
      title: 'Customer Display (CFD)',
      subtitle: 'Secondary live basket & KHQR',
      href: '/pos/customer-display',
      icon: Tv,
      bgPill: 'bg-[#F0F9FF] text-[#0284C7]',
      status: 'Display Live',
      statusColor: 'bg-sky-50 text-sky-700 border-sky-200',
      actionLabel: 'Launch CFD',
      target: '_blank',
    },
    {
      id: 'reports',
      title: 'POS Reports & Auditing',
      subtitle: `${kpis.todayTransactions} sales audited today`,
      href: '/pos/reports',
      icon: TrendingUp,
      bgPill: 'bg-slate-100 text-slate-700',
      status: 'Real-time',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
      actionLabel: 'View Reports',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5B4DFB]" />
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            POS Management System Operations
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          8 Integrated POS Services Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const IconComp = mod.icon;
          return (
            <motion.div
              key={mod.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.02)] hover:shadow-md transition-shadow flex flex-col justify-between h-[180px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold shrink-0 ${mod.bgPill}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                        {mod.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${mod.statusColor}`}
                >
                  {mod.status}
                </span>

                <Link
                  href={mod.href}
                  target={mod.target}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#5B4DFB] text-[#5B4DFB] hover:text-white font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{mod.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
