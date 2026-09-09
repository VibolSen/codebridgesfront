'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Layers,
  Sliders,
  Zap,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { MASTER_MODULES, INITIAL_FLAGS, PlatformModule, FeatureFlag } from './types';
import { ModuleRegistryTab } from './ModuleRegistryTab';
import { TenantLicensingTab } from './TenantLicensingTab';
import { FeatureFlagsTab } from './FeatureFlagsTab';

function ModulesViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'registry';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [modulesList, setModulesList] = useState<PlatformModule[]>(MASTER_MODULES);
  const [flagsList, setFlagsList] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [selectedTenantOrg, setSelectedTenantOrg] = useState('Phnom Penh Specialty Roasters');
  const [tenantModules, setTenantModules] = useState<string[]>(['pos', 'inventory', 'finance', 'hrm']);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'registry';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  const handleTabSwitch = (newTab: string) => {
    setActiveTab(newTab);
    const targetUrl = newTab === 'registry' ? '/super-admin/platform/modules' : `/super-admin/platform/modules?tab=${newTab}`;
    router.replace(targetUrl, { scroll: false });
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleDefault = (moduleId: string) => {
    setModulesList((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isDefault: !m.isDefault } : m))
    );
    showToast('Default registration module entitlement updated.');
  };

  const handleToggleTenantModule = (moduleId: string) => {
    const next = tenantModules.includes(moduleId)
      ? tenantModules.filter((m) => m !== moduleId)
      : [...tenantModules, moduleId];
    setTenantModules(next);
    showToast(`Updated module entitlement for ${selectedTenantOrg}`);
  };

  const handleFlagStatusChange = (flagId: string, newStatus: 'enabled_all' | 'beta_only' | 'disabled') => {
    setFlagsList((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, status: newStatus } : f))
    );
    showToast('Feature flag rollout status updated.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F3FF] text-[#5B4DFB] text-[11px] font-extrabold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Core Subsystems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Modules & Feature Flags Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Configure global platform module availability, grant or revoke organization licenses, and control beta feature rollouts.
          </p>
        </div>

        {/* Top Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl self-start text-xs font-bold gap-1 border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => handleTabSwitch('registry')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'registry' ? 'text-[#5B4DFB]' : 'text-slate-400'}`} />
            <span>Module Registry</span>
          </button>
          <button
            onClick={() => handleTabSwitch('entitlements')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'entitlements'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sliders className={`w-4 h-4 ${activeTab === 'entitlements' ? 'text-[#5B4DFB]' : 'text-slate-400'}`} />
            <span>Tenant Entitlements</span>
          </button>
          <button
            onClick={() => handleTabSwitch('flags')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'flags'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'flags' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Feature Flags</span>
          </button>
        </div>
      </div>

      {activeTab === 'registry' && (
        <ModuleRegistryTab
          modulesList={modulesList}
          onToggleDefault={handleToggleDefault}
        />
      )}

      {activeTab === 'entitlements' && (
        <TenantLicensingTab
          modulesList={modulesList}
          selectedTenantOrg={selectedTenantOrg}
          onSelectTenantOrg={setSelectedTenantOrg}
          tenantModules={tenantModules}
          onToggleTenantModule={handleToggleTenantModule}
        />
      )}

      {activeTab === 'flags' && (
        <FeatureFlagsTab
          flagsList={flagsList}
          onFlagStatusChange={handleFlagStatusChange}
        />
      )}
    </div>
  );
}

export function SuperAdminModulesView() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
            <span>Loading Module Registry...</span>
          </div>
        </div>
      }
    >
      <ModulesViewContent />
    </Suspense>
  );
}
