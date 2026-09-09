'use client';

import React from 'react';

interface GeneralSettingsTabProps {
  platformName: string;
  setPlatformName: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (val: string) => void;
  defaultTrialDays: string;
  setDefaultTrialDays: (val: string) => void;
  defaultTaxRate: string;
  setDefaultTaxRate: (val: string) => void;
}

export function GeneralSettingsTab({
  platformName,
  setPlatformName,
  supportEmail,
  setSupportEmail,
  defaultCurrency,
  setDefaultCurrency,
  defaultTrialDays,
  setDefaultTrialDays,
  defaultTaxRate,
  setDefaultTaxRate,
}: GeneralSettingsTabProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
        Platform General Defaults
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Platform Name
          </label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Master Support Email
          </label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Default Platform Base Currency
          </label>
          <select
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
          >
            <option value="USD">USD ($) - United States Dollar (Dual-currency KHR active)</option>
            <option value="KHR">KHR (៛) - Khmer Riel</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Default Free Trial Period (Days)
          </label>
          <input
            type="number"
            value={defaultTrialDays}
            onChange={(e) => setDefaultTrialDays(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Default Sales VAT / Tax Rate (%)
          </label>
          <input
            type="number"
            value={defaultTaxRate}
            onChange={(e) => setDefaultTaxRate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
      </div>
    </div>
  );
}
