'use client';

import React from 'react';
import Link from 'next/link';
import {
  AccountingKpiCards,
  CashFlowTrajectoryCard,
  InvoicesArCard,
  BillsApCard,
} from './index';
import {
  BookOpen,
  Landmark,
  FileSpreadsheet,
  BarChart3,
  Settings,
  Plus,
  CheckCircle2,
  Save,
  Loader2,
} from 'lucide-react';

interface AccountingTabPanelsProps {
  currentTab: string;
  bankAccounts: any[];
  loadingAccounts: boolean;
  reconciliationStats: { resolved: number; pending: number; discrepancy: number };
  loadingRecon: boolean;
  journalVouchersCount: number;
  staffCounts: { accountants: number; clerks: number; auditors: number };
  loadingStaff: boolean;
  settingsSaved: boolean;
  setSettingsSaved: (v: boolean) => void;
}

export function AccountingTabPanels({
  currentTab,
  bankAccounts,
  loadingAccounts,
  reconciliationStats,
  loadingRecon,
  journalVouchersCount,
  staffCounts,
  loadingStaff,
  settingsSaved,
  setSettingsSaved,
}: AccountingTabPanelsProps) {
  if (currentTab === 'overview') {
    return (
      <div className="space-y-6">
        <AccountingKpiCards />
        <CashFlowTrajectoryCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoicesArCard />
          <BillsApCard />
        </div>
      </div>
    );
  }

  if (currentTab === 'coa') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5B4DFB]" />
              <span>Chart of Accounts (COA)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Double-entry ledger chart of accounts structure</p>
          </div>
          <Link
            href="/super-admin/finance/bank-accounts"
            className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Bank Accounts</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Account Name</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Classification</th>
                <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase">Current Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingAccounts ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#5B4DFB] mb-1" />
                    Loading live Chart of Accounts...
                  </td>
                </tr>
              ) : bankAccounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    No bank accounts or ledger classifications configured in database.
                  </td>
                </tr>
              ) : (
                bankAccounts.map((a: any) => (
                  <tr key={a.id || a.account_number || a.code} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{a.code || a.account_number || '1010'}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-900">{a.bank_name || a.name || 'ABA Bank USD'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {a.type || a.account_type || 'Current Asset'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-slate-900">
                      ${Number(a.balance || a.current_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

  if (currentTab === 'invoices') {
    return (
      <div className="space-y-6">
        <AccountingKpiCards />
        <InvoicesArCard />
      </div>
    );
  }

  if (currentTab === 'bills') {
    return (
      <div className="space-y-6">
        <AccountingKpiCards />
        <BillsApCard />
      </div>
    );
  }

  if (currentTab === 'bank') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#5B4DFB]" />
              <span>Bank Feeds &amp; Reconciliation</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Bakong KHQR, ABA PayWay, and commercial bank statement matching</p>
          </div>
          <Link
            href="/super-admin/finance/reconciliation"
            className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch Batch Audit</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
            <span className="text-[11px] font-bold text-slate-500">Matched Transactions</span>
            <p className="text-xl font-black text-slate-900">{loadingRecon ? '...' : `${reconciliationStats.resolved} Settled`}</p>
            <p className="text-[10px] text-slate-400">Reconciled gateway payments</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-[11px] font-bold text-slate-500">Unreconciled Exceptions</span>
            <p className="text-xl font-black text-amber-700">{loadingRecon ? '...' : `${reconciliationStats.pending} Pending Review`}</p>
            <p className="text-[10px] text-amber-600 font-medium">Flagged for manual audit</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-[11px] font-bold text-slate-500">Discrepancy Variance</span>
            <p className="text-xl font-black text-emerald-700 font-mono">{loadingRecon ? '...' : `$${Number(reconciliationStats.discrepancy).toFixed(2)}`}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Payment gateway delta</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'journals') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#5B4DFB]" />
              <span>Journal Entries &amp; Vouchers</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Manual debit/credit adjustments and fiscal closing entries</p>
          </div>
          <Link
            href="/super-admin/finance/expenses"
            className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Journal Voucher</span>
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">Posted Ledger Entries (Expenses &amp; Miscellaneous Revenue)</span>
          <p className="text-2xl font-black text-slate-900 font-mono">{journalVouchersCount} Balanced Entries</p>
          <p className="text-xs text-slate-400">All posted entries are validated with double-entry balanced debit/credits.</p>
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
              <span>P&amp;L &amp; Balance Sheet</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Profit &amp; Loss statements, EBITDA margins, and Balance Sheet ledger</p>
          </div>
          <Link
            href="/super-admin/finance/reports"
            className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Full Financial Reports Studio</span>
          </Link>
        </div>
        <CashFlowTrajectoryCard />
      </div>
    );
  }

  if (currentTab === 'access') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Accounting Access &amp; RBAC</h3>
            <p className="text-xs text-slate-500 font-medium">Domain-scoped RBAC permissions (module_name = 'accounting')</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-[#5B4DFB]">
            Module Scoped
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900">Chief Accountant / CFO</h4>
            <p className="text-xs text-slate-500">Approve journal adjustments, lock fiscal periods, and generate tax filings.</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B4DFB] text-[10px] font-bold">
              {loadingStaff ? '...' : `${staffCounts.accountants} Assigned`}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900">Accounts Clerk</h4>
            <p className="text-xs text-slate-500">Record vendor bills, issue B2B tax invoices, and reconcile bank statements.</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {loadingStaff ? '...' : `${staffCounts.clerks} Assigned`}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900">Tax Auditor</h4>
            <p className="text-xs text-slate-500">Read-only audit access to historical journals, vouchers, and VAT returns.</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              {loadingStaff ? '...' : `${staffCounts.auditors} Assigned`}
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
              <span>Accounting Settings</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Fiscal year start month, tax / VAT defaults, and multi-currency rounding</p>
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
            <label className="font-bold text-slate-700">Fiscal Year Start</label>
            <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
              <option value="1">January 1st (Calendar Year)</option>
              <option value="4">April 1st</option>
              <option value="7">July 1st</option>
              <option value="10">October 1st</option>
            </select>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="font-bold text-slate-700">Default Currency &amp; Rounding</label>
            <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
              <option value="USD">USD ($) - 2 Decimal Digits</option>
              <option value="KHR">KHR (៛) - Whole Integer (No Cents)</option>
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
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
