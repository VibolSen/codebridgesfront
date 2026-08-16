'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Sparkles,
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
          className="text-xs font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors cursor-pointer bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs"
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-[10px] font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          SaaS Cloud POS — Built for Every Business Size
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Start your CodeBridges
          <br />
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
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
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => onSelectPlan(plan)}
              className={`relative rounded-2xl border cursor-pointer transition-all p-6 space-y-5 ${
                isSelected
                  ? 'border-2 border-orange-500 bg-white shadow-xl shadow-orange-500/10'
                  : 'border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-orange-300'
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r ${plan.gradient} shadow-md`}
                >
                  {plan.badge}
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white shadow-md shadow-orange-500/15`}
              >
                {plan.icon}
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

              <div className="flex gap-3 text-[10px] font-bold tracking-wider uppercase text-slate-600 border-t border-slate-100 pt-3.5 bg-slate-50/70 -mx-6 -mb-1 px-6 py-2.5">
                <span>🏪 {plan.maxOutlets} Outlets</span>
                <span>🖥 {plan.maxRegisters} Registers</span>
                <span>👥 {plan.maxUsers} Users</span>
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
                    ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg shadow-orange-500/20`
                    : 'bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-800'
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
          <BarChart3 className="w-4 h-4 text-orange-600" /> Real-Time Analytics
        </span>
      </div>
    </div>
  );
}
