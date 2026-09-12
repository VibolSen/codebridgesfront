'use client';

import React from 'react';
import { Building2, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { ModuleCard } from '@/components/ui';
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
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Tenant License Entitlements</h3>
            {saving && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand bg-brand-subtle px-2 py-0.5 rounded-md">
                <Loader2 className="w-3 h-3 animate-spin" />
                Syncing API...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">Select an organization to grant or revoke live module licenses.</p>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          {loadingTenants ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-500 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
              <span>Loading tenants...</span>
            </div>
          ) : (
            <select
              value={selectedTenantId}
              onChange={(e) => onSelectTenantId(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer max-w-[260px] truncate"
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
          <Loader2 className="w-5 h-5 animate-spin text-brand" />
          <span className="text-xs font-bold">Fetching active entitlements...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {modulesList.map((mod) => {
            const isEnabled = tenantModules.includes(mod.id);

            return (
              <ModuleCard
                key={mod.id}
                name={mod.name}
                category={mod.category}
                icon={mod.icon}
                color={mod.color}
                bgColor={mod.bgColor}
                size="compact"
                isSelected={isEnabled}
                onClick={() => onToggleTenantModule(mod.id)}
                actionSlot={
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${
                      isEnabled
                        ? 'bg-brand text-white border-transparent shadow-2xs'
                        : 'bg-slate-200/80 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isEnabled ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5" />
                        <span>Off</span>
                      </>
                    )}
                  </span>
                }
              />
            );
          })}
        </div>
      )}

      {selectedTenant && (
        <div className="text-[10px] font-medium text-slate-400 text-right">
          Active Workspace: <strong className="text-slate-700">{selectedTenant.name}</strong> ({selectedTenant.company_code || selectedTenant.id})
        </div>
      )}
    </div>
  );
}
