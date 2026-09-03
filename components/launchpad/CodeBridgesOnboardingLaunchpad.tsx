'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Lock,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Copy,
  Check,
  Bell,
  ChevronDown,
  LogOut,
  Sliders,
  DollarSign,
  Boxes,
  Briefcase,
  ChefHat,
  Tv,
  Monitor,
  Calendar,
  Zap,
} from 'lucide-react';

import {
  getAuthToken,
  getAuthUser,
  clearAuthToken,
  getOutletsApi,
  getUsersApi,
  getSuperAdminTenantsApi,
  getEnabledModulesForOrg,
  fetchAndSyncModulesForOrg,
  enableModuleForOrg,
  disableModuleForOrg,
  enableAllModulesForOrg,
  disableAllModulesForOrg,
  getRoleDisplayName,
  OrgItem,
} from '@/lib/api';

import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';
import { ModuleConfirmDialog, ConfirmDialogState } from './ModuleConfirmDialog';
import { ManageModulesModal } from './ManageModulesModal';
import { RequireOrgModal } from './RequireOrgModal';

export function CodeBridgesOnboardingLaunchpad() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [userOrganizations, setUserOrganizations] = useState<OrgItem[]>([]);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [showRequireOrgModal, setShowRequireOrgModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [outletsCount, setOutletsCount] = useState<number>(0);

  // Modal States
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    type: 'enable',
    module: null,
    orgName: '',
    onConfirm: () => {},
  });
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [selectedModuleForEnable, setSelectedModuleForEnable] = useState<any>(null);
  const [targetOrgForEnable, setTargetOrgForEnable] = useState<string>('');
  const [modalSelectedModuleIds, setModalSelectedModuleIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const syncUserState = () => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    setIsAuthenticated(!!token);
    setUser(currentUser);

    if (typeof window !== 'undefined') {
      const storedOrg = localStorage.getItem('active_org') || currentUser?.tenant_name || '';
      setActiveOrg(storedOrg);
      if (storedOrg) {
        refreshEnabledModules(storedOrg);
      }
    }
  };

  const refreshEnabledModules = async (org: string) => {
    if (!org || org === 'No Organization Yet! Please Create') {
      setEnabledModules([]);
      return;
    }
    const cached = getEnabledModulesForOrg(org);
    setEnabledModules(cached);

    try {
      const cloudModules = await fetchAndSyncModulesForOrg(org);
      if (cloudModules && cloudModules.length > 0) {
        setEnabledModules(cloudModules);
      }
    } catch {
      // Keep cached
    }
  };

  const loadOrganizations = async () => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    setIsAuthenticated(!!token);
    setUser(currentUser);

    if (!token || !currentUser) {
      setUserOrganizations([]);
      setActiveOrg('');
      setEnabledModules([]);
      return;
    }

    const orgList: OrgItem[] = [];
    const isPlatformOwner = currentUser.role === 'super_admin';
    const userTenantName =
      currentUser.tenant_name || currentUser.company_name || currentUser.company;

    if (userTenantName || isPlatformOwner) {
      orgList.push({
        id: 'primary-company',
        name: userTenantName || 'CodeBridges Enterprise',
        type: 'Company',
      });
    }

    if (currentUser.outlet_id || currentUser.role === 'admin' || isPlatformOwner) {
      try {
        const outletsRes = await getOutletsApi();
        const outletsData = Array.isArray(outletsRes) ? outletsRes : outletsRes?.data || [];
        outletsData.forEach((outlet: any) => {
          orgList.push({
            id: `outlet-${outlet.id}`,
            name: outlet.name || `Outlet #${outlet.id}`,
            type: 'Outlet',
          });
        });
        setOutletsCount(outletsData.length > 0 ? outletsData.length : 1);
      } catch (err) {
        console.error('Failed to load outlets:', err);
        setOutletsCount(1);
      }
    } else {
      setOutletsCount(1);
    }

    if (isPlatformOwner) {
      try {
        const tenantsRes = await getSuperAdminTenantsApi();
        const tenantsData = Array.isArray(tenantsRes) ? tenantsRes : tenantsRes?.data || [];
        tenantsData.forEach((t: any) => {
          if (!orgList.some((o) => o.name === t.name)) {
            orgList.push({
              id: `tenant-${t.id}`,
              name: t.name,
              type: 'Company',
            });
          }
        });
      } catch (err) {
        console.error('Failed to load tenants:', err);
      }
    }

    // Fetch live users / staff headcount
    try {
      const usersRes = await getUsersApi();
      const usersData = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
      setStaffCount(usersData.length > 0 ? usersData.length : 1);
    } catch {
      setStaffCount(1);
    }

    setUserOrganizations(orgList);

    const storedOrg = localStorage.getItem('active_org');
    if (storedOrg && orgList.some((o) => o.name === storedOrg)) {
      setActiveOrg(storedOrg);
      refreshEnabledModules(storedOrg);
    } else if (orgList.length > 0) {
      setActiveOrg(orgList[0].name);
      localStorage.setItem('active_org', orgList[0].name);
      refreshEnabledModules(orgList[0].name);
    } else {
      setActiveOrg('');
      setEnabledModules([]);
    }
  };

  useEffect(() => {
    loadOrganizations();

    const handleOrgChange = (e: any) => {
      const orgName = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(orgName);
      refreshEnabledModules(orgName);
    };

    window.addEventListener('cb_org_changed', handleOrgChange);
    window.addEventListener('cb_user_updated', syncUserState);
    window.addEventListener('storage', syncUserState);

    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
      window.removeEventListener('cb_user_updated', syncUserState);
      window.removeEventListener('storage', syncUserState);
    };
  }, []);

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText('ORG-8821-CBD');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const isPosActive = enabledModules.includes('pos-management') || enabledModules.length > 0;
  const roleTitle = getRoleDisplayName(user, activeOrg);

  // Available Ecosystem Catalog Items
  const CATALOG_MODULES = [
    {
      id: 'bill-subscription',
      name: 'Bill & SaaS Subscription',
      monogram: 'BS',
      category: 'Finance & Billing',
      description: 'Automate recurring customer invoices, subscription quotas, and failed payment retry webhooks.',
      bgPill: 'bg-slate-100 text-slate-900',
      isAvailable: true,
      href: '/super-admin/finance/billing',
    },
    {
      id: 'inventory-suite',
      name: 'Multi-Warehouse Inventory',
      monogram: 'IV',
      category: 'Supply Chain Logistics',
      description: 'Real-time multi-warehouse stock levels, PO 3-way matching, FIFO valuation, and barcode stocktake.',
      bgPill: 'bg-amber-50 text-amber-700',
      isAvailable: true,
      href: '/inventory',
    },
    {
      id: 'staff-hrm',
      name: 'HRM, Staff & Payroll',
      monogram: 'HR',
      category: 'Workforce Management',
      description: 'Staff headcount directory, 4-digit POS register PIN quick-switch, timesheets, and payroll.',
      bgPill: 'bg-rose-50 text-rose-600',
      isAvailable: true,
      href: '/hrm',
    },
    {
      id: 'crm-loyalty',
      name: 'Customer CRM & Loyalty',
      monogram: 'CR',
      category: 'Customer Growth',
      description: 'Customer contact directory, wholesale B2B contracts, VIP loyalty points, and purchase history.',
      bgPill: 'bg-blue-50 text-blue-600',
      isAvailable: true,
      href: '/crm',
    },
    {
      id: 'accounting-ledger',
      name: 'Double-Entry Accounting',
      monogram: 'AC',
      category: 'Financial Ledgers',
      description: 'Chart of Accounts (COA), automated sales journal postings, bank reconciliation, and P&L statements.',
      bgPill: 'bg-emerald-50 text-emerald-700',
      isAvailable: true,
      href: '/accounting',
    },
    {
      id: 'kds-kitchen',
      name: 'Kitchen Display Screen (KDS)',
      monogram: 'KD',
      category: 'Order Fulfillment',
      description: 'Real-time kitchen order dispatch screen with preparation timers, course firing, and bump bar.',
      bgPill: 'bg-orange-50 text-orange-700',
      isAvailable: true,
      href: '/kds',
    },
    {
      id: 'cfd-display',
      name: 'Customer Display Screen (CFD)',
      monogram: 'CF',
      category: 'Customer Facing',
      description: 'Dual-monitor display facing customers with live cart breakdown and dynamic NBC Bakong KHQR.',
      bgPill: 'bg-cyan-50 text-cyan-700',
      isAvailable: true,
      href: '/pos/customer-display',
    },
    {
      id: 'enterprise-erp',
      name: 'Enterprise Resource Planning',
      monogram: 'EP',
      category: 'Enterprise Suite',
      description: 'Centralized multi-company management system unifying supply chain, financials, and multi-outlets.',
      bgPill: 'bg-purple-50 text-purple-700',
      isAvailable: true,
      href: '/pos',
    },
    {
      id: 'telemetry-hub',
      name: 'Platform Infrastructure Hub',
      monogram: 'TM',
      category: 'Platform Operations',
      description: 'Real-time microservices latency monitoring, connection pools, RabbitMQ, and Redis cache telemetry.',
      bgPill: 'bg-indigo-50 text-indigo-700',
      isAvailable: true,
      href: '/super-admin/infrastructure',
    },
  ];

  const filteredCatalog = CATALOG_MODULES.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 selection:bg-[#5B4DFB] selection:text-white pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Top Global Navigation Bar (OONE Reference Standard) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Org Switcher */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200/80 overflow-hidden">
                <img src="/logo/Codebridge.png" alt="CodeBridges Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-sm tracking-tight text-slate-900 group-hover:text-[#5B4DFB] transition-colors">
                CodeBridges Platform
              </span>
            </Link>

            {/* Workspace Switcher Pill (Only for Merchant / Store Managers - Hidden for Super Admin) */}
            {user?.role !== 'super_admin' ? (
              <div className="hidden sm:flex items-center">
                <OrganizationManagerBar />
              </div>
            ) : (
              <Link
                href="/super-admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-black text-[#5B4DFB] transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Control Hub</span>
              </Link>
            )}
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#5B4DFB] text-white flex items-center justify-center text-[10px] font-black">
                    {(user.name || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{user.name || 'User'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white text-xs font-black shadow-sm transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* User Dropdown Menu */}
              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 font-sans">
                  <div className="p-2.5 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-50 text-[#5B4DFB] border border-purple-100">
                      {roleTitle}
                    </span>
                  </div>

                  {user.role === 'super_admin' && (
                    <Link
                      href="/super-admin/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Super Admin Hub</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Page Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* A. Localized Greeting */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4DFB]" />
            <span>CodeBridges Core Suite</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, {user?.name || 'Partner'}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* B. Organization Identity Banner Card (OONE Reference Standard) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F6FB] border border-slate-200/60 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-slate-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {activeOrg || 'CodeBridges Master Organization'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100">
                  {roleTitle}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrgId}
                  title="Copy Org Identifier"
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Sub-Stats Strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span>{isPosActive ? '1 Active POS License' : '0 Modules Active'}</span>
                <span>•</span>
                <span>{staffCount} {staffCount === 1 ? 'Assigned Staff' : 'Assigned Staff'}</span>
                <span>•</span>
                <span>{outletsCount} {outletsCount === 1 ? 'Store Outlet' : 'Store Outlets'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/hrm"
              className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Manage Staff</span>
            </Link>
            <Link
              href="/super-admin/platform/tenants"
              className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* C. 4-Column Micro-Stats Strip (OONE Reference Standard) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Stat 1: Members */}
          <div className="space-y-1 sm:px-3 first:pl-0">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Total Headcount</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">{staffCount}</p>
            <p className="text-[11px] text-slate-400 font-medium">Active across store fleet</p>
          </div>

          {/* Stat 2: Pending */}
          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Pending Approvals</span>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">0</p>
            <p className="text-[11px] text-slate-400 font-medium">All shifts verified</p>
          </div>

          {/* Stat 3: Health Bar */}
          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>System Health</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-amber-600 font-mono">100%</p>
              <span className="text-[10px] text-slate-400 font-bold">All 6 Slices Live</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div className="w-full h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" />
            </div>
          </div>

          {/* Stat 4: Growth Sparkline */}
          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Fleet Coverage</span>
            </div>
            <p className="text-2xl font-black text-emerald-600 font-mono">{outletsCount} {outletsCount === 1 ? 'Outlet' : 'Outlets'}</p>
            <p className="text-[11px] text-slate-400 font-medium">Real-time sync operational</p>
          </div>
        </div>

        {/* D. Section 1: Active Running Module Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Active Running Modules (1 Core Suite Enabled)
              </h3>
            </div>
          </div>

          {/* Master POS Operating System Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B4DFB] flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">
                    CodeBridge POS Management Operating System
                  </h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Unified enterprise commerce platform bundle comprising Cashier Terminal, Shifts, Multi-Warehouse Stock, Double-Entry Finance, Staff PIN Attendance, CRM Loyalty, and Kitchen KDS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={user?.role === 'cashier' ? '/pos/terminal' : '/pos'}
                className="px-6 py-3 rounded-2xl bg-[#5B4DFB] hover:bg-[#4E3FE3] active:bg-[#3D30D2] text-white font-black text-xs shadow-md shadow-[#5B4DFB]/20 flex items-center gap-2 transition-all"
              >
                <span>{user?.role === 'cashier' ? 'Launch Cashier Terminal' : 'Launch POS Suite'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* E. Section 2: Available Ecosystem Modules (3-Column Grid) */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Available Platform Modules &amp; Integrated Services
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Modular enterprise services ready to launch across your store network
              </p>
            </div>

            {/* Search Input & View Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search module..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] shadow-2xs"
                />
              </div>
              <div className="p-1 bg-white rounded-xl border border-slate-200 flex items-center gap-1 shadow-2xs">
                <button type="button" className="p-1 rounded-lg bg-slate-100 text-slate-700">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between h-[190px]"
              >
                <div>
                  {/* Top: Monogram Pill & Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${mod.bgPill}`}
                    >
                      {mod.monogram}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{mod.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{mod.category}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mt-2">
                    {mod.description}
                  </p>
                </div>

                {/* Footer: Availability & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Included in Plan</span>
                  </span>

                  <Link
                    href={mod.href}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#F5F3FF] hover:text-[#5B4DFB] border border-slate-200/80 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
