'use client';

import React from 'react';
import { Building2, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { PlatformModule, TenantOption } from './types';

interface TenantLicensingTabProps {
  modulesList: PlatformModule[];
  tenants: TenantOption[];
  selectedTenantId: string;
  onSelectTenantId: (id: string) => void;
  tenantModules: string[];
  onToggleTenantModule: (moduleId: string) => void;
  loadingTenants?: boolean;
  loadingModules?: boolean;
  saving?: boolean;
}

export function TenantLicensingTab({
  modulesList,
  tenants,
  selectedTenantId,
  onSelectTenantId,
  tenantModules,
  onToggleTenantModule,
  loadingTenants = false,
  loadingModules = false,
  saving = false,
}: TenantLicensingTabProps) {
  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900">Tenant License Entitlement Inspector</h3>
            {saving && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B4DFB] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">Select an organization to grant or revoke active module licenses.</p>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          {loadingTenants ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-500 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5B4DFB]" />
              <span>Loading tenants...</span>
            </div>
          ) : (
            <select
              value={selectedTenantId}
              onChange={(e) => onSelectTenantId(e.target.value)}
              className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] cursor-pointer max-w-[280px] truncate"
            >
              {tenants.length === 0 ? (
                <option value="">No organizations available</option>
              ) : (
                tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.client_tier?.replace('_', ' ') || 'standard'})
                  </option>
                ))
              )}
            </select>
          )}
        </div>
      </div>

      {loadingModules ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#5B4DFB]" />
          <span className="text-xs font-bold">Loading active licenses...</span>
        </div>
      ) : (
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
      )}

      {selectedTenant && (
        <div className="text-[11px] font-medium text-slate-400 text-right">
          Managing entitlements for: <strong className="text-slate-700">{selectedTenant.name}</strong> ({selectedTenant.company_code || selectedTenant.id})
        </div>
      )}
    </div>
  );
}
