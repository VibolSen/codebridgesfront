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
import { CreateOrgModal } from '@/components/tenant';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'personal' | 'company'>('company');
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
          name: userTenantName || 'CodeBridges Platform',
          type: 'Company',
        });
      }

      // 2. If super_admin, fetch registered tenant organizations from backend API
      if (currentUser.role === 'super_admin') {
        try {
          const tenantsRes = await getSuperAdminTenantsApi();
          const tenantsData = Array.isArray(tenantsRes)
            ? tenantsRes
            : tenantsRes?.data || [];

          tenantsData.forEach((t: any) => {
            if (
              !orgList.some(
                (existing) =>
                  existing.name.toLowerCase() === (t.name || '').toLowerCase()
              )
            ) {
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
      if (
        savedActive &&
        savedActive !== 'No Organization Yet! Please Create' &&
        orgList.some((o) => o.name === savedActive)
      ) {
        setActiveOrg(savedActive);
      } else if (orgList.length > 0) {
        setActiveOrg(orgList[0].name);
        localStorage.setItem('active_org', orgList[0].name);
      } else {
        const fallback = isPlatformOwner
          ? 'CodeBridges Platform'
          : 'No Organization Yet! Please Create';
        setActiveOrg(fallback);
        localStorage.setItem('active_org', fallback);
      }

      setLoading(false);
    }

    loadRealOrganizations();

    // Listen to live organization changes
    const handleOrgChanged = (e: any) => {
      const newOrgName = e.detail?.orgName;
      if (newOrgName) {
        setActiveOrg(newOrgName);
      }
      loadRealOrganizations();
    };

    window.addEventListener('cb_org_changed', handleOrgChanged);
    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChanged);
    };
  }, []);

  const handleSelectOrg = (orgName: string) => {
    setActiveOrg(orgName);
    localStorage.setItem('active_org', orgName);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cb_org_changed', { detail: { orgName } }));
    }
    setShowOrgDropdown(false);
  };

  const handleCreateOrg = (type: 'personal' | 'company') => {
    setShowCreateDropdown(false);
    setCreateModalType(type);
    setIsCreateModalOpen(true);
  };

  const handleOrgCreated = (newOrg: { id: string | number; name: string; type: 'Personal' | 'Company' }) => {
    setOrganizations((prev) => {
      if (prev.some((o) => o.name === newOrg.name)) return prev;
      return [{ id: newOrg.id, name: newOrg.name, type: newOrg.type }, ...prev];
    });
    setActiveOrg(newOrg.name);
    localStorage.setItem('active_org', newOrg.name);
  };

  return (
    <div
      className="relative inline-flex items-center gap-2 z-50"
      ref={dropdownRef}
    >

      {/* All Organizations Dropdown Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setShowOrgDropdown(!showOrgDropdown);
            setShowCreateDropdown(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-black text-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <Building2 className="w-3.5 h-3.5 text-[#5B4DFB]" />
          <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeOrg}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showOrgDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 text-slate-800 text-xs space-y-1.5"
            >
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1 flex items-center justify-between">
                <span>Your Workspaces &amp; Outlets</span>
                {user && (
                  <span className="text-[9px] bg-purple-50 text-[#5B4DFB] px-1.5 py-0.5 rounded font-extrabold">
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
                      setCreateModalType('company');
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
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
                    setCreateModalType('company');
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-orange-600 hover:bg-orange-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-orange-600" />
                  <span>Register New Workspace</span>
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
            setCreateModalType('company');
            setIsCreateModalOpen(true);
            setShowOrgDropdown(false);
            setShowCreateDropdown(false);
          }}
          className="bg-slate-100 hover:bg-slate-200/90 text-slate-800 font-extrabold text-sm w-9 h-9 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
          title="Create New Organization"
        >
          <Plus className="w-4 h-4 text-slate-800" />
        </motion.button>
      </div>

      {/* Instant Popup Create Organization Modal */}
      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialType={createModalType}
        onOrgCreated={handleOrgCreated}
      />
    </div>
  );
}

