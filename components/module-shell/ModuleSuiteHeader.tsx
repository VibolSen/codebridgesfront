'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Building2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Monitor,
  Briefcase,
  Boxes,
  DollarSign,
  Users,
  ShoppingBag,
  ShieldCheck,
  Check,
  ExternalLink,
  Menu,
  Store,
  ChefHat,
  Tv,
} from 'lucide-react';
import { getAuthUser, logoutApi, getRoleDisplayName } from '@/lib/api';
import { getEnabledModulesForOrg, fetchAndSyncModulesForOrg } from '@/lib/modules';

interface ModuleOption {
  id: string;
  name: string;
  category: string;
  href: string;
  icon: any;
  color: string;
  bgColor: string;
  tag?: string;
}

const ALL_MODULES: ModuleOption[] = [
  {
    id: 'pos',
    name: 'Point of Sale (POS)',
    category: 'Sales & Management',
    href: '/pos',
    icon: Monitor,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    tag: 'Cockpit',
  },
  {
    id: 'terminal',
    name: 'Cashier Register Terminal',
    category: 'Frontline Kiosk',
    href: '/pos/terminal',
    icon: Store,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    tag: 'Live',
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehouse',
    category: 'Supply Chain',
    href: '/inventory',
    icon: Boxes,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    id: 'accounting',
    name: 'Accounting & Finance',
    category: 'Finance & Ledgers',
    href: '/accounting',
    icon: DollarSign,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  {
    id: 'hrm',
    name: 'HR & Workforce',
    category: 'Staff & PINs',
    href: '/hrm',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'crm',
    name: 'CRM & Pipeline',
    category: 'Customer Growth',
    href: '/crm',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'kds',
    name: 'Kitchen Display (KDS)',
    category: 'Kitchen Orders',
    href: '/kds',
    icon: ChefHat,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    id: 'cfd',
    name: 'Customer Display (CFD)',
    category: 'Secondary Screen',
    href: '/pos/customer-display',
    icon: Tv,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

interface ModuleSuiteHeaderProps {
  currentModuleId: 'pos' | 'crm' | 'hrm' | 'accounting' | 'inventory';
  moduleTitle: string;
  moduleIcon: any;
  onToggleSidebar?: () => void;
}

export function ModuleSuiteHeader({
  currentModuleId,
  moduleTitle,
  moduleIcon: ModuleIcon,
  onToggleSidebar,
}: ModuleSuiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [waffleOpen, setWaffleOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);

  const waffleRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const syncModulesForOrg = (org: string) => {
    if (!org) {
      setEnabledModules(['pos']);
      return;
    }
    const currentUser = getAuthUser();
    if (currentUser?.role === 'super_admin') {
      setEnabledModules(['pos', 'inventory', 'accounting', 'hrm', 'crm', 'shop']);
      return;
    }
    const cached = getEnabledModulesForOrg(org);
    setEnabledModules(cached.length > 0 ? cached : ['pos']);
    fetchAndSyncModulesForOrg(org).then((cloud) => {
      if (cloud && cloud.length > 0) {
        setEnabledModules(cloud);
      }
    });
  };

  useEffect(() => {
    const currentUser = getAuthUser();
    setUser(currentUser);
    const storedOrg = localStorage.getItem('active_org') || currentUser?.tenant_name || currentUser?.company || 'Primary Organization';
    setActiveOrg(storedOrg);
    syncModulesForOrg(storedOrg);

    const handleOrgChange = (e: any) => {
      const newOrg = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(newOrg);
      syncModulesForOrg(newOrg);
    };

    const handleModulesChange = (e: any) => {
      const updated = e.detail?.updated;
      if (Array.isArray(updated)) {
        setEnabledModules(updated);
      }
    };

    window.addEventListener('cb_org_changed', handleOrgChange);
    window.addEventListener('cb_modules_changed', handleModulesChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (waffleRef.current && !waffleRef.current.contains(e.target as Node)) {
        setWaffleOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
      window.removeEventListener('cb_modules_changed', handleModulesChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore
    }
    localStorage.clear();
    router.push('/login');
  };

  const isModuleActiveForTenant = (modId: string) => {
    if (user?.role === 'super_admin') return true;
    if (enabledModules.includes(modId)) return true;
    if (modId === 'pos' && (enabledModules.includes('pos-management') || enabledModules.includes('pos'))) return true;
    if (modId === 'inventory' && (enabledModules.includes('inventory-suite') || enabledModules.includes('inventory'))) return true;
    if (modId === 'crm' && (enabledModules.includes('crm-suite') || enabledModules.includes('crm'))) return true;
    if (modId === 'hrm' && (enabledModules.includes('hr-workforce') || enabledModules.includes('hrm'))) return true;
    if (modId === 'accounting' && (enabledModules.includes('finance-reconciliation') || enabledModules.includes('accounting') || enabledModules.includes('finance'))) return true;
    return false;
  };

  const visibleModules = ALL_MODULES.filter((m) => isModuleActiveForTenant(m.id));

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Sidebar Toggle + Waffle Switcher + Active Module Branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Waffle App Launcher Button */}
        <div className="relative" ref={waffleRef}>
          <button
            onClick={() => setWaffleOpen(!waffleOpen)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              waffleOpen
                ? 'bg-purple-50 border-purple-300 text-[#5B4DFB] shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="App Launcher / Switch Suite"
          >
            <LayoutGrid className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Waffle Dropdown Menu */}
          {waffleOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  CODEBRIDGE POS APPS
                </span>
                <span className="text-[10px] font-bold text-[#5B4DFB] bg-purple-50 px-2 py-0.5 rounded-full">
                  POS Ecosystem
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 max-h-[420px] overflow-y-auto pr-1">
                {ALL_MODULES.map((mod) => {
                  const IconComp = mod.icon;
                  const isCurrent = mod.id === currentModuleId || pathname === mod.href;
                  return (
                    <Link
                      key={mod.id}
                      href={mod.href}
                      target={mod.href.includes('/terminal') || mod.href.includes('/customer-display') || mod.href.includes('/kds') ? '_blank' : undefined}
                      onClick={() => setWaffleOpen(false)}
                      className={`p-2.5 rounded-2xl flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-purple-50/80 border border-purple-200 shadow-xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${mod.bgColor} ${mod.color} flex items-center justify-center font-bold shrink-0`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-900">{mod.name}</span>
                            {mod.tag && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                                {mod.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{mod.category}</p>
                        </div>
                      </div>

                      {isCurrent && <Check className="w-4 h-4 text-[#5B4DFB] shrink-0" />}
                    </Link>
                  );
                })}
              </div>

              {user?.role === 'super_admin' && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end px-2">
                  <Link
                    href="/super-admin/dashboard"
                    onClick={() => setWaffleOpen(false)}
                    className="text-[11px] font-bold text-[#5B4DFB] hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    <span>Super Admin</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Module Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
          <ModuleIcon className="w-4 h-4 text-slate-700" />
          <span className="font-extrabold text-xs text-slate-900">{moduleTitle}</span>
        </div>
      </div>

      {/* Center/Right: Org Picker + Notifications + User Menu */}
      <div className="flex items-center gap-3">
        {/* Workspace Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-orange-500" />
          <span className="truncate max-w-[180px]">{activeOrg}</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        {/* User Profile Pill & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-[11px]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="font-bold text-slate-800 hidden md:inline truncate max-w-[120px]">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-extrabold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email || 'user@codebridges.io'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-extrabold uppercase border border-orange-200">
                  {getRoleDisplayName(user, activeOrg)}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/super-admin/security/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
                {user?.role === 'super_admin' && (
                  <Link
                    href="/super-admin/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 font-semibold text-orange-700 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Super Admin Console</span>
                  </Link>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
