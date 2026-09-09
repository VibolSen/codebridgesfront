'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Store,
  Monitor,
  Users,
  Check,
  ChevronRight,
  ShieldCheck,
  Globe,
  Lock,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export interface PlanTier {
  id: 'free_personal' | 'business_runner' | 'enterprise_org';
  label: string;
  icon: React.ReactNode;
  badge?: string;
  price: number;
  billing: string;
  description: string;
  maxOutlets: number;
  maxRegisters: number;
  maxUsers: number;
  features: string[];
  gradient: string;
  cta: string;
}

interface PlanTierSelectorProps {
  plans: PlanTier[];
  selectedPlan: PlanTier | null;
  onSelectPlan: (plan: PlanTier) => void;
  onProceedToForm: (plan: PlanTier) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' as const },
  }),
};

export function PlanTierSelector({
  plans,
  selectedPlan,
  onSelectPlan,
  onProceedToForm,
}: PlanTierSelectorProps) {
  return (
    <div className="space-y-12">
      {/* Top Back Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/CodeBridgesOnboardingLaunchpad"
          className="text-xs font-bold text-slate-500 hover:text-[#5B4DFB] flex items-center gap-1.5 transition-colors cursor-pointer bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Onboarding Launchpad</span>
        </Link>
      </div>

      {/* Hero Headline */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B4DFB] text-[10px] font-bold tracking-wider uppercase shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B4DFB]" />
          SaaS Cloud POS — Built for Every Business Size
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Start your CodeBridges
          <br />
          <span className="bg-gradient-to-r from-[#5B4DFB] via-[#7C3AED] to-[#5B4DFB] bg-clip-text text-transparent">
            Cloud Workspace
          </span>
        </h1>
        <p className="text-slate-500 text-xs font-medium max-w-xl mx-auto leading-relaxed">
          Choose the plan that fits your business. From solo street vendor to multi-chain enterprise — all in one powerful platform.
        </p>
      </motion.div>

      {/* Plan Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan, i) => {
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              custom={i}
              whileHover={{ y: -4 }}
              onClick={() => onSelectPlan?.(plan)}
              className={`relative bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                isSelected
                  ? 'border-[#5B4DFB] shadow-xl shadow-[#5B4DFB]/10'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-[#5B4DFB] to-[#7C3AED] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md shadow-[#5B4DFB]/20">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#5B4DFB] flex items-center justify-center">
                  {plan.icon}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#5B4DFB] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{plan.label}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  ${plan.price}
                </span>
                <span className="text-xs font-medium text-slate-500 pb-0.5">{plan.billing}</span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase text-slate-600 border-t border-slate-100 pt-3.5 bg-slate-50/70 -mx-6 -mb-1 px-6 py-2.5">
                <span className="inline-flex items-center gap-1">
                  <Store className="w-3 h-3 text-slate-400" />
                  <span>{plan.maxOutlets} Outlets</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-slate-400" />
                  <span>{plan.maxRegisters} Registers</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{plan.maxUsers} Users</span>
                </span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onProceedToForm(plan);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg shadow-[#5B4DFB]/20`
                    : 'bg-slate-100 hover:bg-[#F5F3FF] hover:text-[#5B4DFB] border border-slate-200 text-slate-800'
                }`}
              >
                <span>{plan.cta}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-4 text-slate-600 text-xs font-semibold">
        <span className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Enterprise-Grade Security
        </span>
        <span className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs">
          <Globe className="w-4 h-4 text-blue-600" /> ABA Bakong & KHQR Payments
        </span>
        <span className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs">
          <Lock className="w-4 h-4 text-purple-600" /> Multi-Tenant Data Isolation
        </span>
        <span className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs">
          <BarChart3 className="w-4 h-4 text-[#5B4DFB]" /> Real-Time Analytics
        </span>
      </div>
    </div>
  );
}
