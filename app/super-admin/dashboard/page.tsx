'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAuthUser, getDashboardSummaryApi } from '@/lib/api';
import {
  PlatformKpiCards,
  MicroserviceHealthMatrix,
  ModuleAdoptionCard,
  PlatformGrowthChart,
  TenantActivityFeed,
} from '@/components/super-admin/dashboard';
import {
  Building2,
  Layers,
  Sparkles,
  Server,
  Activity,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
} from 'lucide-react';

function SuperAdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(currentTab);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') || 'overview');
    }
  }, [searchParams]);

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>CodeBridge Multi-Product Cloud Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Platform Operations & Executive Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-orange-50 font-medium leading-relaxed">
            Centralized orchestration across all customer organizations, microservice health, MRR revenue cohorts, and module provisioning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/super-admin/platform/tenants"
            className="px-4 py-2.5 rounded-xl bg-white text-orange-700 font-extrabold text-xs hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Tenants</span>
          </Link>
          <Link
            href="/super-admin/platform/modules"
            className="px-4 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Module Registry</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'growth'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>MRR & Growth</span>
        </button>

        <button
          onClick={() => setActiveTab('infra')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'infra'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Microservice Health</span>
        </button>
      </div>

      {/* 3. Tab Views */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 6 Hero KPI Overview Cards */}
          <PlatformKpiCards />

          {/* Grid Layout: Growth Chart + Module Adoption */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PlatformGrowthChart />
            </div>
            <div className="lg:col-span-1">
              <ModuleAdoptionCard />
            </div>
          </div>

          {/* Grid Layout: Microservice Telemetry + Real-Time Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MicroserviceHealthMatrix />
            </div>
            <div className="lg:col-span-1">
              <TenantActivityFeed />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="space-y-6">
          <PlatformGrowthChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformKpiCards />
            <ModuleAdoptionCard />
          </div>
        </div>
      )}

      {activeTab === 'infra' && (
        <div className="space-y-6">
          <MicroserviceHealthMatrix />
          <TenantActivityFeed />
        </div>
      )}
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span>Loading Platform Cockpit...</span>
          </div>
        </div>
      }
    >
      <SuperAdminDashboardContent />
    </Suspense>
  );
}
