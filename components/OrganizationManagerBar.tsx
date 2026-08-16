'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Building2,
  User,
  Plus,
  ChevronDown,
  Sparkles,
  Check,
  LogIn,
  Store,
  Loader2,
} from 'lucide-react';
import {
  getAuthToken,
  getAuthUser,
  getOutletsApi,
  getSuperAdminTenantsApi,
} from '@/lib/api';

export interface OrgItem {
  id: string | number;
  name: string;
  type: 'Company' | 'Outlet' | 'Tenant' | 'Personal';
  code?: string;
}

export function OrganizationManagerBar() {
  const router = useRouter();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrgItem[]>([]);
  const [activeOrg, setActiveOrg] = useState<string>('Primary Organization');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false);
        setShowOrgDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadRealOrganizations() {
      setLoading(true);
      const token = getAuthToken();
      const currentUser = getAuthUser();

      if (!token || !currentUser) {
        setUser(null);
        setOrganizations([]);
        setActiveOrg('Guest Workspace');
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const orgList: OrgItem[] = [];

      // 1. Add user's primary company/tenant workspace if set or if platform owner
      const isPlatformOwner = currentUser.role === 'super_admin';
      const userTenantName =
        currentUser.tenant_name ||
        currentUser.company_name ||
        currentUser.company;

      if (userTenantName || isPlatformOwner) {
        orgList.push({
          id: 'primary-company',
          name: userTenantName || 'CodeBridges Enterprise',
          type: 'Company',
        });
      }

      // 2. Fetch real outlets from backend API
      try {
        const outletsRes = await getOutletsApi();
        const outletsData = Array.isArray(outletsRes)
          ? outletsRes
          : outletsRes?.data || [];

        if (outletsData.length > 0) {
          outletsData.forEach((outlet: any) => {
            orgList.push({
              id: `outlet-${outlet.id}`,
              name: outlet.name || `Outlet #${outlet.id}`,
              type: 'Outlet',
              code: outlet.code,
            });
          });
        }
      } catch (err) {
        console.warn('[OrganizationManagerBar] Could not load outlets API:', err);
      }

      // 3. If super_admin, fetch real tenants from backend API
      if (currentUser.role === 'super_admin') {
        try {
          const tenantsRes = await getSuperAdminTenantsApi();
          const tenantsData = Array.isArray(tenantsRes)
            ? tenantsRes
            : tenantsRes?.data || [];

          tenantsData.forEach((t: any) => {
            if (!orgList.some((existing) => existing.name === t.name)) {
              orgList.push({
                id: `tenant-${t.id}`,
                name: t.name,
                type: 'Tenant',
              });
            }
          });
        } catch (err) {
          console.warn('[OrganizationManagerBar] Could not load tenants API:', err);
        }
      }

      setOrganizations(orgList);

      // Restore active organization from localStorage if set
      const savedActive = localStorage.getItem('active_org');
      if (savedActive && orgList.some((o) => o.name === savedActive)) {
        setActiveOrg(savedActive);
      } else if (orgList.length > 0) {
        setActiveOrg(orgList[0].name);
      } else {
        setActiveOrg('No Organization Yet! Please Create');
      }

      setLoading(false);
    }

    loadRealOrganizations();
  }, []);

  const handleSelectOrg = (orgName: string) => {
    setActiveOrg(orgName);
    localStorage.setItem('active_org', orgName);
    setShowOrgDropdown(false);
  };

  const handleCreateOrg = (type: 'personal' | 'company') => {
    setShowCreateDropdown(false);
    router.push(`/register-tenant?type=${type}`);
  };

  const getManageButtonLabel = () => {
    if (!user) return 'Sign In to Workspace';
    const role = user.role || 'cashier';
    if (['super_admin', 'administrator', 'tenant_admin', 'admin', 'outlet_manager'].includes(role)) {
      return 'Manage Organization';
    }
    if (role === 'inventory_clerk') return 'Inventory Hub';
    if (role === 'accountant') return 'Finance Hub';
    return 'POS Terminal';
  };

  const handleManageClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const role = user.role || 'cashier';
    if (['super_admin', 'administrator', 'tenant_admin', 'admin', 'outlet_manager'].includes(role)) {
      router.push('/super-admin/dashboard');
    } else if (role === 'inventory_clerk') {
      router.push('/super-admin/inventory');
    } else if (role === 'accountant') {
      router.push('/super-admin/reconciliation');
    } else {
      router.push('/pos');
    }
  };

  return (
    <div
      className="relative inline-flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-md text-slate-800"
      ref={dropdownRef}
    >
      {/* Manage Organization Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleManageClick}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
      >
        <Settings className="w-4 h-4 text-white" />
        <span>{getManageButtonLabel()}</span>
      </motion.button>

      {/* All Organizations Dropdown Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setShowOrgDropdown(!showOrgDropdown);
            setShowCreateDropdown(false);
          }}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
          ) : (
            <Building2 className="w-4 h-4 text-slate-600" />
          )}
          <span className="max-w-[150px] truncate">{activeOrg}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
        </motion.button>

        {/* All Organizations List Dropdown */}
        <AnimatePresence>
          {showOrgDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 text-slate-800 text-xs space-y-1"
            >
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1 flex items-center justify-between">
                <span>Your Workspaces & Outlets</span>
                {user && (
                  <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-extrabold">
                    API SYNCED
                  </span>
                )}
              </div>

              {!user ? (
                /* Unauthenticated Guest State */
                <div className="p-3 text-center space-y-2">
                  <p className="text-slate-600 font-medium text-xs">
                    Sign in to access your organization workspaces and store outlets.
                  </p>
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false);
                      router.push('/login');
                    }}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In Now</span>
                  </button>
                </div>
              ) : organizations.length === 0 ? (
                /* Authenticated but no organization created */
                <div className="p-3 text-center text-slate-600 font-medium space-y-2">
                  <p className="text-xs font-semibold text-slate-700">No organization created yet!</p>
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false);
                      router.push('/register-tenant');
                    }}
                    className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              ) : (
                /* Real Organization & Outlet List */
                organizations.map((org) => {
                  const isSelected = activeOrg === org.name;
                  const Icon = org.type === 'Personal' ? User : Building2;

                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrg(org.name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left ${
                        isSelected
                          ? 'bg-orange-50 text-orange-600 font-extrabold border border-orange-200/60'
                          : 'text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{org.name}</p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {org.type}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-orange-600 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })
              )}

              {/* Register New Tenant Link */}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowOrgDropdown(false);
                    router.push('/register-tenant');
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-orange-600 hover:bg-orange-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-orange-600" />
                  <span>Register New Tenant</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plus Button for Create New Organization */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowCreateDropdown(!showCreateDropdown);
            setShowOrgDropdown(false);
          }}
          className="bg-slate-100 hover:bg-slate-200/90 text-slate-800 font-extrabold text-sm w-9 h-9 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
          title="Create New Organization"
        >
          <Plus className="w-4 h-4 text-slate-800" />
        </motion.button>

        {/* Create New Organization Dropdown */}
        <AnimatePresence>
          {showCreateDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 text-slate-800"
            >
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 py-1 mb-1 border-b border-slate-100">
                Create new organization
              </p>

              <div className="space-y-1">
                <button
                  onClick={() => handleCreateOrg('personal')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 text-orange-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs">
                    <User className="w-5 h-5 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight">
                      Personal Workspace
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      For solopreneurs & individual use
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateOrg('company')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 text-orange-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs">
                    <Building2 className="w-5 h-5 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight">
                      Company / Multi-Outlet
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      For teams & enterprise chains
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

