'use client';

import React from 'react';
import { Building2, CheckCircle2, Lock } from 'lucide-react';
import { PlatformModule } from './types';

interface TenantLicensingTabProps {
  modulesList: PlatformModule[];
  selectedTenantOrg: string;
  onSelectTenantOrg: (org: string) => void;
  tenantModules: string[];
  onToggleTenantModule: (moduleId: string) => void;
}

export function TenantLicensingTab({
  modulesList,
  selectedTenantOrg,
  onSelectTenantOrg,
  tenantModules,
  onToggleTenantModule,
}: TenantLicensingTabProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Tenant License Entitlement Inspector</h3>
          <p className="text-xs text-slate-500 font-medium">Select an organization to grant or revoke active module licenses.</p>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTenantOrg}
            onChange={(e) => onSelectTenantOrg(e.target.value)}
            className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
          >
            <option value="Phnom Penh Specialty Roasters">Phnom Penh Specialty Roasters (Enterprise)</option>
            <option value="Bayon Fresh Supermarket">Bayon Fresh Supermarket (Growth)</option>
            <option value="Angkor Tech Solutions">Angkor Tech Solutions (Enterprise)</option>
            <option value="Mekong Bistro">Mekong Bistro (Starter)</option>
          </select>
        </div>
      </div>

      {/* Module Entitlement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulesList.map((mod) => {
          const isEnabled = tenantModules.includes(mod.id);
          const IconComp = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => onToggleTenantModule(mod.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isEnabled
                  ? 'border-[#DDD6FE] bg-[#F5F3FF]/70 shadow-xs ring-1 ring-[#5B4DFB]/30'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${mod.bgColor} ${mod.color} flex items-center justify-center font-bold`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{mod.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">{mod.category}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isEnabled ? 'bg-[#5B4DFB] text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isEnabled ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                <span className={isEnabled ? 'text-[#5B4DFB]' : 'text-slate-500'}>
                  Status: {isEnabled ? 'Active License' : 'Disabled'}
                </span>
                <span className="text-[11px] text-slate-400">Click to Toggle</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
