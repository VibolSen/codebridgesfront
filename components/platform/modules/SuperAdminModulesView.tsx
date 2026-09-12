'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Layers,
  Sliders,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { MASTER_MODULES, TenantOption } from './types';
import { ModuleRegistryTab } from './ModuleRegistryTab';
import { TenantLicensingTab } from './TenantLicensingTab';
import { FeatureFlagsTab } from './FeatureFlagsTab';

function ModulesViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'registry';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const modulesList = MASTER_MODULES;

  // Dynamic Tenants & Entitlements State from Real API
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [tenantModules, setTenantModules] = useState<string[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [savingModule, setSavingModule] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'registry';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTabSwitch = (newTab: string) => {
    setActiveTab(newTab);
    const targetUrl = newTab === 'registry' ? '/super-admin/platform/modules' : `/super-admin/platform/modules?tab=${newTab}`;
    router.replace(targetUrl, { scroll: false });
  };

  // Fetch real tenants list from backend API
  const loadTenants = useCallback(async () => {
    try {
      setLoadingTenants(true);
      const res = await apiFetch('/super-admin/tenants');
      const tenantList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      const formatted: TenantOption[] = tenantList.map((t: any) => ({
        id: t.id,
        name: t.name,
        client_tier: t.client_tier,
        company_code: t.company_code,
        enabled_modules: t.enabled_modules,
      }));
      setTenants(formatted);
      if (formatted.length > 0 && !selectedTenantId) {
        setSelectedTenantId(formatted[0].id);
      }
    } catch {
      showToast('Failed to load tenants list from API.', 'error');
    } finally {
      setLoadingTenants(false);
    }
  }, [selectedTenantId]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  // Dynamic adoption count computed solely from real API tenant data
  const getAdoptionCount = useCallback((moduleId: string): number => {
    return tenants.filter((t) => {
      let raw = t.enabled_modules;
      if (typeof raw === 'string') {
        try {
          raw = JSON.parse(raw);
        } catch {
          raw = [];
        }
      }
      if (!Array.isArray(raw)) return false;
      return (
        raw.includes(moduleId) ||
        raw.includes(`${moduleId}-management`) ||
        raw.includes(`${moduleId}-suite`)
      );
    }).length;
  }, [tenants]);

  // Fetch active module entitlements for selected tenant from real API
  const loadTenantModules = useCallback(async (tenantId: string) => {
    if (!tenantId) return;
    try {
      setLoadingModules(true);
      const res = await apiFetch(`/tenants/modules?tenant_id=${tenantId}`);
      if (res?.success && Array.isArray(res.modules)) {
        setTenantModules(res.modules);
      } else {
        setTenantModules([]);
      }
    } catch {
      setTenantModules([]);
    } finally {
      setLoadingModules(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTenantId) {
      loadTenantModules(selectedTenantId);
    }
  }, [selectedTenantId, loadTenantModules]);

  // Live toggle persisted directly to backend cloud database
  const handleToggleTenantModule = async (moduleId: string) => {
    if (!selectedTenantId) return;
    const isCurrentlyActive = tenantModules.includes(moduleId);
    const nextModules = isCurrentlyActive
      ? tenantModules.filter((m) => m !== moduleId)
      : [...tenantModules, moduleId];

    const currentTenant = tenants.find((t) => t.id === selectedTenantId);
    const tenantName = currentTenant?.name || 'Organization';

    setTenantModules(nextModules);
    setSavingModule(true);

    try {
      const res = await apiFetch('/tenants/modules', {
        method: 'PUT',
        body: JSON.stringify({
          tenant_id: selectedTenantId,
          modules: nextModules,
        }),
      });

      if (res?.success) {
        showToast(`Updated licenses for ${tenantName}: ${isCurrentlyActive ? 'revoked' : 'granted'} ${moduleId.toUpperCase()}`);
        loadTenants();
      } else {
        setTenantModules(tenantModules);
        showToast(res?.message || 'Failed to update module on server.', 'error');
      }
    } catch (err: any) {
      setTenantModules(tenantModules);
      showToast(err?.message || 'Network error updating module entitlement.', 'error');
    } finally {
      setSavingModule(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 border animate-in fade-in slide-in-from-bottom-3 ${
            notification.type === 'error'
              ? 'bg-rose-900 border-rose-700'
              : 'bg-slate-900 border-slate-700'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-subtle text-brand text-[11px] font-extrabold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Core Subsystems</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Modules &amp; Feature Flags Studio
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
            Live catalog of platform capabilities with server-authoritative tenant license synchronization.
          </p>
        </div>

        {/* Top Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl self-start text-xs font-bold gap-1 border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => handleTabSwitch('registry')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeTab === 'registry' ? 'text-brand' : 'text-slate-400'}`} />
            <span>Module Registry</span>
          </button>
          <button
            onClick={() => handleTabSwitch('entitlements')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'entitlements'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${activeTab === 'entitlements' ? 'text-brand' : 'text-slate-400'}`} />
            <span>Tenant Entitlements</span>
          </button>
          <button
            onClick={() => handleTabSwitch('flags')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'flags'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'flags' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Feature Flags</span>
          </button>
        </div>
      </div>

      {activeTab === 'registry' && (
        <ModuleRegistryTab
          modulesList={modulesList}
          getAdoptionCount={getAdoptionCount}
        />
      )}

      {activeTab === 'entitlements' && (
        <TenantLicensingTab
          modulesList={modulesList}
          tenants={tenants}
          selectedTenantId={selectedTenantId}
          onSelectTenantId={setSelectedTenantId}
          tenantModules={tenantModules}
          onToggleTenantModule={handleToggleTenantModule}
          loadingTenants={loadingTenants}
          loadingModules={loadingModules}
          saving={savingModule}
        />
      )}

      {activeTab === 'flags' && <FeatureFlagsTab />}
    </div>
  );
}

export function SuperAdminModulesView() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
            <span>Loading Modules Studio...</span>
          </div>
        </div>
      }
    >
      <ModulesViewContent />
    </Suspense>
  );
}
