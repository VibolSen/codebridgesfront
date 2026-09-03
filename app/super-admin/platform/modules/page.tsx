'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Layers,
  Monitor,
  Boxes,
  DollarSign,
  Briefcase,
  Users,
  ShoppingBag,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Building2,
  Lock,
  Tag,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import { getAuthUser, apiFetch } from '@/lib/api';

interface PlatformModule {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  status: 'GA / Stable' | 'Beta' | 'Enterprise';
  version: string;
  adoptionCount: number;
  isDefault: boolean;
}

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  status: 'enabled_all' | 'beta_only' | 'disabled';
  betaTenantsCount: number;
  module: string;
}

const MASTER_MODULES: PlatformModule[] = [
  {
    id: 'pos',
    name: 'Point of Sale (POS)',
    category: 'Sales & Terminal',
    description: 'Fast-touch cashier register, dual-currency split tender, shift till auditing, and KDS routing.',
    icon: Monitor,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    status: 'GA / Stable',
    version: 'v2.4.0',
    adoptionCount: 124,
    isDefault: true,
  },
  {
    id: 'inventory',
    name: 'Stock & Inventory Engine',
    category: 'Supply Chain',
    description: 'Dual-layer stock ledger, multi-warehouse storage, PO procurement, and FEFO expiry tracking.',
    icon: Boxes,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    status: 'GA / Stable',
    version: 'v2.4.0',
    adoptionCount: 116,
    isDefault: true,
  },
  {
    id: 'finance',
    name: 'Finance & Accounts',
    category: 'Financial Operations',
    description: 'Automated ABA settlement reconciliation, double-entry ledgers, expenses, and margin reports.',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    status: 'GA / Stable',
    version: 'v2.3.5',
    adoptionCount: 88,
    isDefault: true,
  },
  {
    id: 'hrm',
    name: 'HR & Workforce',
    category: 'Human Capital',
    description: 'Staff employee roster, biometric timesheets, shift PIN security, and payroll export.',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    status: 'GA / Stable',
    version: 'v2.2.0',
    adoptionCount: 64,
    isDefault: false,
  },
  {
    id: 'crm',
    name: 'CRM & Pipeline',
    category: 'Customer Growth',
    description: 'Deals pipeline Kanban, lead capture forms, customer communication history, and loyalty.',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    status: 'Beta',
    version: 'v2.1.0-beta',
    adoptionCount: 52,
    isDefault: false,
  },
  {
    id: 'shop',
    name: 'Public E-Commerce Storefront',
    category: 'Digital Commerce',
    description: 'Web catalog, shopper carting, delivery logistics tracking, and NBC Bakong KHQR checkout.',
    icon: ShoppingBag,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    status: 'GA / Stable',
    version: 'v2.0.0',
    adoptionCount: 38,
    isDefault: false,
  },
];

const INITIAL_FLAGS: FeatureFlag[] = [
  {
    id: 'flag-1',
    name: 'AI Sales Forecast & Demand Prediction',
    key: 'ai_demand_forecast',
    description: 'Predicts inventory restock dates and suggests PO quantities using historical sales velocity.',
    status: 'beta_only',
    betaTenantsCount: 14,
    module: 'inventory',
  },
  {
    id: 'flag-2',
    name: 'Telegram Digital E-Receipt Dispatcher',
    key: 'telegram_ereceipts_v2',
    description: 'Sends instant web receipts to customers Telegram handle upon checkout completion.',
    status: 'enabled_all',
    betaTenantsCount: 128,
    module: 'pos',
  },
  {
    id: 'flag-3',
    name: 'Multi-Station KDS Course Firing',
    key: 'kds_course_staging',
    description: 'Staged course routing (Appetizers -> Mains -> Desserts) across kitchen display stations.',
    status: 'beta_only',
    betaTenantsCount: 8,
    module: 'pos',
  },
  {
    id: 'flag-4',
    name: 'Automatic Multi-Currency Exchange Rate Sync',
    key: 'auto_fx_rates_sync',
    description: 'Hourly NBC exchange rate sync for automated USD to KHR retail price updates.',
    status: 'enabled_all',
    betaTenantsCount: 128,
    module: 'finance',
  },
];

function ModulesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'registry';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [modulesList, setModulesList] = useState<PlatformModule[]>(MASTER_MODULES);
  const [flagsList, setFlagsList] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-extrabold uppercase tracking-wider">
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
            <Layers className={`w-4 h-4 ${activeTab === 'registry' ? 'text-orange-600' : 'text-slate-400'}`} />
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
            <Sliders className={`w-4 h-4 ${activeTab === 'entitlements' ? 'text-purple-600' : 'text-slate-400'}`} />
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

      {/* Tab 1: Module Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulesList.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${mod.bgColor} ${mod.color} flex items-center justify-center font-bold shadow-xs`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          mod.status.includes('GA')
                            ? 'bg-emerald-100 text-emerald-800'
                            : mod.status.includes('Beta')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {mod.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{mod.name}</h3>
                      <span className="text-[11px] font-semibold text-slate-400 font-mono">{mod.category} • {mod.version}</span>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-700">
                      <span>{mod.adoptionCount}</span> <span className="text-slate-400 font-normal">tenants</span>
                    </div>

                    <button
                      onClick={() => handleToggleDefault(mod.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1.5 ${
                        mod.isDefault
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Default Suite:</span>
                      <strong>{mod.isDefault ? 'ON' : 'OFF'}</strong>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Tenant Entitlements Manager */}
      {activeTab === 'entitlements' && (
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
                onChange={(e) => setSelectedTenantOrg(e.target.value)}
                className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            {MASTER_MODULES.map((mod) => {
              const isEnabled = tenantModules.includes(mod.id);
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => handleToggleTenantModule(mod.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isEnabled
                      ? 'border-orange-300 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/30'
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
                        isEnabled ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isEnabled ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <span className={isEnabled ? 'text-orange-700' : 'text-slate-500'}>
                      Status: {isEnabled ? 'Active License' : 'Disabled'}
                    </span>
                    <span className="text-[11px] text-slate-400">Click to Toggle</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Beta Feature Flags Studio */}
      {activeTab === 'flags' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Gradual Rollouts & Beta Feature Flags</h3>
            <p className="text-xs text-slate-500 font-medium">Safely test experimental features per tenant cohort with instant kill-switches.</p>
          </div>

          <div className="space-y-4">
            {flagsList.map((flag) => (
              <div
                key={flag.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{flag.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                      {flag.key}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{flag.description}</p>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Active in: <strong>{flag.betaTenantsCount}</strong> workspaces
                  </span>
                </div>

                {/* Rollout Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl self-start md:self-center shrink-0">
                  <button
                    onClick={() => handleFlagStatusChange(flag.id, 'disabled')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      flag.status === 'disabled'
                        ? 'bg-rose-100 text-rose-800 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Disabled (OFF)
                  </button>
                  <button
                    onClick={() => handleFlagStatusChange(flag.id, 'beta_only')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      flag.status === 'beta_only'
                        ? 'bg-purple-100 text-purple-800 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Beta Cohort Only
                  </button>
                  <button
                    onClick={() => handleFlagStatusChange(flag.id, 'enabled_all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      flag.status === 'enabled_all'
                        ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    100% Global Rollout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlatformModulesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span>Loading Module Registry...</span>
          </div>
        </div>
      }
    >
      <ModulesPageContent />
    </Suspense>
  );
}
