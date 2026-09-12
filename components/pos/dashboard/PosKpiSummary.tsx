'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Vault,
  ArrowUpRight,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { PosKpis } from '../types';

interface PosKpiSummaryProps {
  kpis: PosKpis;
}

export function PosKpiSummary({ kpis }: PosKpiSummaryProps) {
  // Staggered entry animation variant from docs/unique.md
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' as const },
    }),
  };

  const cards = [
    // 1. Total Sales (Hero Orange Gradient from docs/unique.md)
    {
      title: "Today's POS Sales",
      value: `$${kpis.todaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${kpis.todayTransactions} completed sales`,
      icon: DollarSign,
      gradient: 'bg-brand',
      shadow: 'shadow-lg shadow-brand/20',
      badge: 'Live Sales',
      badgeColor: 'text-white bg-white/20 border-white/30',
      textColor: 'text-white',
      subTextColor: 'text-brand-subtle',
      isHeroGradient: true,
    },
    // 2. Transactions (Hero Blue Gradient from docs/unique.md)
    {
      title: 'Transactions Today',
      value: kpis.todayTransactions.toString(),
      subtitle: 'Customer orders',
      icon: ShoppingBag,
      gradient: 'bg-gradient-to-br from-blue-600 to-indigo-600',
      shadow: 'shadow-lg shadow-blue-600/20',
      badge: 'Live Stream',
      badgeColor: 'text-white bg-white/20 border-white/30',
      textColor: 'text-white',
      subTextColor: 'text-blue-100',
      isHeroGradient: true,
    },
    // 3. Average Order (Hero Emerald Gradient from docs/unique.md)
    {
      title: 'Average Order Value',
      value: `$${kpis.averageTicket.toFixed(2)}`,
      subtitle: 'Per transaction basket',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-emerald-600 to-teal-600',
      shadow: 'shadow-lg shadow-emerald-600/20',
      badge: 'Avg Ticket',
      badgeColor: 'text-white bg-white/20 border-white/30',
      textColor: 'text-white',
      subTextColor: 'text-emerald-100',
      isHeroGradient: true,
    },
    // 4. Drawer Float / Cash Safe (Vibrant Purple Gradient)
    {
      title: 'Drawer Cash Float',
      value: `$${kpis.drawerFloat.toFixed(2)}`,
      subtitle: 'Opening balance in drawer',
      icon: Vault,
      gradient: 'bg-gradient-to-br from-purple-600 to-indigo-600',
      shadow: 'shadow-lg shadow-purple-600/20',
      badge: 'Cash Safe',
      badgeColor: 'text-white bg-white/20 border-white/30',
      textColor: 'text-white',
      subTextColor: 'text-purple-100',
      isHeroGradient: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-2xl ${card.gradient} ${card.shadow} transition-all flex flex-col justify-between cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur-xs tracking-wider ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${card.subTextColor}`}>
                {card.title}
              </p>
              <h3 className={`text-2xl font-extrabold tracking-tight mt-1 ${card.textColor}`}>
                {card.value}
              </h3>
              <p className={`text-xs font-medium mt-1 ${card.subTextColor}`}>
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
