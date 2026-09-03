'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CrmKpiCards,
  DealsKanbanPipeline,
  LeadsInboxCard,
  CrmActivityTimeline,
} from '@/components/crm/dashboard';
import {
  Users,
  Briefcase,
  UserPlus,
  Filter,
  Download,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Tag,
  Loader2,
  BarChart3,
  PhoneCall,
  Settings,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';

import { getCustomersApi, getUsersApi, getCrmKpisApi } from '@/lib/api';

function CrmDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Dynamic Metrics for Companies and RBAC
  const [b2bCount, setB2bCount] = useState(0);
  const [pipelineRevenue, setPipelineRevenue] = useState(0);
  const [rolesCount, setRolesCount] = useState({
    directors: 0,
    salesReps: 0,
    qualifiers: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingContacts(true);
        const [custRes, usersRes, kpiRes] = await Promise.allSettled([
          getCustomersApi(),
          getUsersApi(),
          getCrmKpisApi(),
        ]);

        if (custRes.status === 'fulfilled') {
          const list = Array.isArray(custRes.value)
            ? custRes.value
            : custRes.value?.data || [];
          setContacts(list);
          const corporate = list.filter((c: any) => Boolean(c.company));
          setB2bCount(corporate.length > 0 ? corporate.length : list.length);
        }

        if (kpiRes.status === 'fulfilled' && kpiRes.value?.data) {
          setPipelineRevenue(kpiRes.value.data.pipeline_value || 0);
        }

        if (usersRes.status === 'fulfilled') {
          const uList = Array.isArray(usersRes.value) ? usersRes.value : usersRes.value?.data || [];
          let directors = 0;
          let salesReps = 0;
          let qualifiers = 0;

          uList.forEach((u: any) => {
            const r = (u.role || u.role_name || '').toLowerCase();
            if (r === 'customer' || r === 'client' || r === 'guest') return;
            if (r.includes('admin') || r.includes('director') || r.includes('owner')) directors++;
            else if (r.includes('manager') || r.includes('supervisor')) salesReps++;
            else qualifiers++;
          });

          setRolesCount({ directors, salesReps, qualifiers });
        }
      } catch (err) {
        console.error('Failed to fetch CRM data:', err);
      } finally {
        setLoadingContacts(false);
      }
    }

    loadData();
  }, [currentTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-[#5B4DFB] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Opportunity Pipeline &amp; Customer Retention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            CRM &amp; Pipeline Operations
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-2xl">
            Track deals pipeline stages, inbound marketing leads, contact histories, and customer lifecycle retention.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/super-admin/crm/customers"
            className="px-4 py-2.5 rounded-xl bg-white text-[#5B4DFB] font-extrabold text-xs shadow-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#5B4DFB]" />
            <span>Add Contact</span>
          </Link>
          <Link
            href="/super-admin/crm/gift-cards"
            className="px-4 py-2.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 border border-purple-400 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Gift Cards</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview / Tab Rendering */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <CrmKpiCards />
          <DealsKanbanPipeline />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadsInboxCard />
            <CrmActivityTimeline />
          </div>
        </div>
      )}

      {/* Tab: Deals Pipeline */}
      {currentTab === 'deals' && (
        <div className="space-y-6">
          <CrmKpiCards />
          <DealsKanbanPipeline />
        </div>
      )}

      {/* Tab: Leads Inbox */}
      {currentTab === 'leads' && (
        <div className="space-y-6">
          <LeadsInboxCard />
          <CrmActivityTimeline />
        </div>
      )}

      {/* Tab: Activity Log */}
      {currentTab === 'activities' && (
        <div className="space-y-6">
          <CrmActivityTimeline />
          <LeadsInboxCard />
        </div>
      )}

      {/* Tab: Contacts */}
      {currentTab === 'contacts' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Contacts</h3>
              <p className="text-xs text-slate-500 font-medium">All verified customer and prospect profiles</p>
            </div>
            <Link
              href="/super-admin/crm/customers"
              className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Contact</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Contact Name</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Company &amp; Role</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Contact Details</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingContacts ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#5B4DFB] mb-1" />
                      Loading contacts directory...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No customer contacts found in this organization.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-extrabold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.company || 'Direct Consumer'}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{c.phone || c.email || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          Active Client
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href="/super-admin/crm/customers"
                          className="text-[#5B4DFB] font-extrabold hover:underline"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Companies & B2B */}
      {currentTab === 'companies' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5B4DFB]" />
                <span>Companies &amp; B2B</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Corporate wholesale accounts, billing terms, and credit lines</p>
            </div>
            <Link
              href="/super-admin/crm/customers"
              className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add B2B Company</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500">Active B2B Client Accounts</span>
              <p className="text-2xl font-black text-slate-900 font-mono">{b2bCount} Accounts</p>
              <p className="text-xs text-slate-400">Registered commercial customer profiles</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500">Active Pipeline Value</span>
              <p className="text-2xl font-black text-[#5B4DFB] font-mono">
                ${pipelineRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400">Total active commercial deal potential</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CRM Reports */}
      {currentTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#5B4DFB]" />
                <span>CRM Reports</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Pipeline velocity, win/loss conversion rates, and revenue forecasting</p>
            </div>
          </div>
          <CrmKpiCards />
        </div>
      )}

      {/* Tab: CRM Access & RBAC */}
      {currentTab === 'access' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">CRM Access &amp; RBAC</h3>
              <p className="text-xs text-slate-500 font-medium">Domain-scoped RBAC permissions (module_name = 'crm')</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-[#5B4DFB]">
              Module Scoped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">CRM Director / Admin</h4>
              <p className="text-xs text-slate-500">Full access to pipeline stages, commission rates, and deal deletion.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B4DFB] text-[10px] font-bold">
                {rolesCount.directors} Assigned
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">Sales Representative</h4>
              <p className="text-xs text-slate-500">Manage assigned contacts, move opportunities, and log calls.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {rolesCount.salesReps} Assigned
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">Lead Qualifier</h4>
              <p className="text-xs text-slate-500">Review inbound inquiries, score leads, and assign to reps.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {rolesCount.qualifiers} Assigned
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CRM Settings */}
      {currentTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#5B4DFB]" />
                <span>CRM Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Pipeline stages, automatic lead routing, and customer lifecycle triggers</p>
            </div>
            {settingsSaved && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="font-bold text-slate-700">Default Lead Probability</label>
              <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
                <option value="50">50% Initial Probability</option>
                <option value="25">25% Discovery Stage</option>
                <option value="75">75% High Intent</option>
              </select>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="font-bold text-slate-700">Auto-convert Won Deals</label>
              <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
                <option value="auto">Automatically Create Draft Sales Order</option>
                <option value="manual">Manual Conversion</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSettingsSaved(true);
                setTimeout(() => setSettingsSaved(false), 2500);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CrmPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
            <span>Loading CRM Suite...</span>
          </div>
        </div>
      }
    >
      <CrmDashboardContent />
    </Suspense>
  );
}
