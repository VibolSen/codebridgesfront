'use client';

import React from 'react';
import Link from 'next/link';
import {
  CrmKpiCards,
  DealsKanbanPipeline,
  LeadsInboxCard,
  CrmActivityTimeline,
} from './index';
import {
  Building2,
  Loader2,
  BarChart3,
  Settings,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface CrmTabPanelsProps {
  currentTab: string;
  contacts: any[];
  loadingContacts: boolean;
  b2bCount: number;
  pipelineRevenue: number;
  rolesCount: { directors: number; salesReps: number; qualifiers: number };
  settingsSaved: boolean;
  setSettingsSaved: (v: boolean) => void;
}

export function CrmTabPanels({
  currentTab,
  contacts,
  loadingContacts,
  b2bCount,
  pipelineRevenue,
  rolesCount,
  settingsSaved,
  setSettingsSaved,
}: CrmTabPanelsProps) {
  if (currentTab === 'overview') {
    return (
      <div className="space-y-6">
        <CrmKpiCards />
        <DealsKanbanPipeline />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsInboxCard />
          <CrmActivityTimeline />
        </div>
      </div>
    );
  }

  if (currentTab === 'deals') {
    return (
      <div className="space-y-6">
        <CrmKpiCards />
        <DealsKanbanPipeline />
      </div>
    );
  }

  if (currentTab === 'leads') {
    return (
      <div className="space-y-6">
        <LeadsInboxCard />
        <CrmActivityTimeline />
      </div>
    );
  }

  if (currentTab === 'activities') {
    return (
      <div className="space-y-6">
        <CrmActivityTimeline />
        <LeadsInboxCard />
      </div>
    );
  }

  if (currentTab === 'contacts') {
    return (
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
                      <Link href="/super-admin/crm/customers" className="text-[#5B4DFB] font-extrabold hover:underline">
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
    );
  }

  if (currentTab === 'companies') {
    return (
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
    );
  }

  if (currentTab === 'reports') {
    return (
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
    );
  }

  if (currentTab === 'access') {
    return (
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
    );
  }

  if (currentTab === 'settings') {
    return (
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
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
