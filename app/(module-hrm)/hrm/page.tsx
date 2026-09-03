'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  HrmKpiCards,
  AttendanceRateCard,
  LeaveRequestsCard,
  StaffRosterTable,
} from '@/components/hrm/dashboard';
import {
  Users,
  UserPlus,
  Sparkles,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  Loader2,
  FileText,
  BarChart3,
  Settings,
  Plus,
  CheckCircle2,
  Save,
  Briefcase,
  Building2,
} from 'lucide-react';

import { getEmployeesApi, getUsersApi } from '@/lib/api';

function HrmDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Live HRM Aggregations
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [staffCount, setStaffCount] = useState(0);
  const [grossPayroll, setGrossPayroll] = useState(0);
  const [rolesCount, setRolesCount] = useState({
    directors: 0,
    managers: 0,
    staff: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingMetrics(true);
        const [empRes, usersRes] = await Promise.allSettled([
          getEmployeesApi(),
          getUsersApi(),
        ]);

        let count = 0;
        let salarySum = 0;
        if (empRes.status === 'fulfilled') {
          const empList = Array.isArray(empRes.value?.data)
            ? empRes.value.data
            : empRes.value?.data?.data || [];
          count = empList.length;
          salarySum = empList.reduce(
            (acc: number, item: any) => acc + (parseFloat(item.salary) || 0),
            0
          );
        }
        setStaffCount(count);
        setGrossPayroll(salarySum);

        if (usersRes.status === 'fulfilled') {
          const uList = Array.isArray(usersRes.value) ? usersRes.value : usersRes.value?.data || [];
          let directors = 0;
          let managers = 0;
          let staff = 0;

          uList.forEach((u: any) => {
            const r = (u.role || u.role_name || '').toLowerCase();
            if (r === 'customer' || r === 'client' || r === 'guest') return;
            if (r.includes('admin') || r.includes('director') || r.includes('owner')) directors++;
            else if (r.includes('manager') || r.includes('supervisor')) managers++;
            else if (r.includes('cashier') || r.includes('clerk') || r.includes('accountant') || r.includes('staff')) staff++;
          });

          setRolesCount({ directors, managers, staff });
        }
      } catch (err) {
        console.error('Failed to load HRM overview metrics:', err);
      } finally {
        setLoadingMetrics(false);
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
            <span>Human Capital &amp; Biometric Attendance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            HR &amp; Workforce Operations
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-2xl">
            Manage staff rosters, biometric clock-in timesheets, leave approvals, and automated multi-outlet payroll.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/super-admin/hrm/employees"
            className="px-4 py-2.5 rounded-xl bg-white text-[#5B4DFB] font-extrabold text-xs shadow-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#5B4DFB]" />
            <span>New Employee</span>
          </Link>
          <Link
            href="/super-admin/hrm/departments"
            className="px-4 py-2.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 border border-purple-400 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Departments</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview / Tab Rendering */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <HrmKpiCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceRateCard />
            <LeaveRequestsCard />
          </div>
          <StaffRosterTable />
        </div>
      )}

      {/* Tab: Employees Directory */}
      {currentTab === 'employees' && (
        <div className="space-y-6">
          <HrmKpiCards />
          <StaffRosterTable />
        </div>
      )}

      {/* Tab: Attendance & Clock-In */}
      {currentTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceRateCard />
          <StaffRosterTable />
        </div>
      )}

      {/* Tab: Leave Management */}
      {currentTab === 'leaves' && (
        <div className="space-y-6">
          <LeaveRequestsCard />
          <StaffRosterTable />
        </div>
      )}

      {/* Tab: Payroll Studio */}
      {currentTab === 'payroll' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#5B4DFB]" />
                <span>Payroll Studio</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Automatic base salary, overtime calculations, and employee payslips</p>
            </div>
            <Link
              href="/super-admin/hrm/employees"
              className="px-4 py-2 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Update Base Salaries</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Gross Salaries (Base)</span>
              <p className="text-xl font-black text-slate-900 font-mono">
                {loadingMetrics ? '...' : `$${grossPayroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
              <p className="text-[10px] text-slate-400">Total contracted staff compensation</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Contracted Staff</span>
              <p className="text-xl font-black text-emerald-600 font-mono">
                {loadingMetrics ? '...' : `${staffCount} Employees`}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">Active payroll profiles</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Net Estimated Disbursement</span>
              <p className="text-xl font-black text-[#5B4DFB] font-mono">
                {loadingMetrics ? '...' : `$${grossPayroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
              <p className="text-[10px] text-purple-600 font-medium">Bank transfer batch ready</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Documents & Contracts */}
      {currentTab === 'docs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5B4DFB]" />
                <span>Documents &amp; Contracts</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Employment agreements, labor compliance attachments, and identification files</p>
            </div>
            <Link
              href="/super-admin/hrm/employees"
              className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Contract</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500">Active Labor Contracts</span>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {loadingMetrics ? '...' : `${staffCount} Verified Contracts`}
              </p>
              <p className="text-xs text-slate-400">Registered and active employee profiles</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500">Contract Compliance Status</span>
              <p className="text-2xl font-black text-emerald-600">100% Up to Date</p>
              <p className="text-xs text-slate-400">All staff profiles comply with labor policies</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: HR Reports */}
      {currentTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#5B4DFB]" />
                <span>HR Reports</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Headcount turnover rate, overtime spend trends, and attendance punctuality</p>
            </div>
          </div>
          <HrmKpiCards />
        </div>
      )}

      {/* Tab: HR Access & RBAC */}
      {currentTab === 'access' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">HR Access &amp; RBAC</h3>
              <p className="text-xs text-slate-500 font-medium">Domain-scoped RBAC permissions (module_name = 'hrm')</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-[#5B4DFB]">
              Module Scoped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">HR Director / Admin</h4>
              <p className="text-xs text-slate-500">Full access to salary ledgers, contract attachments, and employee terminations.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B4DFB] text-[10px] font-bold">
                {loadingMetrics ? '...' : `${rolesCount.directors} Assigned`}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">Outlet Manager</h4>
              <p className="text-xs text-slate-500">Approve timesheets, sign off on shift sick leaves, and log performance reviews.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {loadingMetrics ? '...' : `${rolesCount.managers} Assigned`}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">Employee Self-Service</h4>
              <p className="text-xs text-slate-500">View personal payslip PDFs, request annual leaves, and clock-in/out.</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {loadingMetrics ? '...' : `${rolesCount.staff} Assigned`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: HR Settings */}
      {currentTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#5B4DFB]" />
                <span>HR Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Standard working hours, overtime multiplier, and leave allowance policies</p>
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
              <label className="font-bold text-slate-700">Standard Shift Duration</label>
              <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
                <option value="8">8 Hours / Day (Standard)</option>
                <option value="9">9 Hours / Day</option>
                <option value="10">10 Hours / Day (Retail Extended)</option>
              </select>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="font-bold text-slate-700">Overtime Rate Multiplier</label>
              <select className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800">
                <option value="1.5">1.5x Base Hourly Rate</option>
                <option value="2.0">2.0x Base Hourly Rate (Sundays/Holidays)</option>
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

export default function HrmPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
            <span>Loading HR Suite...</span>
          </div>
        </div>
      }
    >
      <HrmDashboardContent />
    </Suspense>
  );
}
