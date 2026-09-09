'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { PlanTier } from './PlanTierSelector';

export interface TenantFormData {
  workspaceType: 'personal' | 'company';
  fullName: string;
  email: string;
  phone: string;
  country: string;
  name: string;
  taxId: string;
  industry: string;
  address: string;
}

interface TenantRegistrationFormProps {
  selectedPlan: PlanTier;
  formData: TenantFormData;
  setFormData: React.Dispatch<React.SetStateAction<TenantFormData>>;
  onBackToPlans: () => void;
  onSelectPlanType: (type: 'personal' | 'company') => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export function TenantRegistrationForm({
  selectedPlan,
  formData,
  setFormData,
  onBackToPlans,
  onSelectPlanType,
  onSubmit,
  loading,
  error,
}: TenantRegistrationFormProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Back Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToPlans}
          className="text-xs font-bold text-slate-500 hover:text-[#5B4DFB] flex items-center gap-1.5 transition-colors cursor-pointer bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Plans Selection</span>
        </button>
        <Link
          href="/CodeBridgesOnboardingLaunchpad"
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Cancel Setup
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-[#5B4DFB]/5 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${selectedPlan.gradient} flex items-center justify-center text-white shadow-md text-xs`}
              >
                {selectedPlan.icon}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Register Your Workspace
              </h2>
            </div>
            <p className="text-xs font-medium text-slate-500">
              Selected Plan: <span className="text-[#5B4DFB] font-extrabold">{selectedPlan.label}</span> (14-Day Trial Included)
            </p>
          </div>

          {/* Workspace Category Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => onSelectPlanType('personal')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                formData.workspaceType === 'personal'
                  ? 'bg-white text-[#5B4DFB] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPlanType('company')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                formData.workspaceType === 'company'
                  ? 'bg-white text-[#5B4DFB] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company / Business</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Owner Account Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Workspace Administrator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Sokha Chan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sokha@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (ABA / Bakong)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="012 345 678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country / Currency</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
                >
                  <option value="KH">🇰🇭 Cambodia (USD $ & KHR ៛)</option>
                  <option value="TH">🇹🇭 Thailand (THB ฿)</option>
                  <option value="VN">🇻🇳 Vietnam (VND ₫)</option>
                  <option value="SG">🇸🇬 Singapore (SGD $)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Company / Organization Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Store & Organization Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {formData.workspaceType === 'personal' ? 'Shop / Brand Display Name *' : 'Registered Company Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.workspaceType === 'personal' ? 'e.g. Sokha Coffee Cart' : 'e.g. Dreams Retail Co., Ltd'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
              />
            </div>

            {formData.workspaceType === 'company' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tax / VAT ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="e.g. K001-902102938"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry Category</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
                  >
                    <option value="retail">Retail Store & Boutique</option>
                    <option value="cafe_restaurant">Cafe & Restaurant / F&B</option>
                    <option value="wholesale">Wholesale & Supermarket</option>
                    <option value="service">Services, Healthcare & Beauty</option>
                    <option value="solopreneur">Solopreneur & Pop-up Shop</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business Operating Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street No, Sangkat/District, Phnom Penh, Cambodia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]/30 focus:border-[#5B4DFB] transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-black text-xs text-white shadow-xl shadow-[#5B4DFB]/20 bg-gradient-to-r ${selectedPlan.gradient} hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            {loading ? (
              <>Provisioning Cloud Workspace...</>
            ) : (
              <>{selectedPlan.cta} <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>

          <p className="text-center text-slate-400 text-[10px] font-medium">
            By registering, you agree to our Terms of Service and Privacy Policy.
            Your 14-day free trial begins immediately upon workspace setup.
          </p>
        </form>
      </div>
    </div>
  );
}
