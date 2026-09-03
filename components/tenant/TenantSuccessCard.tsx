'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface TenantSuccessCardProps {
  registeredTenant: {
    name: string;
    company_code: string;
    client_tier: string;
  };
  onLaunchHub: () => void;
  onEnterAdmin: () => void;
}

export function TenantSuccessCard({
  registeredTenant,
  onLaunchHub,
  onEnterAdmin,
}: TenantSuccessCardProps) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Workspace Created Successfully
          </h2>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Your <span className="text-orange-600 font-extrabold">{registeredTenant.name}</span> organization has been provisioned. You can now launch all system modules.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-3 text-xs shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Company Code</span>
            <span className="font-mono font-black text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
              {registeredTenant.company_code}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Subscription Tier</span>
            <span className="font-bold text-slate-800 capitalize">
              {registeredTenant.client_tier.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Status</span>
            <span className="font-extrabold text-emerald-600 uppercase tracking-wider text-[10px]">
              Active Trial
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onLaunchHub}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enable Modules for {registeredTenant.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onEnterAdmin}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Enter Admin Control Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
