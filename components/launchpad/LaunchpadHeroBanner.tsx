'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  Building2,
} from 'lucide-react';
import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';

interface LaunchpadHeroBannerProps {
  user: any;
  hasValidOrg: boolean;
  enabledCount: number;
  totalModules: number;
  onOpenManageModal: () => void;
}

export function LaunchpadHeroBanner({
  user,
  hasValidOrg,
  enabledCount,
  totalModules,
  onOpenManageModal,
}: LaunchpadHeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-7 sm:p-9 shadow-xl shadow-orange-500/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 w-full">
        {/* Top Row: Brand Info + Workspace Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-white/25">
                <Store className="w-3.5 h-3.5 text-yellow-300" />
                <span>CodeBridges Enterprise POS</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-xs text-emerald-100 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live Ecosystem</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              POS Management Platform
            </h1>
            <p className="text-xs sm:text-sm text-orange-50 font-medium leading-relaxed">
              Unified enterprise commerce platform connecting your Cashier Register, Real-Time Inventory, Double-Entry Finance, Staff &amp; PIN Attendance, Customer CRM, and Kitchen KDS.
            </p>
          </div>

          {/* Right: Workspace Switcher Bar */}
          <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-inner">
            <OrganizationManagerBar />
          </div>
        </div>

        {/* Bottom Highlights & Guarantees (Section 11 of unique.md) */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-bold text-orange-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
              <Layers className="w-3 h-3 text-yellow-300" />
            </div>
            <span>8 Built-In Services Included</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-yellow-300" />
            </div>
            <span>Multi-Outlet &amp; Multi-Terminal Native</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-yellow-300" />
            </div>
            <span>100% Real-Time Ledger Sync</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
