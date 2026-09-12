'use client';

import React from 'react';
import { Store, Briefcase, Mail, Phone } from 'lucide-react';

interface CreateOrgFormFieldsProps {
  workspaceType: 'personal' | 'company';
  name: string;
  setName: (name: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

export function CreateOrgFormFields({
  workspaceType,
  name,
  setName,
  industry,
  setIndustry,
  email,
  setEmail,
  phone,
  setPhone,
}: CreateOrgFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Workspace Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-brand" />
          <span>
            {workspaceType === 'personal' ? 'Store / Workspace Name' : 'Company / Organization Name'}{' '}
            <span className="text-rose-500">*</span>
          </span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            workspaceType === 'personal'
              ? 'e.g. Sokha Coffee Bar, Kiosk #3'
              : 'e.g. Phnom Penh Retail Mart, Grand Cafe Group'
          }
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-xs font-semibold text-slate-900 bg-slate-50/50 placeholder:text-slate-400"
        />
      </div>

      {/* Industry Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-brand" />
          <span>Industry Type</span>
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-xs font-semibold text-slate-800 bg-slate-50/50"
        >
          <option value="retail">Retail & Fashion</option>
          <option value="restaurant">Restaurant, Cafe & Bar</option>
          <option value="grocery">Supermarket & Minimart</option>
          <option value="electronics">Electronics & Mobile</option>
          <option value="pharmacy">Pharmacy & Health</option>
          <option value="services">Services & Other</option>
        </select>
      </div>

      {/* Optional Contact Fields in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>Contact Email (Optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@store.com"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand text-xs font-medium text-slate-800 bg-slate-50/50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>Phone Number (Optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+855 12 345 678"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand text-xs font-medium text-slate-800 bg-slate-50/50"
          />
        </div>
      </div>
    </div>
  );
}
