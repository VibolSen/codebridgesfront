'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { getAuthUser, logoutApi, getRoleDisplayName } from '@/lib/api';

interface ModuleSuiteHeaderProps {
  currentModuleId: 'pos' | 'crm' | 'hrm' | 'accounting' | 'inventory';
  moduleTitle: string;
  moduleIcon: any;
  onToggleSidebar?: () => void;
}

export function ModuleSuiteHeader({
  currentModuleId: _currentModuleId,
  moduleTitle,
  moduleIcon: ModuleIcon,
  onToggleSidebar,
}: ModuleSuiteHeaderProps) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getAuthUser();
    setUser(currentUser);
    const storedOrg =
      localStorage.getItem('active_org') ||
      currentUser?.tenant_name ||
      currentUser?.company ||
      'Primary Organization';
    setActiveOrg(storedOrg);

    const handleOrgChange = (e: any) => {
      const newOrg = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(newOrg);
    };

    window.addEventListener('cb_org_changed', handleOrgChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
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
    router.push('/CodeBridgesOnboardingLaunchpad');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Sidebar Toggle + Active Module Branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Current Module Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 shadow-2xs">
          <ModuleIcon className="w-4 h-4 text-orange-600" />
          <span className="font-extrabold text-xs text-orange-950">{moduleTitle}</span>
        </div>
      </div>

      {/* Right: Org Picker + Notifications + User Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Workspace Organization Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-orange-500" />
          <span className="truncate max-w-[180px]">{activeOrg}</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        {/* User Profile Pill & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-xs cursor-pointer"
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
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Super Admin Console</span>
                  </Link>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
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
